<template>
  <div>
    <div>
      <div style="margin-top: 40px; margin-left: 50px;">
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-select v-model="compileFile" value="compiler" :placeholder="menuLang.compile.placeholder" clearable>
                <el-option v-for="file in files" :key="file" :label="file" :value="file"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="compile" :loading="compiling">{{menuLang.compile.button}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px; margin-left: 50px;">
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-select v-model="deployIndex" value="deploy"
                         :placeholder="menuLang.deploy.placeholder" clearable>
                <el-option
                  v-for="(contract, index) in compiledContracts"
                  :key="index"
                  :label="contract.name"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-select v-model="abiFilename" value="deployABI"
                         :placeholder="menuLang.deploy.abiPlaceholder" clearable>
                <el-option v-for="item in abiList"
                           :key="item"
                           :label="item"
                           :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="deploy">{{menuLang.deploy.button}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px; margin-left: 50px;">
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-input v-model="txAddress" prefix-icon="el-icon-edit" :placeholder="menuLang.query.placeholder"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="queryContractInfo">{{menuLang.query.button}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-show="treeData.length != 0">
        <el-divider></el-divider>
      </div>

      <!--渲染ABI列表-->
      <el-tree v-show="treeData.length != 0" :style="{backgroundColor : backgroundColor, fontSize : fontSize, color : 'white'}"
               node-key="id" default-expand-all :data="treeData"></el-tree>
    </div>

    <div v-show="showRunArea" style="text-align: center; margin-top: 40px">
      <el-form style="margin-right: 50px" class="compile-form" :label-position="labelPosition" label-width="45px">
        <el-form-item>
          <el-select class="el-select-run" v-model="runIndex" :placeholder="menuLang.run.placeholder" clearable>
            <el-option v-for="(item, index) in runMethodList" :key="index" :value="index"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="runIndex !== null">
          <el-form-item v-for="(arg,index) in runMethodList[runIndex].args" :key="index" label="arg:" class="el-form-item-run">
            <el-input v-model="argList[index]" prefix-icon="el-icon-edit">
              <template slot="prepend">({{arg}})</template>
            </el-input>
            <div style="margin: 20px;"></div>
          </el-form-item>
        </div>
        <el-form-item v-if="runIndex !== null">
          <el-button type="primary" @click="run">{{menuLang.run.button}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="Please set the gas ratio and limit
    " :visible.sync="dialogFormVisible">
      <el-form :model="gasData">
        <el-form-item label="Gas Ratio" :label-width="formLabelWidth">
          <el-input v-model="gasData.ratio" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Gas Limit
        " :label-width="formLabelWidth">
          <el-input v-model="gasData.limit
          " autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{menuLang.confirmDialog.cancel}}</el-button>
        <el-button type="primary" @click="handleTranscationEvent">{{menuLang.confirmDialog.confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
  @import "../styles/variable.less";

  .el-menu-item {
    width: 33.3%;
    text-align: center;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: solid 1px #000000;
  }

  .el-tree {
    background-color: @base-color;
  }

  .compile-form {
    text-align: center;
    margin-top: 40px;
  }

  .run-form {
    text-align: center;
    margin-top: 40px;
  }

  .el-select-run {
    display: inline-block;
    position: relative;
    width: 300px;
  }

  .el-form-item-run {
    width: 300px;
    margin: 0 auto;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #409eff;
    color: white;
  }

</style>

<style>
  .el-tree-node__content:hover {
    background-color: #494949;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #494949;
  }
</style>

<script>
const IOST = require('iost')
let iost = null;
import {
  compileIostContract,
  compileSolContract,
  deployContract,
  deployIostContract,
  runIostContract,
  generateIostContractHierachy
} from "../../static/js/ContractCompile";
import {
  compileNotifyLang,
  exceptionMessageLang,
  queryNotifyLang
} from "../assets/template/settings";
import axios from 'axios'

export default {
  name: "ContractActions",
  data() {
    return {
      dialogFormVisible: false,
      currentTransactionEvent: null,
      gasData: {
        ratio: 1,
        limit: 4000000,
      },
      formLabelWidth: '120px',
      activeMenu: "1",
      compileFile: "",
      compiling: false,
      compileResult: "123",
      treeData: [],
      compiledContracts: [],
      deployIndex: "",
      openIndex: [],
      abiFilename: '',
      runMethodList: [],
      runIndex: null,
      argList: [],
      labelPosition: 'left',
      showRunArea: false,
      currentTrx: null,
      result: '',
      txAddress: ''
    };
  },
  props: {
    files: {
      type: Array
    },
    menuLang: {
      type: Object
    },
    backgroundColor: {
      type: String,
      default: '#333333'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    abiList: {
      type: Array
    },
    langMode: {
      type: String
    }
  },
  methods: {
    initIost() {
        try {
          iost = window.IWalletJS.newIOST(IOST)
        } catch (error) {
          const errorMessage = exceptionMessageLang(this.langMode)
          this.$notify({
            title: errorMessage.iostInitException.title,
            message: errorMessage.iostInitException.message,
            type: 'warning'
          });
        }
    },
    compile: function() {
      let data = compileNotifyLang(this.langMode)
      this.compiling = true;
      if (this.compileFile === "" || this.compileFile === null) {
        this.$notify.error({
          title: data.title,
          message: data.message,
          duration: 2000
        });
      } else {
        let code = localStorage.getItem(this.compileFile);
        compileIostContract(code, this.compileFile).then(result => {
          console.log('result:', result);
          if (result == undefined || result.abi == undefined) {
            this.reportError(result);
            return;
          }
          this.result = result
          this.treeData = [];
          let index = 0;
          this.treeData.push({
            id: index,
            label: "Contract:" + this.compileFile,
            children: []
          });
          const hierachy = generateIostContractHierachy(index, this.compileFile, result.abi);
          this.treeData[index] = hierachy;
          this.runMethodList = this.treeData[0].children
          // TODO: 解析contracts，渲染到页面
          this.$notify.success({
            title: data.compileSuccess.title,
            message: this.compileFile + data.compileSuccess.message,
            duration: 1000
          });
          this.$emit("compileResult", this.compileFile, result);
          for (let index in this.compiledContracts) {
            if (this.compileFile == this.compiledContracts[index].name) {
              return
            }
          }
          this.compiledContracts.push({
            name: this.compileFile,
            contractCode: code,
            contractAbi: JSON.stringify(result)
          })
        }, (result) => this.reportError(result));
      }
      this.compiling = false;
    },
    deploy: function() {
      let data =localStorage.getItem(this.abiFilename).slice(1,localStorage.getItem(this.abiFilename).length-1);
      let str = data.replace(/[\r\n]/g,"");
      str = str.replace(/\ +/g,"");
      let combine = '{\"lang\":\"'+this.result.lang+'\",\"version\":\"'+this.result.version+'\",\"abi\":['+str.trim()+"]}";
      this.deployIostContract(this.compiledContracts[this.deployIndex], combine);
    },
    run: function() {
      this.runIostContract(this.runMethodList[this.runIndex].label, this.argList);
    },
    reportError: function(result) {
      let data = compileNotifyLang(this.langMode)
      this.$notify({
        title: data.compileFailed.title,
        message: this.compileFile + data.compileFailed.message,
        duration: 2000
      })
      this.$emit("compileResult", this.compileFile, result);
    },
    handleTranscationEvent() {
      this.dialogFormVisible = false
      switch(this.currentTransactionEvent.evetType) {
        case 'deploy':
          this.doDeployContract(this.currentTransactionEvent.transaction)
          break
        case 'run':
          this.doRunIostContract(this.currentTransactionEvent.transaction)
          break
        default:
          console.error(`${this.currentTransactionEvent.evetType} is not a supported type`)
          this.$emit('deployResult', {
            status: 'failed',
            trx: '',
            message: `Deploy Error: ${this.currentTransactionEvent.evetType} is not a supported type!`
          })
      }

      //clean up the event to null
      this.currentTransactionEvent = null
    },
    deployIostContract(contract, data) {

      this.initIost()
      if (iost == null) {
        return
      }

      const info = "\"info\"";
      const code = "\"code\"";
      const request = ["{" + info + ":" + data + "," + code + ":" + JSON.stringify(contract.contractCode) + "}"];

      window.IWalletJS.enable().then((account) => {
        if (!account) {
          this.$emit('deployResult', {
            status: 'failed',
            trx: 'Error',
            message: "Please login the iWallet or install the iWallet extension!"
          })
          return
        }

        const tx = iost.callABI('system.iost', 'setCode', request);

        this.currentTransactionEvent = {
          evetType: 'deploy',
          transaction: tx
        }
        //trigger the modal
        console.error('trigger the modal')
        this.dialogFormVisible = true
      })
    },
    doRunIostContract(transaction) {

      this.initIost()
      if (iost == null) {
        return
      }

      try {
        transaction.setGas(this.gasData.ratio, this.gasData.limit);
      } catch (error) {
        this.$emit('runResult', {
          status: 'failed',
          trx: 'Error',
          message: error
        })
      }
      let trxStr = ''
      iost.signAndSend(transaction).on('pending', (trx) => {
        console.log(trx, 'contract is calling')
        trxStr = trx
        this.$emit('runResult', {
          status: 'pending',
          trx: trxStr
        })
      }).on('success', (result) => {
        console.log('run-success-result: ', result)
        this.$emit('runResult', {
          status: 'success',
          trx: trxStr,
          returns: result.returns
        })
      }).on('failed', (failed) => {
        console.error('failed to run IOST contract:', failed)
        this.$emit('runResult', {
          status: 'failed',
          trx: trxStr,
          message: failed.message
        })
      })
    },
    doDeployContract(transaction) {
      this.initIost()
      if (iost == null) {
        return
      }

      try {
        transaction.setGas(this.gasData.ratio, this.gasData.limit);
      } catch (error) {
        console.error(error)
        this.$emit('deployResult', {
          status: 'failed',
          trx: 'Error',
          message: error
        })
      }
      let trxStr = ''
      iost.signAndSend(transaction).on('pending', (trx) => {
        console.log(trx, 'contract is deploying');
        trxStr = trx
        this.$emit('deployResult', {
          status: 'pending',
          trx: trxStr
        })
      }).on('success', (result) => {
        console.log('deploy-success-result: ', result)
        this.treeData = []
        this.showRunArea = true
        this.currentTrx = trxStr
        let index = 0
        let abi = localStorage.getItem(this.abiFilename)
        abi = JSON.parse(abi)
        let treeData = generateIostContractHierachy(index, this.compileFile, abi)
        this.treeData[index] = treeData
        this.runMethodList = this.treeData[index].children
        this.$emit('deployResult', {
          status: 'success',
          trx: trxStr
        })
      }).on('failed', (failed) => {
        console.error('failed to deploy IOST contract:', failed.message)
        this.$emit('deployResult', {
          status: 'failed',
          trx: trxStr,
          message: failed.message
        })
      })
    },
    runIostContract(method, value) {

      this.initIost()
      if (iost == null) {
        return
      }
      let methodArr = method.split(' ')

      window.IWalletJS.enable().then((account) => {

        if (!account) {
          this.$emit('runResult', 'failed', {
            status: 'failed',
            trx: 'Error',
            message: "Please login the iWallet or install the iWallet extension!"
          })
          return
        }

        if (this.currentTrx == null) {
            console.error('currentTrx has not been initialized!')
            this.$emit('runResult', {
              status: 'failed',
              trx: 'None',
              message: `Run Method Error: currentTrx has not been initialized!`
            })
        }

        let contractAddress = 'Contract' + this.currentTrx
        if (value.length > 0) {
          let argTypeList = this.runMethodList[this.runIndex].args
          for (let i = 0; i < argTypeList.length; i++) {
            if (argTypeList[i] === 'number') {
              value[i] = parseInt(value[i])
            }
          }
        }
        const tx = iost.callABI(contractAddress, methodArr[1], value);
        this.argList = []
        this.currentTransactionEvent = {
          evetType: 'run',
          transaction: tx
        }
        //trigger the modal
        this.dialogFormVisible = true
      })
    },
    queryContractInfo() {
      let data = queryNotifyLang(this.langMode);
      if (this.txAddress.length < 0) {
        this.$notify.error({
          title: data.title,
          message: data.message,
          duration: 1000
        })
        return
      }
      let apiKey = 'd8b1df24ce7bde79d32bf6fea313863c'
      let url = 'https://api.iostabc.com/api/?apikey='
                + apiKey + '&module=contract&action=get-contract-abi&contract=Contract'
                + this.txAddress
      if (this.txAddress.indexOf('Contract') === 0) {
        url = 'https://api.iostabc.com/api/?apikey='
          + apiKey + '&module=contract&action=get-contract-abi&contract='
          + this.txAddress
      }
      this.currentTrx = this.txAddress;
      let _this = this
      axios.get(url).then(response => {
        let abis = response.data.data.abis
        if (abis.length > 0) {
          _this.showRunArea = true
          _this.treeData = []
          let index = 0
          _this.treeData[index] = generateIostContractHierachy(index, _this.txAddress, abis)
          _this.runMethodList = _this.treeData[0].children
          _this.$notify.success({
            title: data.querySuccess.title,
            message: data.querySuccess.message,
            duration: 1000
          });
        } else {
          this.$notify.error({
            title: data.queryFailed.title,
            message: data.queryFailed.message,
            duration: 1000
          })
        }
      })
    }
  }
};
</script>

