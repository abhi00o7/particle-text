window.addEventListener("load", function () {
  const canvas = document.querySelector("#canvas0");
  const textInput = document.querySelector("#textInput");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx);

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.canvasWidth;
      this.y = 0;
      this.color = color;
      this.originX = x;
      this.originY = y;
      this.size = this.effect.gap;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.force = 0;
      this.vy = 0;
      this.friction = 0.9;
      this.angle = 0;
      this.gravity = 0.1;
      this.distance = 0;
      this.friction = Math.random() * 0.05 + 0.94;
      // change the ease to control the speed of the particles
      this.ease = Math.random() * 0.1 + 0.005;
      this.gravity = Math.random() * 0.05 + 0.94;
      this.maxDistance = Math.random() * 50 + 50;
      this.maxSize = Math.random() * 10 + 10;
      this.maxSpeed = Math.random() * 10 + 10;
      this.maxForce = Math.random() * 10 + 10;
      this.maxAngle = Math.random() * 10 + 10;
      this.maxGravity = Math.random() * 10 + 10;
      this.maxFriction = Math.random() * 10 + 10;
      this.maxEase = Math.random() * 10 + 10;
    }
    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      // change the x and y to control the direction of the particles
      this.x += (this.originX - this.x) * this.ease ;
      this.y +=( this.originY - this.y);
    }
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = canvasWidth / 2;
      this.textY = canvasHeight / 2;
      this.fontSize = 100;

      this.maxTextWidth = this.canvasWidth * 0.5;
      this.lineHeight = 100;

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
      gradient.addColorStop(0.7, "purple");
      this.context.fillStyle = gradient;
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.strokeStyle = "white";
      this.context.lineWidth = 0.5;
      this.context.font = this.fontSize + "px Helvetica";

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
      this.textY = this.canvasHeight / 2 - textHeight / 2;
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
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.wrapText("Hello World");

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }
  animate();
});
