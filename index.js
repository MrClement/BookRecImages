const request = require("request");
const csv = require("fast-csv");
const Xray = require('x-ray');
let x = Xray();

const fs = require('fs');
var output = fs.createWriteStream('out.csv', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });

let rate = 30000;

let fullData = [];
csv
 .fromPath("recs.csv")
 .on("data", function(data){
     fullData.push(data);
 })
 .on("end", function(){
     console.log("Parsed");

     let interval = setInterval(function() {
         if(fullData.length > 0) {
            let curRec = fullData.shift();
            getImage(curRec[5].trim(), curRec[6].trim());
         } else {
             clearInterval(interval);
         }
     }, rate);
 });



function getImage(title, author_last) {
  console.log(`Requesting ${title} ${author_last}`);
  titlePlus = title.replace(/ /g, "+");
  console.log(`https://www.google.com/search?tbm=isch&q=site%3Agoodreads.com+${titlePlus}+${author_last}`);
  x(`https://www.google.com/search?tbm=isch&q=site%3Agoodreads.com+${titlePlus}+${author_last}`, '#search div table tr td',[{query: "a@href"}]).then(function (res) {
     let goodUrl = res[0].query.toString().slice(7);
     let betterUrl = goodUrl.slice(0, goodUrl.indexOf("&sa"));
     console.log(betterUrl);
     x(betterUrl, "#imagecol div div a",[{link: "img@src"}]).then(function (res) {
         console.log(res);
         if(res && res[0]) {
            output.write(`${res[0].link}\n`);
         } else {
            output.write(`Not found\n`);
         }
     });
   });
}
