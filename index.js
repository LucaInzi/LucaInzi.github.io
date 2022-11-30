var express = require('express');
var port = 4000;
var fs = require('fs');
var csv = require('csv-parser');
var downloadjs = require("download");
var unzip = require('unzip-stream');
var app = express();
var i = 0;
var countTrue = 0;

app.get('/', function (res) {
    res.send('hello racaille');
});

app.get('/tp2', function (rep, res) {
    var i = 0;
    var countTrue = 0;
    downloadjs('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) {
                    i = i + 1;
                    if (data.transfertSiege == "true") {
                        countTrue = countTrue + 1;
                    }
                })
                    .on('end', function () {
                    var transferCount = countTrue / i * 100;
                    var total = transferCount.toFixed(2);
                    res.send("Le pourcentage est de ".concat(total, "%"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    });
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
