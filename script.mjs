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
      this.fontSize = 100;

      this.maxTextWidth = this.canvasWidth * 0.5;
      this.lineHeight = 100;

      this.textInput = document.querySelector("#textInput");
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
      this.context.fillText(text, this.textX, this.textY);
      this.context.strokeText(text, this.textX, this.textY);

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
    }
    convertToParticles() {}
    render(h) {
      // this.particles.forEach((particle) => {
      //   particle.draw();
      //   particle.update();
      // });
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.wrapText("Happy New Year 2023!");
  console.log(effect);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }
  /*
  
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
  */
});
