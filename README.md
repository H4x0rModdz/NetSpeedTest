# NetSpeedTest

This is a simple Node.js program that measures your internet connection speed by downloading a file from a given URL. The program performs multiple speed tests and calculates the average speed in bits per second (bps), kilobits per second (Kbps), and megabits per second (Mbps).

1. Ensure you have Node.js installed on your system.
2. Clone or download the repository to your local machine.
3. Open a terminal or command prompt and navigate to the project directory.
4. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

5. To run the network speed tests, execute the following command:

    ```bash
    node NetSpeedTest.js
    ```

6. The program will perform two speed tests by downloading a 100MB file from "https://speed.hetzner.de/100MB.bin." After each test, the results will be displayed, showing the average speed in bps, Kbps, and Mbps.
7. Once the tests are completed, you will be prompted to try the tests again or exit the script.

# Dev Notes
* The program uses the https module to download the test file, so make sure you have an internet connection while running the tests.

* The download speed may vary based on your network connection and server response time.

* You can modify the numTests variable to change the number of speed tests performed.

* Feel free to modify the fileUrl variable to test different download sources.

* The program uses the performance.now() function from the perf_hooks module to measure the time taken for each test.

* The program will keep prompting you to try again until you choose to exit.

Enjoy testing your internet connection speed! If you have any questions or need further assistance, please feel free to reach out.