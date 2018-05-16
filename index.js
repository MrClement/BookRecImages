const request = require("request");
const csv = require("fast-csv");

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
         if(fullData.length > 507) {
            let curRec = fullData.shift();
            getImage(curRec[5].trim(), curRec[6].trim());
         } else {
             clearInterval(interval);
         }
     }, rate);
 });


function getImage(title, author_last) {
    console.log(`Requesting ${title} ${author_last}`)
    const options = { method: 'GET',
    url: 'https://www.googleapis.com/customsearch/v1',
    qs: 
    { q: `${title} ${author_last}`,
        searchType: 'image',
        cx: '006300766087473289716:zziixxljave',
        key: 'AIzaSyAiuZJOH1CZYoKY1EF2ulpKZY72zTLKHow' },
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(JSON.parse(body).items[0].link);
    });
}
