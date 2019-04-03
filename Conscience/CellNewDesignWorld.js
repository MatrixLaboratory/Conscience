"use strict";

class CellDB{
    constructor () {
        this.data = null;
        
    }
    init(){
    }
    
    set (uri, data) {
        this.data[uri] = data
    }
    
    get (uri) {
        if (this.data[uri]) {
            return this.data[uri]
        }
        return false
    }
}
class WorldDB{
    constructor () {
        this.data = null;
    }
    init(){
    }
    set (uri, data) {
        this.data[uri] = data
        
    }
    
    get (uri) {
        if (this.data[uri]) {
            return this.data[uri]
        }
        return false
    }
}
class CellHistory {
    constructor (text) {
        if (text) {
            var obj = JSON.parse(text);
            //World id
            this.id = obj.id;
            //World cell info
            this.cellno = obj.cellno;
            this.adaption = obj.adaption;
            this.surviveability = obj.surviveability;
            this.division = obj.division;
            this.environment = obj.environment;
            this.day = obj.day;
            this.totoalscore = obj.totoalscore;
            this.worldtitle = obj.worldtitle;
            this.startcellid = obj.startcellid;
            this.endcellid = obj.endcellid;
            this.cellsdetail = obj.cellsdetail;
            this.version = obj.version;
            
        } else {
            this.id = 0;
            this.cellno = 0;
            this.adaption = 0;
            this.surviveability = 0;
            this.division = 0;
            this.environment = 0;
            this.day = 0;
            this.totoalscore = 0;
            this.worldtitle = "";
            this.startcellid = 0;
            this.endcellid = 0;
            this.cellsdetail = "";
            this.version = 2;
        }
    }
    
    init () {
        
    }
    
    
}

class CellEvolution {
    constructor (text) {
        if (text) {
            var obj = JSON.parse(text);
            // Cell id
            this.id = obj.id;
            //
            this.creator = obj.creator;
            //cell info
            this.cellno = obj.cellno;
            this.adaption = obj.adaption;
            this.surviveability = obj.surviveability;
            this.division = obj.division;
            this.environment = obj.environment;
            this.day = obj.day;
            this.totoalscore = obj.totoalscore;
            this.finaltitle = obj.finaltitle;
            this.belong = obj.belong;
            this.version = obj.version;
        } else {
            this.id = 0;
            this.creator =  "";
            this.cellno = 0;
            this.adaption = 0;
            this.surviveability = 0;
            this.division = 0;
            this.environment = 0;
            this.day = 0;
            this.totoalscore = 0;
            this.finaltitle = "";
            this.belong=0;
            this.version=2;
        }
    }
    
    init () {
        
    }
    
}



class CellEvolutionMainContract {
    init() {
        this.CellDB = new CellDB();
        
//        this.WorldDB = new WorldDB();
        
        let admAdd="whitematrix";
        let isOpen = true;
//        let totalcell = 0;
        let historyno = 1;
        storage.put("totalcell","0");
        storage.mapPut("nonce", "newtest", JSON.stringify(0));
        storage.put("currentworld","0");
        storage.put("inheritno","1000");
        let world0 = new CellHistory();
        storage.mapPut("WorldHistory","0",JSON.stringify(world0));
        
//        storage.put("nonce", JSON.stringify(0));

        // var cellworld =new CellHistory();
        // this.cellhistory.put(this.historyno,cellworld);
        // this.version = 2;
    }
    
    gethistoryno() {
        return this.historyno;
    }
    
    getIsOpen() {
        return this.isOpen;
    }
    
    gettotalcell() {
        return this.totalcell;
    }
    
    getAdminAddress() {
        return this.admAdd;
    }
    
    setIsOpen(isopen) {
        if (tx.publisher === this.admAdd) {
            this.isOpen = isopen;
        } else {
            throw new Error("Admin only");
        }
    }
    
    setCellno(cellno) {
        if (tx.publisher === this.admAdd) {
            this.totalcell = cellno;
        } else {
            throw new Error("Admin only");
        }
    }
    sethistoryno(historyno) {
        if (tx.publisher === this.admAdd) {
            this.historyno = historyno;
        } else {
            throw new Error("Admin only");
        }
    }
    setVersion(versionno) {
        if (Blockchain.transaction.from === this.admAdd) {
            this.isOpen = versionno;
        } else {
            throw new Error("Admin only");
        }
    }
    
    
    donate(){
        
        var bvalue = new BigNumber(Blockchain.transaction.value);
        this.balance = bvalue.add(this.balance);
        
    }
    //, cellno, adaption, surviveability, division, environment, day, totoalscore, finaltitle
    dnamerge(id, cellno, adaption, surviveability, division, environment, day, totoalscore, finaltitle) {
        //鉴定开始
//        if (!this.isOpen) {
//            throw new Error("Game is currently closed");
//        }
     
        id = id.trim();
        cellno = cellno.trim();
        adaption = adaption.trim();
        surviveability = surviveability.trim();
        division = division.trim();
        environment = environment.trim();
        day = day.trim();
        totoalscore = totoalscore.trim();
        finaltitle = finaltitle.trim();
        
        
        if (id === ""){
            throw new Error("empty id");
        }
        
        let cell = new CellEvolution();
        
        
        cell.id = id;
        cell.creator = tx.publisher;
        
        cell.cellno = cellno;
        cell.adaption = adaption;
        cell.surviveability = surviveability;
        cell.division = division;
        cell.environment = environment;
        cell.day = day;
        cell.totoalscore = totoalscore;
        cell.finaltitle = finaltitle;
        cell.belong = storage.get("currentworld");
        cell.version = this.version;
       
        let totalcellno = Number(storage.get("totalcell"));
        totalcellno++;
        
        storage.mapPut("CellHistory", totalcellno.toString(), JSON.stringify(cell));
        storage.put("totalcell",totalcellno.toString());
        

        let newcellworld =new CellHistory(storage.mapGet("WorldHistory",storage.get("currentworld")));
//        storage.mapPut("WorldHistory","0",JSON.stringify(world0));
//        this.CellDB.set(totoalcell,cell);
        // this.celldb.put(id, cell);
        
        // var newcellworld = WorldDB.get(this.historyno);
         newcellworld.id = storage.get("currentworld");
         newcellworld.cellno = Number(newcellworld.cellno) + Number(cellno);
         newcellworld.adaption = Number(newcellworld.adaption) + Number(adaption);
         newcellworld.surviveability = Number(newcellworld.surviveability) + Number(surviveability);
         newcellworld.division = Number(newcellworld.division) + Number(division);
         newcellworld.environment = Number(newcellworld.environment) + Number(environment);
         newcellworld.day = Number(newcellworld.day) + Number(day);
         newcellworld.totoalscore = Number(newcellworld.totoalscore) + Number(totoalscore);
         newcellworld.worldtitle = "World in Evolution";
        
         newcellworld.cellsdetail = newcellworld.cellsdetail.toString()+id.toString()+","+tx.publisher.toString()+","+cellno.toString()+","+adaption.toString()+","+surviveability.toString()+","+division.toString()+","+environment.toString()+","+day.toString()+","+totoalscore.toString()+","+finaltitle.toString()+","+ newcellworld.id+"|";
        
        
         newcellworld.endcellid = Number(id);
        storage.mapPut("WorldHistory",storage.get("currentworld"),JSON.stringify(newcellworld));
        // this.cellhistory.set(this.historyno,newcellworld);
        
        
         this.checkdeath(Number(newcellworld.cellno),Number(newcellworld.adaption),Number(newcellworld.surviveability),Number(newcellworld.division));
        
        
    }
    newinheritance(){
        
        let inheritnoN = Number(storage.get("inheritno"));
        inheritnoN++;
        
        storage.put("inheritno",inheritnoN.toString());

        
        
    }
    
     worldtitlecheck(){
          let newcellworld =new CellHistory(storage.mapGet("WorldHistory",storage.get("currentworld")));
         
         var inworldno = Number(newcellworld.endcellid) - Number(newcellworld.startcellid);
         if(inworldno > 100){
             newcellworld.worldtitle = "Highly evolved";
         }else if(inworldno > 50){
             newcellworld.worldtitle = "Lively";
    
         }else{
             newcellworld.worldtitle = "Quiet";
         }
    
         if(newcellworld.adaption > 10000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " High adaption";
    
         }else if(newcellworld.adaption >1000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " Normal adaption";
    
         }else{
             newcellworld.worldtitle = newcellworld.worldtitle + " Low adaption";
         }
    
    
         if(newcellworld.surviveability > 10000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " High surviveability";
    
         }else if(newcellworld.surviveability >1000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " Normal surviveability";
    
         }else{
             newcellworld.worldtitle = newcellworld.worldtitle + " Low surviveability";
         }
    
    
         if(newcellworld.division > 10000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " High division";
    
         }else if(newcellworld.division >1000000000){
             newcellworld.worldtitle = newcellworld.worldtitle + " Normal division";
    
         }else{
             newcellworld.worldtitle = newcellworld.worldtitle + " Low division";
         }
    
         if(newcellworld.environment > 1000){
             newcellworld.worldtitle = newcellworld.worldtitle + " Severe environment";
    
         }else if(newcellworld.division >500){
             newcellworld.worldtitle = newcellworld.worldtitle + " Normal environment";
    
         }else{
             newcellworld.worldtitle = newcellworld.worldtitle + " Gental environment";
         }
    
    
         var worldtype = "";
         worldtype = " Human World";
         if((newcellworld.cellno < 100000) && (newcellworld.day >5000)){
             worldtype= " Spirit World";
    
    
         }
    
         if((newcellworld.cellno >1000000000000) && (newcellworld.day >999)){
             worldtype= " Zerg's World";
    
         }
    
         if((newcellworld.surviveability >100000000000) && (newcellworld.day >999) && (newcellworld.surviveability >newcellworld.adaption)&& (newcellworld.surviveability >newcellworld.division)){
             worldtype= " Machanical World";
    
         }
    
         if((newcellworld.division >100000000000) && (newcellworld.day >999) && (newcellworld.division >newcellworld.adaption)&& (newcellworld.division >newcellworld.surviveability)){
             worldtype= " Ocean World";
    
         }
         if((newcellworld.adaption >100000000000) && (newcellworld.day >999) && (newcellworld.adaption >newcellworld.surviveability)&& (newcellworld.adaption >newcellworld.division)){
             worldtype= " Rock World";
    
         }
    
//         var ran=this.randomize(0,100);
    
         if((newcellworld.day >5000) && (newcellworld.surviveability == newcellworld.adaption) && (newcellworld.adaption == newcellworld.division)){
             worldtype= " Gaea";
         }
    
         if((newcellworld.day >8000)){
             worldtype= " Dark Matter";
    
         }
    
         newcellworld.worldtitle = newcellworld.worldtitle + worldtype;
    
    
    
    
    
         storage.mapPut("WorldHistory",storage.get("currentworld"),JSON.stringify(newcellworld));
         
    
     }
    
//     randomize(lower,upper) {
//         return Math.floor((Math.random() * (upper - lower) + lower));
//     }
//
     inheritance() {
    
//
//         var newcellworld = this.cellhistory.get(this.historyno);
//         var inheritancearray=[];
//         inheritancearray.push(this.randomize(0,100));
//         inheritancearray.push(this.randomize(0,100));
//         inheritancearray.push(this.randomize(0,100));
//         inheritancearray.push(this.randomize(0,100));
//         if( newcellworld.adaption > 1000000000){
//             inheritancearray.push(this.randomize(0,100));
//         }else if(newcellworld.adaption > 100000000){
//             inheritancearray.push(this.randomize(0,50));
//         }else{
//             inheritancearray.push(this.randomize(0,10));
//         }
//
//         if( newcellworld.surviveability > 1000000000){
//             inheritancearray.push(this.randomize(0,100));
//         }else if(newcellworld.surviveability > 100000000){
//             inheritancearray.push(this.randomize(0,50));
//         }else{
//             inheritancearray.push(this.randomize(0,10));
//         }
//
//         if( newcellworld.division > 1000000000){
//             inheritancearray.push(this.randomize(0,100));
//         }else if(newcellworld.division > 100000000){
//             inheritancearray.push(this.randomize(0,50));
//         }else{
//             inheritancearray.push(this.randomize(0,10));
//         }
//         inheritancearray.push(this.inheritanceno);
//
    
//         return inheritancearray;
    
     }
    
     checkdeath(cellno,adaption,surviveability,division){
         if(cellno > 10000){
             //如果没有平衡发展
             var balancecheck = (adaption+ surviveability+ division)/3;
             if( (adaption <= balancecheck*1.5) && (adaption >= balancecheck*0.5) && (surviveability <= balancecheck*1.5) &&
    
                (surviveability >= balancecheck*0.5) && (division <= balancecheck * 1.5) && (division >= balancecheck*0.5) ){
                 //平衡发展，很OK, Update
    
             }else{
                 //die
                 this.worldtitlecheck();
                 
                 let newworldno =  Number(storage.get("currentworld"))+1;
                 storage.put("currentworld",newworldno.toString());
                 
                 let newworld = new CellHistory();
                 newworld.worldtitle = "World in Evolution";
                 newworld.startcellid = storage.get("totalcell");
                 storage.mapPut("WorldHistory",newworldno.toString(),JSON.stringify(newworld));
                 
//                 this.historyno++;
//                 var cellworld =new CellHistory();
//                 cellworld.id = this.historyno;
//                 cellworld.cellno = 0;
//                 cellworld.adaption = 0;
//                 cellworld.surviveability = 0;
//                 cellworld.division =0;
//                 cellworld.environment =0;
//                 cellworld.day = 0;
//                 cellworld.totoalscore = 0;
//                 cellworld.worldtitle = "World in Evolution";
//                 cellworld.startcellid = parseInt(this.totalcell)+1;
//                 this.cellhistory.put(this.historyno,cellworld);
             }
         }
    
     }
    // setHomeworld(worldid,newtitle){
    //     if (Blockchain.transaction.from === this.admAdd) {
    
    //         var newcellworld = this.cellhistory.get(worldid);
    //         newcellworld.worldtitle = newtitle;
    //         this.cellhistory.set(this.historyno,newcellworld);
    
    //     } else {
    //         throw new Error("Admin only");
    //     }
    // }
    
    // getbalance() {
    
    //     return this.balance;
    
    // }
    
    getworld(historyno) {
        historyno = historyno.trim();
        if ( historyno === "" ) {
            throw new Error("empty key")
        }
        return this.WorldDB.get(historyno);
    }
    
    getcurrentworld() {
        return this.WorldDB.get(this.historyno);
    }
    
    get(id) {
        id = id.trim();
        if ( id === "" ) {
            throw new Error("empty key")
        }
        return this.CellDB.get(id);
    }
    
}
module.exports = CellEvolutionMainContract;
