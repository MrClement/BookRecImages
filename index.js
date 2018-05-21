const request = require("request");
const csv = require("fast-csv");
const Xray = require('x-ray');
let x = Xray();




let rate = 10000;

let fullData = [];
csv
 .fromPath("recs.csv")
 .on("data", function(data){
     fullData.push(data);
 })
 .on("end", function(){
     console.log("Parsed");

     let interval = setInterval(function() {
         if(fullData.length > 511) {
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
     console.log(goodUrl);
     x(goodUrl, "#imagecol div div a",[{html: "img@src"}]).then(function (res) {
         console.log(res); //should be writing to a file here instead
     });
   });
}