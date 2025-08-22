const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");
ctx.lineCap = "round";

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
];
const vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1]
];

const size = 64;
const distance = size * 8;
const speed = 0.4;

const cornerX = new Array(vertices.length);
const cornerY = new Array(vertices.length);
const halfPi = Math.PI / 180;
const scaledVertices = vertices.map(v => v.map(c => c * size));

function rotate() {
    let roll = 1 * speed * halfPi;
    let pitch = 3 * speed * halfPi;
    let yaw = 2 * speed * halfPi;

    scaledVertices.forEach((v, i) => {
        let x = v[0];
        let y = v[1];
        let z = v[2];

        // Pitch (X-axis)
        let rY = y * Math.cos(pitch) - z * Math.sin(pitch);
        let rZ = y * Math.sin(pitch) + z * Math.cos(pitch);

        // Yaw (Y-axis)
        let rX = rZ * Math.sin(yaw) + x * Math.cos(yaw);
        rZ = rZ * Math.cos(yaw) - x * Math.sin(yaw);

        // Roll (Z-axis)
        const tX = rX;
        rX = rY * Math.sin(roll) + tX * Math.cos(roll);
        rY = rY * Math.cos(roll) - tX * Math.sin(roll);

        v[0] = rX;
        v[1] = rY;
        v[2] = rZ;

        // corner projection
        let zed = distance / (distance + rZ);
        cornerX[i] = rX * zed;
        cornerY[i] = rY * zed;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    edges.forEach(e => {
        const start = e[0]
        const end = e[1]

        const sX = cornerX[start] + canvas.width / 2;
        const sY = cornerY[start] + canvas.height / 2;
        const eX = cornerX[end] + canvas.width / 2;
        const eY = cornerY[end] + canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
        ctx.stroke();
    });

    requestAnimationFrame(rotate);
}

rotate();
