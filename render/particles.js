const particleContainer = document.getElementById('particles');
const particleCount = 50; // Number of particles

for(let i=0;i<particleCount;i++){
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random()*3 + 1; // 1px to 4px
    const x = Math.random()*100;
    const y = Math.random()*100;
    const duration = Math.random()*8 + 4; // 4s to 12s
    const delay = Math.random()*5; // 0s to 5s

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.top = `${y}%`;
    p.style.left = `${x}%`;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${delay}s`;

    particleContainer.appendChild(p);
}
