const https = require("https");
const { performance } = require("perf_hooks");
const readline = require("readline");

function formatSpeed(value, unit) {
    return `${value.toFixed(2)} ${unit}/s`;
  }
  
  async function downloadFile(url) {
    let startTime = performance.now();
    let promise = new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let fileSize = Number(response.headers["content-length"]);
        let buffer = Buffer.alloc(fileSize);
        let index = 0;
        response.on("data", (chunk) => {
          chunk.copy(buffer, index);
          index += chunk.length;
        });
        response.on("end", () => {
          resolve({ buffer, fileSize });
        });
        response.on("error", (error) => {
          reject(error);
        });
      });
    });
    let { buffer, fileSize } = await promise;
    let endTime = performance.now();
    let timeDuration = (endTime - startTime) / 1000;
    let loadedBits = fileSize * 8;
    let speedInBps = loadedBits / timeDuration;
    let speedInKbps = speedInBps / 1024;
    let speedInMbps = speedInKbps / 1024;
    return {
      speedInBps,
      speedInKbps,
      speedInMbps,
    };
  }
  
  let numTests = 2;
  let fileUrl = "https://speed.hetzner.de/100MB.bin";
  
  async function runTests() {
    let totalBitSpeed = 0;
    let totalKbSpeed = 0;
    let totalMbSpeed = 0;
  
    console.log("Testing your connection Speed");
  
    for await (let i of Array(numTests).keys()) {
      let { speedInBps, speedInKbps, speedInMbps } = await downloadFile(fileUrl);
      totalBitSpeed += speedInBps;
      totalKbSpeed += speedInKbps;
      totalMbSpeed += speedInMbps;
  
      console.log(`Test ${i + 1} completed`);
    }
  
    let averageSpeedInBps = totalBitSpeed / numTests;
    let averageSpeedInKbps = totalKbSpeed / numTests;
    let averageSpeedInMbps = totalMbSpeed / numTests;
  
    console.log(`Average Bit/s: ${formatSpeed(averageSpeedInBps, "Bit")}`);
    console.log(`Average Kb/s: ${formatSpeed(averageSpeedInKbps, "Kb")}`);
    console.log(`Average Mb/s: ${formatSpeed(averageSpeedInMbps, "Mb")}`);
    console.log("Test Completed!");

    tryAgain();
  }

 function tryAgain() {
   const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
   });

   rl.question("Wanna give it another shot? Press 'Y' for Yes or any key to Exit", (answer) => {
     rl.close();

     if (answer === "Y" || answer === "y") 
       runTests();

     else
       process.exit();
   });
 }

runTests();
