// SAGE AI Animated Background

const particles = document.createElement("div");
particles.className = "particles";
document.body.appendChild(particles);

for (let i = 0; i < 50; i++) {
    const dot = document.createElement("span");

    dot.style.left = Math.random() * 100 + "vw";
    dot.style.top = Math.random() * 100 + "vh";
    dot.style.animationDelay = Math.random() * 5 + "s";

    particles.appendChild(dot);
}
