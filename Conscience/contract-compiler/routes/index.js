const solc = require('solc');
const express = require('express');
const router = express.Router();
const execLocalBin = require('exec-local-bin');
const fileSystem = require('file-system');
const uuidv1 = require('uuid/v1');

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
            console.log(abiFilePath);
            fileSystem.readFile(abiFilePath, {encoding: "utf8"}, function (err, data) {
                if (err) {
                    console.error(err);
                    res.status(422).send({error: error});
                }
                console.log(data);
                res.status(200).send({message: data});
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

// example usage: localhost:4000/api/execute/compile CellNewDesignWorld.js
router.post('/iost/compile', (req, res) => {
    console.info('calling iost/compile');

    // local storage system
    const uuid = uuidv1();
    const folderPath = `./${uuid}`;
    fileSystem.mkdir(folderPath);

    const filePaths = writeToLocalFiles(folderPath, req);

    if (filePaths.length > 1) {
        const error = Error('Got more than 1 file, we only supporet compile 1 file now');
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

module.exports = router;
