window.addEventListener("load", function () {
  const canvas = document.querySelector("#canvas0");
  const textInput = document.querySelector("#textInput");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx);

  class Particle {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }
    draw() {}
    update() {}
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = canvasWidth / 2;
      this.textY = canvasHeight / 2;
    }
    wrapText(text) {
      this.context.fillText(text, this.textX, this.textY);
    }
    convertToParticles() {}
    render(h) {
      this.particles.forEach((particle) => {
        particle.draw();
        particle.update();
      });
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "green";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = "blue";
  ctx.stroke();

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0.3, "#ff0000");
  gradient.addColorStop(0.5, "fuchsia");
  gradient.addColorStop(0.7, "purple");

  ctx.fillStyle = gradient;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;
  ctx.font = "100px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxTextWidth = canvas.width * 0.5;
  let lineHeight = 100;

  function wrapText(text) {
    let linesArray = [];
    let lineCounter = 0;
    let line = "";
    let words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      let testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxTextWidth) {
        linesArray[lineCounter] = line;
        lineCounter++;
        line = words[i] + " ";
      } else {
        line = testLine;
      }
      linesArray[lineCounter] = line;
    }
    console.log(linesArray);
    let textHeight = lineHeight * lineCounter;
    let textY = canvas.height / 2 - textHeight / 2;
    linesArray.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
      ctx.strokeText(line, canvas.width / 2, textY + index * lineHeight);
    });
  }

  wrapText("Happy New Year 2023!");
  textInput.addEventListener("input", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wrapText(textInput.value);
  });
});
