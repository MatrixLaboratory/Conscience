"use strict";

import axios from 'axios'
const IOST = require('iost')
export async function compileIostContract(code, fileName = 'test.js') {
  let source = {};
  source[fileName] = {
    content: code
  };
  let input = {
    language: 'JavaScript',
    sources: source,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  try {
    const response = await axios.post('/api/iost/compile', {
      input: JSON.stringify(input)
    });
    return response.data;
  } catch (error) {
    console.error("Errored at compileIostContract()", error);
    console.error("Error response:", error.response);
    return {
      errors: [error]
    }
  }
}

export async function compileSolContract(code, fileName = 'test.sol') {
  let source = {};
  source[fileName] = {
    content: code
  };
  let input = {
    language: 'Solidity',
    sources: source,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const response = await axios.post('/api/solidity/compile', {
    input: JSON.stringify(input)
  });
  return response.data;
}

export function generateIostContractHierachy(index, compileFile, abi) {
  let hierachy = {
    id: index,
    label: "Contract:" + compileFile,
    children: []
  };
  abi.forEach(func => {
    hierachy.children.push({
      label: `f(${func.args.join(', ')}): ${func.name}`,
      args: func.args
    });
  });
  return hierachy;
}

export function deployIostContract(contract, data) {

  const info = "\"info\"";
  const code = "\"code\"";
  const request = ["{" + info + ":" + data.abi + "," + code + ":" + JSON.stringify(contract.contractCode) + "}"];

  window.IWalletJS.enable().then((account) => {
    if (!account) return; // not login

    const iost = window.IWalletJS.newIOST(IOST);
    let contractAddress = "system.iost";
    const ctx1 = iost.callABI(contractAddress, "setCode", request);

    //TODO: write thest into configs
    ctx1.setGas(1, 4000000);

    iost.signAndSend(ctx1).on('pending', (trx) => {
      console.log(trx, 'contract is deploying');
      return trx
    }).on('success', (result) => {
      console.log('result:', result)
      return true
    }).on('failed', (failed) => {
      console.error('failed to deploy IOST contract:', failed)
      return false
    })
  })

}

export function deployContract(code, abi) {
  // let contractName = input.name;
  // let compileValue = input.value;

  // TODO: rewrite for IOST
  console.log("enter iost deploy");
  // abi2=abi;
  // code2=code;
  //
  // var abi2="{\n" +
  //     "    \"lang\": \"javascript\",\n" +
  //     "    \"version\": \"1.0.0\",\n" +
  //     "    \"abi\": [\n" +
  //     "        {\n" +
  //     "            \"name\": \"hello\",\n" +
  //     "            \"args\": [\n" +
  //     "                \"string\"\n" +
  //     "            ],\n" +
  //     "            \"amountLimit\": [],\n" +
  //     "            \"description\": \"\"\n" +
  //     "        }\n" +
  //     "    ]\n" +
  //     "}\n";
  // var code2="class HelloWorld {\n" +
  //     "    init() {} // needs to provide an init function that will be called during deployment\n" +
  //     "    hello(someone) {\n" +
  //     "        return \"hello, \"+ someone\n" +
  //     "    }\n" +
  //     "}\n" +
  //     "\n" +
  //     "module.exports = HelloWorld;\n";
  var infot = "\"info\"";
  var codet = "\"code\"";
  var newtest1 = "{" + infot + ":" + abi + "," + codet + ":" + JSON.stringify(code) + "}";
  var newtest1t = [newtest1];

  console.log(newtest1t);


  window.IWalletJS.enable().then((account) => {
    if (!account) return; // not login

    const iost = window.IWalletJS.newIOST(IOST);
    // if (!iost.currentAccount()) {
    //     this.$notify.error({
    //         title: '插件异常',
    //         message: '请先安装MetaMask并解锁您的钱包！'
    //     });
    // }

    let contractAddress1 = "system.iost";
    const ctx1 = iost.callABI(contractAddress1, "setCode", newtest1t);

    //const ctx = iost.setCode(contractAddress, "hello",newtest2t);

    // let rpgre = iost.currentRPC;
    //  console.log(rpgre);
    iost.signAndSend(ctx1).on('pending', (trx) => {
        console.log(trx, 'contract is deploying');
        // reset();

      })
      .on('success', (result) => {
        console.log(result, 'result')
        layer.msg('Contract Deploy successfully!');
      })
      .on('failed', (failed) => {
        console.log(failed, 'failed')
        layer.msg('Contract failed to merge!');
      })

  })
}
