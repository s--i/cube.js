const canvas = document.getElementById("starfield");
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

let stars = [];

function createStars(count) {
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * width
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";

    for (let star of stars) {
        star.z -= 16;

        if (star.z <= 0) {
            star.x = Math.random() * width - width / 2;
            star.y = Math.random() * height - height / 2;
            star.z = width;
        }

        const scale = width / star.z;
        const x = star.x * scale + width / 2;
        const y = star.y * scale + height / 2;

        ctx.fillRect(x, y, scale * 2, scale * 2)
    }

    requestAnimationFrame(animate);
}

createStars(256);
animate();
