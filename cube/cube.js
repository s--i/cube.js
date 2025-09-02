const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

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
    {x: -1, y: -1, z: -1},
    {x: 1, y: -1, z: -1},
    {x: 1, y: 1, z: -1},
    {x: -1, y: 1, z: -1},
    {x: -1, y: -1, z: 1},
    {x: 1, y: -1, z: 1},
    {x: 1, y: 1, z: 1},
    {x: -1, y: 1, z: 1}
];

const size = 64;
const distance = size * 8;
const lineWidth = 4;
const speed = 0.4;

const degreesToRadians = Math.PI / 180;
const projectedVertices = vertices.map(() => ({x: 0, y: 0}));
const scaledVertices = vertices.map(v => ({ x: v.x * size, y: v.y * size, z: v.z * size }));

function rotate() {
    const roll = 1 * degreesToRadians * speed;
    const pitch = 3 * degreesToRadians * speed;
    const yaw = 2 * degreesToRadians * speed;

    const sinRoll = Math.sin(roll);
    const cosRoll = Math.cos(roll);
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);
    const sinYaw = Math.sin(yaw);
    const cosYaw = Math.cos(yaw);

    for (let i = 0; i < scaledVertices.length; i++) {
        const v = scaledVertices[i];

        // Pitch (X-axis)
        let rY = v.y * cosPitch - v.z * sinPitch;
        let rZ = v.y * sinPitch + v.z * cosPitch;

        // Yaw (Y-axis)
        let rX = rZ * sinYaw + v.x * cosYaw;
        rZ = rZ * cosYaw - v.x * sinYaw;

        // Roll (Z-axis)
        const prevX = rX;
        rX = rY * sinRoll + prevX * cosRoll;
        rY = rY * cosRoll - prevX * sinRoll;

        [v.x, v.y, v.z] = [rX, rY, rZ];

        const pV = projectedVertices[i];
        const scale = distance / (distance + rZ);

        [pV.x, pV.y] = [rX * scale, rY * scale];
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    for (const [startVertex, endVertex] of edges) {
        const start = projectedVertices[startVertex];
        const end = projectedVertices[endVertex];

        ctx.moveTo(start.x + centerX, start.y + centerY);
        ctx.lineTo(end.x + centerX, end.y + centerY);
    }
    ctx.stroke();

    requestAnimationFrame(rotate);
}

rotate();
