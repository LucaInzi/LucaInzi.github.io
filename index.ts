const express = require('express')
const port = 4000
const fs = require('fs')
const csv = require('csv-parser')
const downloadjs = require("download");
const unzip = require('unzip-stream')

let app = express();

var i = 0;
var countTrue = 0;

app.get('/', (res) => {
    res.send('hello racaille');
})

app.get('/tp2', (rep : any, res : any)=>{
    var i : number = 0;
    var countTrue : number = 0
    downloadjs('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry : any) {
            const fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
    .on('data', (data : any) => {
        i = i + 1;
        if (data.transfertSiege == "true") {
            countTrue = countTrue + 1;
        }
    })
    .on('end', ()=>{
        const transferCount : number = countTrue/i*100;
        const total : string = transferCount.toFixed(2)
        res.send(`Le pourcentage est de ${total}%`)
    })
    } else {
        entry.autodrain();
    }
    });
})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

