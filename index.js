const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const { resourceLimits } = require('worker_threads');
const port = 4000;

let app = express();

app.get('/', (req, res) => {
    res.send('hello racaille');
})

app.get('/tp1', (req, res) => {
    const results = [];
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const transferSiege = results.filter(result => result.transferSiege == 'true')
            const percentage = transferSiege.length / results.length * 100
            let i = percentage.toFixed(1)
            res.send(`${i}% c'est le nombre étonnant d'entreprise qui ont transféré leurs siège social en 2019`)
        });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})