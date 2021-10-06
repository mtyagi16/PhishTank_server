import express from 'express';
const app = express();
//const Datastore = require('nedb');
import Datastore from 'nedb';
//const fetch = require('node-fetch');
import fetch from 'node-fetch';
import { request } from 'http';
const PORT = process.env.PORT||3000;
app.listen(PORT,function(){console.log('listening on port ${PORT}')});
const database = new Datastore('database.db');
app.use(express.static('public'));
app.use(express.json());
database.loadDatabase();
//let url = "http://data.phishtank.com/data/online-valid.json";
let url="https://api.github.com/users/hadley/orgs";
let array=[];
async function getdata()
{
    database.remove({}, { multi: true }, function (err, numRemoved) {
        console.log(numRemoved);
    });
    const response = await fetch(url);
    const data = await response.json();
    database.insert(data);
    //console.log(data);
    printurl();
}
getdata();
const docs=[];
setInterval(getdata,1000*60*60);
function printurl()
{
    database.find({ url: { $exists: true } }, function (err, docs) {
        let l=docs.length;
        for(let i=0;i<l;i++)
        {
            array.push(docs[i].url);
            console.log(docs[i].url);
        }
      });
      
}
app.post('/api',(request,response)=>
{
    console.log('I got a request');
    console.log(request.body);
    response.json({
        urls: array
    });
    response.end();
});
