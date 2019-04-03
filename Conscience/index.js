const execLocalBin = require('exec-local-bin');
// execLocalBin('iwallet compile CellNewDesignWorld.js') // runs: ./node_modules/.bin/relaxed
//     .then((stdout) => console.log(stdout))
//     .catch((error) => console.log(error));

const express = require('express');
const app = express();

// example usage: localhost:4000/api/execute/compile CellNewDesignWorld.js
app.get('/api/execute/:cmd', (req, res) => {
    const cmd = req.params.cmd;
    execLocalBin('iwallet ' + cmd)
        .then((stdout) =>  {
            res.status(200).send({ message: stdout});
        })
        .catch((error) => {
            console.log(error);
            res.status(422).send({ error: error});
        });
});

// Listen on port 4000
app.listen(4000, () => console.log('Listening…'));
