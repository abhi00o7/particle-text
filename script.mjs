window.addEventListener("load", function () {
  const canvas = document.querySelector("#canvas0");
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.canvasWidth;
      this.y = this.effect.canvasHeight;
      this.color = color;
      this.originX = x;
      this.originY = y;
      this.size = this.effect.gap;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.vy = 0;
      this.force = 0;
      this.friction = 0.9;
      this.angle = 0;
      this.friction = Math.random() * 0.7 + 0.15;
      // change the ease to control the speed of the particles
      this.ease = Math.random() * 0.7 + 0.005;
    }
    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy;
      // this.distance = Math.hypot(this.dx, this.dy);

      this.force = -this.effect.mouse.radius / this.distance;

      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      // change the x and y to control the direction of the particles
      this.x +=
        (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y +=
        (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 2;
      this.fontSize = 190;
      // this.context.letterSpacing = '10px';
      this.lineHeight = this.fontSize * 1.1;
      this.maxTextWidth = this.canvasWidth * 0.5;
      this.lineHeight = 100;
      this.verticalOffset = 0;

      this.textInput = document.querySelector("#textInput");
      this.textInput.addEventListener("keyup", (e) => {
        if (e.key !== " ") {
          this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.wrapText(e.target.value);
        }
      });

      // particle text settings

      this.particles = [];
      // use the gap to control the density of the particles
      this.gap = 4;
      this.mouse = {
        radius: 20000,
        x: 0,
        y: 0,
      };
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }
    wrapText(text) {
      // canvas settings
      const gradient = this.context.createLinearGradient(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      gradient.addColorStop(0.3, "#ff0000");
      gradient.addColorStop(0.5, "fuchsia");
      gradient.addColorStop(0.7, "#0000ff");
      this.context.fillStyle = gradient;
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.strokeStyle = "white";
      this.context.lineWidth = 0.5;
      this.context.font = this.fontSize + "px Rubik Bubbles";

      // break text into lines
      let linesArray = [];
      let lineCounter = 0;
      let line = "";
      let words = text.split(" ");

      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = this.context.measureText(testLine).width;

        if (testWidth > this.maxTextWidth) {
          linesArray[lineCounter] = line;
          lineCounter++;
          line = words[i] + " ";
        } else {
          line = testLine;
        }
        linesArray[lineCounter] = line;
      }
      let textHeight = this.lineHeight * lineCounter;
      this.textY = this.canvasHeight / 2 - textHeight / 2 + this.verticalOffset;
      linesArray.forEach((line, index) => {
        this.context.fillText(
          line,
          this.canvasWidth / 2,
          this.textY + index * this.lineHeight
        );
        this.context.strokeText(
          line,
          this.canvasWidth / 2,
          this.textY + index * this.lineHeight
        );
      });
      this.convertToParticles();
    }
    convertToParticles() {
      this.particles = [];
      const pixels = this.context.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      ).data;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;

          const alpha = pixels[index + 3];
          if (alpha > 0) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const color = `rgb(${red}, ${green}, ${blue})`;
            // const particle = new Particle(x, y, 1, color);
            this.particles.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    render() {
      this.particles.forEach((particle) => {
        particle.draw();
        particle.update();
      });
    }
    resize(height, width) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.textX = this.canvasWidth/ 2;
      this.textY = this.canvasHeight / 2;
      this.maxTextWidth = this.canvasWidth * 0.5;
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.wrapText(this.textInput.value);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.height, canvas.width);
    effect.wrapText(effect.textInput.value);

  });
});
