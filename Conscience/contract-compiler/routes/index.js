const solc = require('solc');
const express = require('express');
const router = express.Router();
const execLocalBin = require('exec-local-bin');
const fileSystem = require('file-system');
const uuidv1 = require('uuid/v1');

const axios = require('axios')
const pledgeAndNrAddress = 'n1EoNsJNXG1tN3z9rvjwPKoBXbJMqAjmESC'
const voteAddress = 'n1pADU7jnrvpPzcWusGkaizZoWgUywMRGMY'
const getTxUrl = 'https://explorer-backend.nebulas.io/api/tx/'
const getEventByHashUrl = 'https://mainnet.nebulas.io/v1/user/getEventsByHash'
const pledgeAndNrTopic = 'chain.contract.NATToken'
const voteTopic = 'chain.contract.vote'

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

router.get('/pledge/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  if (start === undefined || end === undefined || start < 0 || end < 0) {
    res.json('parameter error!')
  }
  start = req.query.start - 3600 * 1000 * 24 * 7;
  end = req.query.end - 3600 * 1000 * 24 * 7
  let pledgeNat = 0
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let j = 0; j < list.length; j++) {
          if (list[j].status === 1 && list[j].timestamp > start && list[j].timestamp < end) {
            let hash = list[j].hash
            let json = JSON.parse(list[j].data)
            if (json.function === 'triggerPledge' || json.Function === 'triggerPledge') {
              let item = {
                hash: hash
              }
              console.log('pledgeTxListItem: ', item)
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let k = 0; k < events.length; k++) {
                  if (events[k].topic === pledgeAndNrTopic) {
                    let result = JSON.parse(events[k].data);
                    let data = result.Produce.data
                    for (let m = 0; m < data.length; m++) {
                      pledgeNat += parseFloat(data[m].value)
                    }
                  }
                }
              })

            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      pledgeNat: parseInt(pledgeNat / 1000000000000000000),
      start: start,
      end: end
    })
  },10000)
})

router.get('/nr/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  if (start === undefined || end === undefined || start < 0 || end < 0) {
    res.json('parameter error!')
  }
  let nrNat = 0
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1 && list[a].timestamp > start && list[a].timestamp < end) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.Function === 'triggerNR') {
              let item = {
                hash: hash
              }
              console.log('nrTxListItem', item)
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let b = 0; b < events.length; b++) {
                  if (events[b].topic === pledgeAndNrTopic) {
                    let result = JSON.parse(events[b].data)
                    let data = result.Produce.data
                    for (let c = 0; c < data.length; c++) {
                      nrNat += parseFloat(data[c].value)
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      nrNat: parseInt(nrNat / 1000000000000000000),
      start: start,
      end: end
    })
  },12000)
})

router.get('/vote/nat', function (req, res) {
  let countList = []
  let start = req.query.start
  let end = req.query.end
  // if (start === undefined || end === undefined || start < 0 || end < 0) {
  //   res.json('parameter error!')
  // }
  let voteRewardNat = 0
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: voteAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        console.log('txnList.length: ', list.length)
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.Function === 'vote') {
              let item = {
                hash: hash,
                timestamp: list[a].timestamp
              }
              countList.push(item)
              // axios.post(getEventByHashUrl,
              //   JSON.stringify({hash: hash}),
              //   {
              //     headers: {
              //       'Content-Type': 'application/json'
              //     }
              //   }).then(response => {
              //   let events = response.data.result.events
              //   for (let b = 0; b < events.length; b++) {
              //     if (events[b].topic === voteTopic) {
              //       let result = JSON.parse(events[b].data)
              //       voteRewardNat += parseFloat(result.reward)
              //     }
              //   }
              // })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      voteRewardNat: parseInt(voteRewardNat / 10),
      start: start,
      end: end,
      length: countList.length
    })
  }, 20000)
})

module.exports = router;
