
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const topicInput = document.getElementById('topicInput');
const createBtn = document.getElementById('createBtn');
const downloadBtn = document.getElementById('downloadBtn');
const explanationBox = document.getElementById('explanationBox');

let mediaRecorder;
const recordedChunks = [];
let animationId;

// === 2. FAKE API SIMULATION (Unchanged) ===
function fakeApiCall(topic) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const apiData = {
                pythagoras: {
                    title: 'The Pythagorean Theorem',
                    text: "This theorem states that for a right-angled triangle, the square of the hypotenuse (the longest side) is equal to the sum of the squares of the other two sides. The formula is a² + b² = c²."
                },
                unitcircle: {
                    title: 'The Unit Circle',
                    text: "The unit circle has a radius of 1. For any point on the circle, its (x, y) coordinates correspond to the cosine and sine of the angle (θ). So, x = cos(θ) and y = sin(θ)."
                },
                slope: {
                    title: 'Slope',
                    text: "Slope measures the steepness of a line. It's calculated as 'rise' (vertical change) divided by 'run' (horizontal change). A positive slope goes up, and a negative slope goes down."
                },
                sinewave: {
                    title: 'Sine Wave',
                    text: "A sine wave is a smooth, periodic curve. It can be created by plotting the sine of an angle against the angle itself. This shape appears naturally in light, sound, and alternating current."
                },
                parabola: {
                    title: 'Parabola',
                    text: "A parabola is a U-shaped curve produced by a quadratic equation, such as y = x². Every point on a parabola is equidistant from a fixed point (the focus) and a fixed line (the directrix)."
                },
                circlearea: {
                    title: 'Circle Area',
                    text: "The area of a circle is the space it occupies. It is calculated using the formula A = πr², where 'r' is the radius of the circle and π (pi) is a constant approximately equal to 3.14159."
                },
                reflection: {
                    title: 'Reflection',
                    text: "A reflection is a transformation that flips a shape across a line, creating a mirror image. When reflecting across the y-axis, the x-coordinate of every point changes its sign (e.g., (x, y) becomes (-x, y))."
                }
            };
            if (apiData[topic]) {
                resolve(apiData[topic]);
            } else {
                reject("Concept not found. Please check the list of available topics.");
            }
        }, 500);
    });
}

// === 3. MATH ANIMATION LIBRARY (Corrected) ===
const animations = {
    pythagoras: { /* ... as before ... */
        triangle: { a: 150, b: 200, x: 200, y: 250 },
        progress: 0, maxProgress: 140,
        init: function() { this.progress = 0; },
        isFinished: function() { return this.progress >= this.maxProgress; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "20px Arial"; ctx.fillStyle = '#333';
            const { a, b, x, y } = this.triangle; const c = Math.sqrt(a * a + b * b);
            if (this.progress >= 10) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + b, y); ctx.lineTo(x, y - a); ctx.closePath();
                ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillText('a', x - 20, y - a / 2); ctx.fillText('b', x + b / 2, y + 20); ctx.fillText('c', x + b / 2 - 20, y - a / 2);
            }
            if (this.progress >= 30) { ctx.fillStyle = 'rgba(255, 99, 132, 0.7)'; ctx.fillRect(x - a, y - a, a, a); ctx.fillStyle = '#FFF'; ctx.fillText('a²', x - a / 2 - 10, y - a / 2 + 10); }
            if (this.progress >= 60) { ctx.fillStyle = 'rgba(54, 162, 235, 0.7)'; ctx.fillRect(x, y, b, b); ctx.fillStyle = '#FFF'; ctx.fillText('b²', x + b / 2 - 10, y + b / 2 + 10); }
            if (this.progress >= 90) { ctx.save(); ctx.fillStyle = 'rgba(255, 206, 86, 0.7)'; ctx.translate(x, y - a); ctx.rotate(Math.atan2(b, a)); ctx.fillRect(0, -c, c, c); ctx.restore(); }
            if (this.progress >= 120) { ctx.font = "bold 30px Arial"; ctx.fillStyle = '#28a745'; ctx.fillText('a² + b² = c²', 200, 50); }
            if (!this.isFinished()) this.progress++;
        }
    },
    unitcircle: { /* ... as before ... */
        angle: 0, maxAngle: 360, centerX: 300, centerY: 225, radius: 150,
        init: function() { this.angle = 0; },
        isFinished: function() { return this.angle >= this.maxAngle; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.font = "18px Arial";
            ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, this.centerY); ctx.lineTo(canvas.width, this.centerY); ctx.moveTo(this.centerX, 0); ctx.lineTo(this.centerX, canvas.height); ctx.stroke();
            ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI); ctx.stroke();
            let rad = this.angle * (Math.PI / 180); let x = this.centerX + this.radius * Math.cos(rad); let y = this.centerY - this.radius * Math.sin(rad);
            ctx.beginPath(); ctx.moveTo(this.centerX, this.centerY); ctx.lineTo(x, y); ctx.strokeStyle = 'red'; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(this.centerX, this.centerY); ctx.lineTo(x, this.centerY); ctx.lineTo(x, y); ctx.strokeStyle = 'blue'; ctx.stroke();
            ctx.fillStyle = 'blue'; ctx.fillText("sin(θ)", x + 10, this.centerY - (this.centerY - y) / 2); ctx.fillText("cos(θ)", this.centerX + (x - this.centerX) / 2, this.centerY + 20);
            ctx.fillStyle = 'red'; ctx.fillText("1", this.centerX + this.radius / 2 * Math.cos(rad / 2), this.centerY - this.radius / 2 * Math.sin(rad / 2));
            ctx.fillStyle = '#000'; ctx.fillText(`θ = ${this.angle}°`, 40, 40);
            if (!this.isFinished()) this.angle++;
        }
    },
    slope: { /* ... as before ... */
        progress: 0, maxProgress: 200,
        init: function() { this.progress = 0; },
        isFinished: function() { return this.progress >= this.maxProgress; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const p1 = { x: 100, y: 350 }; const p2 = { x: 500, y: 100 };
            ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(50, 400); ctx.moveTo(50, 400); ctx.lineTo(550, 400); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.stroke();
            if (this.progress > 30) {
                const runProgress = Math.min(1, (this.progress - 30) / 60);
                const riseProgress = Math.min(1, (this.progress - 90) / 60);
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p1.x + (p2.x - p1.x) * runProgress, p1.y); ctx.strokeStyle = 'blue'; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(p2.x, p1.y); ctx.lineTo(p2.x, p1.y + (p2.y - p1.y) * riseProgress); ctx.strokeStyle = 'red'; ctx.stroke();
            }
            if (this.progress > 100) { ctx.fillStyle = 'blue'; ctx.fillText("Run (Δx)", 280, 370); }
            if (this.progress > 150) { ctx.fillStyle = 'red'; ctx.fillText("Rise (Δy)", 510, 225); }
            if (this.progress > 180) { ctx.font = "bold 24px Arial"; ctx.fillStyle = '#28a745'; ctx.fillText("Slope = Rise / Run", 150, 50); }
            if (!this.isFinished()) this.progress++;
        }
    },
    sinewave: { /* ... as before ... */
        angle: 0, maxAngle: 360,
        init: function() { this.angle = 0; },
        isFinished: function() { return this.angle >= this.maxAngle; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerY = 225; const circleX = 120; const radius = 80;
            ctx.beginPath(); ctx.arc(circleX, centerY, radius, 0, 2 * Math.PI); ctx.strokeStyle = '#ccc'; ctx.stroke();
            let rad = this.angle * Math.PI / 180; let x = circleX + radius * Math.cos(rad); let y = centerY - radius * Math.sin(rad);
            ctx.beginPath(); ctx.moveTo(circleX, centerY); ctx.lineTo(x, y); ctx.strokeStyle = 'red'; ctx.stroke();
            ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fillStyle = 'red'; ctx.fill();
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(circleX + 100 + this.angle, y); ctx.strokeStyle = '#ccc'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath();
            for (let i = 0; i <= this.angle; i++) { let waveY = centerY - radius * Math.sin(i * Math.PI / 180); ctx.lineTo(circleX + 100 + i, waveY); }
            ctx.strokeStyle = 'blue'; ctx.lineWidth = 3; ctx.stroke(); ctx.lineWidth = 1;
            if (!this.isFinished()) this.angle++;
        }
    },
    parabola: {
        x: -15, maxX: 15,
        init: function() { this.x = -15; },
        isFinished: function() { return this.x >= this.maxX; },
        update: function() {
            // THE FIX IS HERE: This next line was missing.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = 15; const offsetX = 300; const offsetY = 400;
            ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, offsetY); ctx.lineTo(canvas.width, offsetY); ctx.moveTo(offsetX, 50); ctx.lineTo(offsetX, canvas.height); ctx.stroke();
            let y = this.x * this.x;
            ctx.beginPath();
            // Draw the curve from the start up to the current point
            for (let i = -15; i <= this.x; i += 0.5) {
                ctx.lineTo(offsetX + i * scale, offsetY - (i * i));
            }
            ctx.strokeStyle = 'blue'; ctx.lineWidth = 3; ctx.stroke();
            ctx.font = "bold 24px Arial"; ctx.fillStyle = '#28a745'; ctx.fillText("y = x²", 250, 50);
            if (!this.isFinished()) this.x += 0.2;
        }
    },
    circlearea: { /* ... as before ... */
        progress: 0, maxProgress: 200,
        init: function() { this.progress = 0; },
        isFinished: function() { return this.progress >= this.maxProgress; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = 300, centerY = 225, radius = 150;
            const fillProgress = Math.min(1, this.progress / 100);
            ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); ctx.strokeStyle = '#333'; ctx.stroke();
            ctx.save(); ctx.clip();
            ctx.fillStyle = 'rgba(54, 162, 235, 0.5)';
            ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2 * fillProgress);
            ctx.restore();
            if(this.progress > 80) {
                ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + radius, centerY);
                ctx.strokeStyle = 'red'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = 'red'; ctx.font = "20px Arial"; ctx.fillText("r", centerX + radius / 2, centerY - 10);
            }
            if(this.progress > 150) {
                ctx.font = "bold 30px Arial"; ctx.fillStyle = '#000'; ctx.fillText("Area = πr²", 220, 50);
            }
            if (!this.isFinished()) this.progress++;
        }
    },
    reflection: { /* ... as before ... */
        progress: 0, maxProgress: 150,
        init: function() { this.progress = 0; },
        isFinished: function() { return this.progress >= this.maxProgress; },
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = 300;
            const points = [{x: 50, y: 100}, {x: 200, y: 150}, {x: 150, y: 300}];
            ctx.beginPath(); ctx.moveTo(centerX, 50); ctx.lineTo(centerX, 400); ctx.strokeStyle = '#ccc'; ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(centerX + points[0].x, points[0].y);
            points.forEach(p => ctx.lineTo(centerX + p.x, p.y));
            ctx.closePath(); ctx.fillStyle = 'rgba(255, 99, 132, 0.7)'; ctx.fill();
            if(this.progress > 50) {
                const reflectProgress = Math.min(1, (this.progress - 50) / 100);
                ctx.beginPath(); ctx.moveTo(centerX - points[0].x * reflectProgress, points[0].y);
                points.forEach(p => ctx.lineTo(centerX - p.x * reflectProgress, p.y));
                ctx.closePath(); ctx.fillStyle = 'rgba(54, 162, 235, 0.7)'; ctx.fill();
            }
            if(this.progress > 100) {
                ctx.font = "20px Arial"; ctx.fillStyle = '#000';
                ctx.fillText("(x, y)", 480, 200); ctx.fillText("(-x, y)", 50, 200);
            }
            if (!this.isFinished()) this.progress++;
        }
    }
};

// === 4. CORE LOGIC & 5. EVENT LISTENERS (These sections are unchanged) ===
async function handleCreateClick() {
    if (animationId) cancelAnimationFrame(animationId);
    createBtn.disabled = true; downloadBtn.disabled = true;
    explanationBox.innerHTML = `<p class="placeholder">Checking input...</p>`;
    const query = topicInput.value.trim();
    if (!query) { alert("Please enter a topic."); createBtn.disabled = false; return; }
    const normalizedKey = query.toLowerCase().replace(/ /g, '');
    explanationBox.innerHTML = `<p class="placeholder">Fetching explanation for '${query}'...</p>`;
    try {
        const response = await fakeApiCall(normalizedKey);
        explanationBox.innerHTML = `<h2>${response.title}</h2><p>${response.text}</p>`;
    } catch (error) {
        explanationBox.innerHTML = `<p style="color:red;">${error}</p>`;
        createBtn.disabled = false; return;
    }
    const selectedAnimation = animations[normalizedKey];
    if (!selectedAnimation) {
        explanationBox.innerHTML += `<p style="color:red; font-weight:bold;">Sorry, an animation for this topic isn't available yet.</p>`;
        createBtn.disabled = false; return;
    }
    selectedAnimation.init();
    recordedChunks.length = 0;
    const stream = canvas.captureStream();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        downloadBtn.href = URL.createObjectURL(blob);
        downloadBtn.download = `${normalizedKey}-animation.webm`;
        downloadBtn.disabled = false;
    };
    mediaRecorder.start();
    function animationLoop() {
        selectedAnimation.update();
        if (selectedAnimation.isFinished()) {
            if (mediaRecorder.state === "recording") mediaRecorder.stop();
            createBtn.disabled = false;
        } else {
            animationId = requestAnimationFrame(animationLoop);
        }
    }
    animationId = requestAnimationFrame(animationLoop);
}
createBtn.addEventListener('click', handleCreateClick);
downloadBtn.addEventListener('click', () => {
    if (downloadBtn.hasAttribute('href') && !downloadBtn.disabled) {
        const tempLink = document.createElement('a');
        tempLink.href = downloadBtn.href;
        tempLink.download = downloadBtn.download;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }
});