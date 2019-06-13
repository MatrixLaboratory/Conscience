const solc = require('solc');
const express = require('express');
const router = express.Router();
const execLocalBin = require('exec-local-bin');
const fileSystem = require('file-system');
const uuidv1 = require('uuid/v1');
const axios = require('axios')
let nrList = []
let pledgeList = []
let totalPage = 0
let nrNat = 0
let pledgeNat = 0

const ABI_REGEX = /^Successfully\sgenerated\sabi\sfile\sas:\s(.*)/;

function writeToLocalFiles(folderPath, req) {
  let params = req.body;
  let input = JSON.parse(params.input);

  const filePaths = [];
  Object.keys(input.sources).forEach(fileName => {
    const filePath = `${folderPath}/${fileName}`;
    filePaths.push(filePath);
    fileSystem.writeFile(`${folderPath}/${fileName}`, input.sources[fileName].content);
  });

  return filePaths;
}

function compileIostLocallyAndCleanup(folderPath, filePath, res) {
  execLocalBin(`iwallet compile ${filePath}`)
    .then((stdout) => {
      console.log('stdout:', stdout);
      const groups = ABI_REGEX.exec(stdout);
      const abiFilePath = groups[1];
      console.log('abiFilePath:', abiFilePath);
      fileSystem.readFile(abiFilePath, {encoding: "utf8"}, function (err, data) {
        if (err) {
          console.error(err);
          res.status(422).send({error: error});
        }
        console.log('data:', data);
        res.status(200).json(JSON.parse(data));
        fileSystem.rmdirSync(folderPath);
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(422).send({error: error});
      fileSystem.rmdirSync(folderPath);
    })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
});

// example usage: localhost:4000/api/iost/compile
router.post('/iost/compile', (req, res, next) => {
  console.info('calling iost/compile');

  // local storage system
  const uuid = uuidv1();
  const folderPath = `./${uuid}`;
  fileSystem.mkdir(folderPath);

  const filePaths = writeToLocalFiles(folderPath, req);

  if (filePaths.length > 1) {
    const error = Error('Got more than 1 file, we only support compile 1 file now');
    res.status(422).send({error: error});
  }

  // will support multiple files in the future
  compileIostLocallyAndCleanup(folderPath, filePaths[0], res);
});

router.post('/solidity/compile', function (req, res, next) {
  console.log('req', req);
  let params = req.body;
  console.log(params.input);
  let output = JSON.parse(solc.compile(params.input));
  res.json(output);
});

router.get('/nebulas/get/tx', function (req, res) {
  console.log('req: ', req.query)
  let address = 'n1EoNsJNXG1tN3z9rvjwPKoBXbJMqAjmESC'
  let url = 'https://explorer-backend.nebulas.io/api/tx/'
  nrList = []
  pledgeList = []
  let firstParam = {
    params: {
      a: address,
      p: 1
    }
  }
  axios.get(url, firstParam).then(async response => {
    let data = response.data
    totalPage = data.data.totalPage
    let response123 = await getAllTx(url, address)
    // let result = {
    //   ntList: nrList,
    //   pledgeList: pledgeList
    // }
    res.json(response123)
  })

})

 function getAllTx(url, address) {

  if (totalPage === 0) {
    alert('illegal totalPage')
  }
  for (let i = 1; i <= totalPage; i++) {
    let params = {
      params: {
        a: address,
        p: i
      }
    }
    axios.get(url, params).then(response => {
      console.log(response.data)
      let data = response.data
      totalPage = data.data.totalPage
      let start = new Date('2019-5-27 12:00:00')
      let startTimestamp = start.getTime()
      let end = new Date('2019-6-4 12:00:00')
      let endTimestamp = end.getTime()
      let list = data.data.txnList
      for (let j = 0; j < list.length; j++) {
        if (list[j].timestamp > startTimestamp && list[j].timestamp < endTimestamp && list[j].status === 1) {
          let json = JSON.parse(list[j].data)
          if (json.Function === 'triggerNR') {
            let item = {
              hash: list[j].hash,
              timestamp: list[j].timestamp
            };
            nrList.push(item)
          }
          if (json.function === 'triggerPledge' || json.Function === 'triggerPledge') {
            let item = {
              hash: list[j].hash,
              timestamp: list[j].timestamp
            }
            pledgeList.push(item)


          }
        }
      }

      let result = {
        ntList: nrList,
        pledgeList: pledgeList
      }
      return result
    })
  }
}

module.exports = router;
