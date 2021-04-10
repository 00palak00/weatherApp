const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
  let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
  console.log(orgval.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Ambala&units=metric&appid=0f167529dcdfbae9b6b1714806e68a2f"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => {
            return replaceVal(homeFile, val);
          })
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to the port no 8000");
});
