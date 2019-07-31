const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = process.argv[2];
let file = process.argv[3];

request(url, (error, response, body) => {
  console.log("error:", error); // Print the error if one occurred
  console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  
  if (error || (response && response.statusCode != '200')){
    console.log("The page responded with a non 200 status code. Exiting program.")
    process.exit();
  }
  else{
    fs.readFile(file, "utf8", (error, data) => {
      if (data) {
        rl.question(
          "This file already exists. Do you want to overwrite it? (Y) ",
          answer => {
            if (answer === "Y") {
              fs.writeFile(file, body, err => {
                if (err) throw err;
                console.log(
                  `Downloaded and saved ${body.length} bytes to ${file}`
                );
                rl.close();
              });
            }
            rl.close();
          }
        );
      } else {
        fs.writeFile(file, body, err => {
          try {
            if (err) throw err;
            console.log(`Downloaded and saved ${body.length} bytes to ${file}`);
            rl.close();
          } catch (err) {
            console.log("INVALID PATH!!!");
            rl.close();
          }
        });
      }
    });
  }
});