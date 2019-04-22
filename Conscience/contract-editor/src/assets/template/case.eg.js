export function caseTemplate() {
    let examples = {
        'dice.js': "class Bet {\n" +
            "    constructor(player, amount, number, player_seed, hash, inviter) {\n" +
            "        this.amount = amount;\n" +
            "        this.number = number;\n" +
            "        this.host_hash = hash;\n" +
            "        this.player = player;\n" +
            "        this.player_seed = player_seed;\n" +
            "        this.host_seed = \"0000000000000000\";\n" +
            "        this.inviter = inviter;\n" +
            "        this.status = \"pending\"\n" +
            "    }\n" +
            "    \n" +
            "    reveal(seed) {\n" +
            "        if (IOSTCrypto.sha3(seed) !== this.host_hash) {\n" +
            "            throw \"illegal seed\"\n" +
            "        }\n" +
            "        this.host_seed = seed;\n" +
            "    }\n" +
            "    \n" +
            "    dice() {\n" +
            "        const hash = IOSTCrypto.sha3(this.player_seed + this.host_seed);\n" +
            "        let sum = 0;\n" +
            "        for (let i = 0; i < hash.length; i ++) {\n" +
            "            sum += hash.charCodeAt(i)\n" +
            "        }\n" +
            "        return sum % 100 + 1\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "class Dice {\n" +
            "    init(){\n" +
            "        storage.put(\"nonce\", JSON.stringify(0))\n" +
            "    }\n" +
            "    bet(amount, number, player_seed, hash, inviter) {\n" +
            "        if (number < 3 || number > 96) {\n" +
            "            throw \"illegal bet number\"\n" +
            "        }\n" +
            "        blockchain.deposit(tx.publisher, amount, \"\");\n" +
            "        \n" +
            "        const b = new Bet(tx.publisher, amount, number, player_seed, hash, inviter);\n" +
            "        const nonce = this._new_bet(b);\n" +
            "        return \"bet\"+nonce\n" +
            "    }\n" +
            "    reveal(nonce, seed, isVIP) {\n" +
            "        const bet = this._load_bet(nonce);\n" +
            "        \n" +
            "        // pay et\n" +
            "        this._pay_et(bet.amount, bet.player);\n" +
            "        this._pay_et(bet.amount / 10, bet.inviter);\n" +
            "        \n" +
            "        bet.reveal(seed);\n" +
            "        if (bet.dice() < bet.number) {\n" +
            "            bet.status = \"win\";\n" +
            "            const base = isVIP?99:98;\n" +
            "            let amount = new Float64(bet.amount);\n" +
            "            const pay = amount.multi(base).div(bet.number - 1);\n" +
            "            blockchain.deposit(bet.player, pay, \"\");\n" +
            "        } else {\n" +
            "            bet.status = \"lose\"\n" +
            "            // TODO Transfer to private account\n" +
            "        }\n" +
            "        this._save_bet(bet);\n" +
            "        return bet\n" +
            "    }\n" +
            "    del(nonce) {\n" +
            "        const bet = this._load_bet(\"bet\"+nonce);\n" +
            "        if (!blockchain.requireAuth(bet.player, \"active\")) {\n" +
            "            throw \"only player can delete bet records\"\n" +
            "        }\n" +
            "        if (bet.status === 'pending') {\n" +
            "            throw \"bet unfinished\"\n" +
            "        }\n" +
            "        storage.del(\"bet\"+nonce)\n" +
            "    }\n" +
            "    _pay_et(iostAmount, player) {\n" +
            "        \n" +
            "    }\n" +
            "    _new_bet(bet) {\n" +
            "        const nonce = JSON.parse(storage.get(\"nonce\"));\n" +
            "        this._save_bet(bet, nonce);\n" +
            "        storage.put(\"nonce\", (nonce + 1).toString());\n" +
            "        return nonce\n" +
            "    }\n" +
            "    _save_bet(bet, nonce) {\n" +
            "        storage.put(\"bet\"+nonce, JSON.stringify(bet), bet.player);\n" +
            "    }\n" +
            "    _load_bet(nonce) {\n" +
            "        const jsonStr = storage.get(\"bet\"+nonce);\n" +
            "        if (!jsonStr) {\n" +
            "            throw \"bet not exist\"\n" +
            "        }\n" +
            "        const obj = JSON.parse(jsonStr);\n" +
            "        return Object.assign(new Bet, obj)\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "module.exports = Dice;\n",


        'helloworld.js': "class HelloWorld {\n" +
            "    init () {\n" +
            "        \n" +
            "    }\n" +
            "    hello(someone) {\n" +
            "        return \"hello, \"+ someone\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "module.exports = HelloWorld;\n",


        'storage.js': "// Storage.js\n" +
            "class Test {\n" +
            "    init() {\n" +
            "        storage.put(\"value1\", \"foobar\")\n" +
            "    }\n" +
            "    read() {\n" +
            "        console.log(storage.get(\"value1\"))\n" +
            "    }\n" +
            "    change(someone) {\n" +
            "        storage.put(\"value1\", someone)\n" +
            "    }\n" +
            "}\n" +
            "module.exports = Test;\n"

    }
    let indexes = [];
    for (let key in examples) {
        localStorage.setItem(key, examples[key])
        indexes.push(key)
    }
    return indexes
}
