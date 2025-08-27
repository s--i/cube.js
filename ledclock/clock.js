const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    centerX = width / 2;
    centerY = height / 2;
});

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

const ledRadius = height * 0.01;
const ledPitch = ledRadius * 2.5;
const ledColor = '#d00';
const timeWidth = computeWidth("12:34", ledPitch);
const secondsWidth = computeWidth("56", ledPitch * 0.75);

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
                    drawDot(
                        currentX + col * pitch,
                        yOffset + row * pitch,
                        radius,
                        color
                    );
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
        const radius = height * 0.42;
        const angle = (Math.PI / 6) * i;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        drawDot(x, y, ledRadius, ledColor);
    }

    for (let i = 0; i <= now.getSeconds(); i++) {
        const radius = height * 0.45;
        const angle = (Math.PI / 30) * i;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        drawDot(x, y, ledRadius, ledColor);
    }

    const timeHeight = ledPitch * digits["0"].length;
    const timeY = centerY - timeHeight / 2 + ledPitch / 2;
    const secondsY = centerY + timeHeight;

    drawDigitalTime(timeString, timeWidth, timeY, ledRadius, ledPitch, ledColor);
    drawDigitalTime(secondString, secondsWidth, secondsY, ledRadius * 0.75, ledPitch * 0.75, ledColor);
}

drawClock();
setInterval(drawClock, 1000);
