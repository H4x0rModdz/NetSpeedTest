const https = require("https");
const readline = require("readline");
const fs = require("fs");

function formatSpeed(value, unit) {
  return `${value.toFixed(2)} ${unit}/s`;
}

async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

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
}

function calculateSpeed(fileSize, startTime, endTime) {
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

  let resultsArray = [];

  console.log("Testing your connection Speed");

  for await (let i of Array(numTests).keys()) {
    let startTime = performance.now();
    let { buffer, fileSize } = await downloadFile(fileUrl);
    let endTime = performance.now();

    let { speedInBps, speedInKbps, speedInMbps } = calculateSpeed(fileSize, startTime, endTime);

    let timestamp = new Date().toLocaleString();
    resultsArray.push({
      timestamp,
      "bit/s": formatSpeed(speedInBps, "Bit"),
      "kb/s": formatSpeed(speedInKbps, "Kb"),
      "mb/s": formatSpeed(speedInMbps, "Mb"),
    });
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
  
  console.log("Json Results:");
  console.log(resultsArray);
  console.log("Test Completed!");

  const jsonData = JSON.stringify(resultsArray, null, 2);
  const timestampForFilename = new Date().toISOString().replace(/:/g, "");
  fs.writeFileSync(`${timestampForFilename}.json`, jsonData);

  console.log("Test Completed!");

  tryAgain();
}

async function tryAgain() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
    rl.question("Wanna give it another shot? Press 'Y' for Yes or any key to Exit", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (answer === "Y" || answer === "y") {
    runTests();
  } else {
    process.exit();
  }
}

runTests();