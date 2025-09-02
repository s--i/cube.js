const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

const digits = {
    '0': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '1': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0]
    ],
    '2': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]
    ],
    '3': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '4': [
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0]
    ],
    '5': [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '6': [
        [0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '7': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
    ],
    '8': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '9': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    ':': [
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
};
const ledColor = '#d00';
const secondSize = 0.75;

let width, height, centerX, centerY;
let smallest, ledRadius, ledPitch, timeWidth, secondsWidth;

function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;

    canvas.width = width;
    canvas.height = height;

    smallest = Math.min(width, height);
    ledRadius = smallest * 0.01;
    ledPitch = ledRadius * 2.5;
    timeWidth = computeWidth("12:34", ledPitch);
    secondsWidth = computeWidth("56", ledPitch * secondSize);
}

function computeWidth(timeString, pitch) {
    let totalColumns = 0;
    for (let i = 0; i < timeString.length; i++) {
        const char = timeString[i];
        const pattern = digits[char];
        if (pattern) {
            totalColumns += pattern[0].length;
        }
    }

    let gaps = (timeString.length - 1) * pitch;

    return totalColumns * pitch + gaps;
}

function drawDot(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawDigitalTime(timeString, timeWidth, yOffset, radius, pitch, color) {
    const startX = centerX - timeWidth / 2;
    let currentX = startX + pitch / 2;
    for (let i = 0; i < timeString.length; i++) {
        const char = timeString[i];
        const pattern = digits[char];
        if (!pattern) continue;

        const charWidth = pattern[0].length;
        const charHeight = pattern.length;

        for (let row = 0; row < charHeight; row++) {
            for (let col = 0; col < charWidth; col++) {
                if (pattern[row][col] === 1) {
                    drawDot(currentX + col * pitch, yOffset + row * pitch, radius, color);
                }
            }
        }
        currentX += charWidth * pitch + pitch;
    }
}

function drawClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = new Date();
    const hourString = now.getHours().toString().padStart(2, '0');
    const minuteString = now.getMinutes().toString().padStart(2, '0');
    const secondString = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hourString}:${minuteString}`;

    for (let i = 0; i < 12; i++) {
        const radius = smallest * 0.415;
        const angle = (Math.PI / 6) * i;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        drawDot(x, y, ledRadius, ledColor);
    }

    for (let i = 0; i <= now.getSeconds(); i++) {
        const radius = smallest * 0.45;
        const angle = (Math.PI / 30) * i;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        drawDot(x, y, ledRadius, ledColor);
    }

    const timeHeight = ledPitch * digits["0"].length;
    const timeY = centerY - timeHeight / 2 + ledPitch / 2;
    const secondsY = centerY + timeHeight;

    drawDigitalTime(timeString, timeWidth, timeY, ledRadius, ledPitch, ledColor);
    drawDigitalTime(secondString, secondsWidth, secondsY, ledRadius * secondSize, ledPitch * secondSize, ledColor);

    window.setTimeout(drawClock, 1000 - now.getMilliseconds());
}

window.addEventListener("resize", setup);

setup();
drawClock();
