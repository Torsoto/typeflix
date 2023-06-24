import fs from "fs";

const logFilePath = "./status.log";

function logToFile(message) {
    fs.appendFile(logFilePath, message + "\n", err => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
    });
}

export async function logWeatherAndTime() {
    try {
        const weatherResponse = await fetch('http://localhost:3000/weather/vienna');
        const timeResponse = await fetch('http://localhost:3000/time/vienna');

        const weatherData = await weatherResponse.json();
        const timeData = await timeResponse.json();

        const logMessage = `[${timeData.datetime}]: Weather - ${weatherData.currentConditions}, Temp - ${weatherData.temperature}`;

        logToFile(logMessage);
    } catch (err) {
        console.error("Error getting weather or time:", err);
    }
}