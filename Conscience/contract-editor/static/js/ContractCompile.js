"use strict";

import axios from 'axios'
const IOST = require('iost')

const isProduction = process.env.NODE_ENV === 'production'	
const endPoint = isProduction ? 'http://chainide.com:9600' : '/api'	

const AXIOS_CONFIG = {
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
  }
}

export async function compileIostContract(code, fileName = 'test.js') {
  let source = {}
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
  }
  try {
    console.log(JSON.stringify(input))
    const response = await axios.post(endPoint + '/iost/compile', {	
      input: JSON.stringify(input)
    }, 
    AXIOS_CONFIG)
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
  const response = await axios.post(endPoint + '/solidity/compile', {
    input: JSON.stringify(input)
  }, 
  AXIOS_CONFIG);
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
