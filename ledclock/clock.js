const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
let centerX = width / 2;
let centerY = height / 2;

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

const ledSize = 7;
const ledGap = ledSize * 1.75;
const ledColor = '#dd0000';

function drawDot(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// Draw the digital time using the dot patterns
function drawDigitalTime(timeString, yOffset, dotWidth, dotGap, color) {
    let totalStringWidth = 0;
    // Calculate total width of the string to center it
    for (let i = 0; i < timeString.length; i++) {
        const char = timeString[i];
        if (digits[char]) {
            const charWidth = digits[char][0].length;
            totalStringWidth += charWidth * (dotWidth + dotGap);
        }
    }
    totalStringWidth += (timeString.length - 1) * ledGap; // Add the new spacing
    totalStringWidth -= dotGap; // Remove the trailing gap

    const startX = centerX - totalStringWidth / 2;
    let currentX = startX;

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
                        currentX + col * (dotWidth + dotGap),
                        yOffset + row * (dotWidth + dotGap),
                        dotWidth,
                        color
                    );
                }
            }
        }
        currentX += charWidth * (dotWidth + dotGap) + (i < timeString.length - 1 ? ledGap : 0);
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
        const currentAnalogRadius = height * 0.42;

        const angle = (Math.PI / 6) * i;
        const dotX = centerX + currentAnalogRadius * Math.sin(angle);
        const dotY = centerY - currentAnalogRadius * Math.cos(angle);

        drawDot(dotX, dotY, ledSize, ledColor);
    }

    // Draw the analog dots
    // Loop from 0 to the current second to only draw illuminated dots
    for (let i = 0; i <= now.getSeconds(); i++) {
        const currentAnalogRadius = height * 0.45;

        const angle = (Math.PI / 30) * i;
        const dotX = centerX + currentAnalogRadius * Math.sin(angle);
        const dotY = centerY - currentAnalogRadius * Math.cos(angle);

        drawDot(dotX, dotY, ledSize, ledColor);
    }

    // Adjust vertical positions for the taller digits
    const some = (ledSize + ledGap) * (digits["0"].length - 1);
    const digitalTimeY = centerY - some / 2;
    const digitalSecondsY = centerY + some;

    // Draw the digital HH:MM
    drawDigitalTime(timeString, digitalTimeY, ledSize, ledGap, ledColor);

    // Draw the digital seconds
    drawDigitalTime(secondString, digitalSecondsY, ledSize * 0.75, ledGap * 0.75, ledColor);
}

setInterval(drawClock, 1000);
