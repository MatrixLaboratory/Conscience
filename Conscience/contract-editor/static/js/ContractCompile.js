"use strict";

import Web3 from 'web3'
import axios from 'axios'

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
  const response = await axios.post('/api/iost/compile', {
    input: JSON.stringify(input)
  });
  return response.data;
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
      label: `f(${func.args.join(', ')}): ${func.name}`
    });
  });
  return hierachy;
}

export function deployContract(input) {
  let contractName = input.name;
  let compileValue = input.value;
  if (!Web3.givenProvider) {
    this.$notify.error({
      title: '插件异常',
      message: '请先安装MetaMask并解锁您的钱包！'
    });
  }
  let web3 = new Web3(Web3.givenProvider);
  web3.eth.getAccounts().then(value => {
    const account = value[0];
    let contract = new web3.eth.Contract(compileValue.abi);
    let data = '0x' + compileValue.evm.bytecode.object;
    contract.deploy({
      data: data,
      name: contractName
    }).send({
      from: account,
      gas: 0,
      gasPrice: '4700000'
    }, function (e, c) {
      console.log(e, c);
    });
  });
}
