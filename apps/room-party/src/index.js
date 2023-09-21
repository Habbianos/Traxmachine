import "./styles.css";

const tintImage = window.tintImage;
const map = window.map;

const initAnimation = window.initAnimation;
const updateAnimation = window.updateAnimation;
const animatedGrid = window.animatedGrid;
const resetAnimationTime = window.resetTime;

const Quarto = window.Quarto;
const Onda = window.Onda;
// const Piso = window.Piso;
const Porta = window.Parta;
const Pisos = window.Pisos;
const PD = window.PD;
const Trax = window.Trax;
const JukePurpleOff = window.JukePurpleOff;
const JukePurpleOn = window.JukePurpleOn;
const JukeRedOff = window.JukeRedOff;
const JukeRedOn = window.JukeRedOn;
const Avatar = window.Avatar;
// const Alynva = GIF();
// Alynva.load(window.Alynva.src);

let actualColor = 0;
setInterval(() => {
  actualColor = (actualColor + 1) % 4;
}, 5000);

let barsStyle = "levels";

document
  .querySelector('input[type="number"]')
  .addEventListener("change", (e) => {
    window.dt = Number(e.target.value);
  });
const defaultF = (x, y, t) =>
  Math.sin(((((x + t) * (y + t)) / t) * 50 * Math.PI) / 180);
window.f = defaultF;
document.querySelectorAll('input[type="radio"]').forEach((elem) => {
  if (elem.name === "ani") {
    elem.addEventListener("change", (e) => {
      if (e.target.value.startsWith("curve")) {
        window.f = null;
      }
      switch (e.target.value) {
        case "wave":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.05;
          window.f = defaultF;
          break;
        case "wave-grid":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.01;
          window.f = (x, y, t) =>
            Math.sin(((((x + t) * (y + t)) / t) * 200 * Math.PI) / 180);
          break;
        case "wave-elastic":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.06;
          window.f = (x, y, t) => Math.sin((x + y - t) / 2) + Math.cos(t / 4);
          break;
        case "curve-cyclone":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.04;
          window.curveDelay = 1400;
          break;
        case "curve-espiral":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.04;
          window.curveDelay = 4500;
          break;
        case "curve-pizza":
          window.dt = document.querySelector(
            'input[type="number"]'
          ).value = 0.04;
          window.curveDelay = 5000;
          break;
        default:
          window.f = null;
      }
      // window.initAnimation(); // Não faz diferença
    });
  } else if (elem.name === "bars") {
    elem.addEventListener("change", (e) => {
      barsStyle = e.target.value;
    });
  }
});

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
analyser.connect(audioCtx.destination);
var source;
var dataArray = new Uint8Array(analyser.frequencyBinCount);
const NUM_OF_SLICES = 30;
const STEP = Math.floor(dataArray.length / (NUM_OF_SLICES + 10));
let musicPlaying = false;
let resetInterval;
document.querySelector("audio").addEventListener("pause", () => {
  musicPlaying = false;
  clearInterval(resetInterval);
});
document.querySelector("audio").addEventListener("play", () => {
  musicPlaying = true;
  resetInterval = setInterval(() => {
    // resetAnimationTime();
  }, 7000);
  audioCtx.resume();
  const stream = document.querySelector("audio");
  source = source || audioCtx.createMediaElementSource(stream);
  source.connect(analyser);
  // analyser.connect(distortion);
  // source.connect(audioCtx.destination);
});
document.querySelector("audio").src =
  "./src/assets/audios/habnosis-habbo-trax.mp3";

document.querySelector("canvas").addEventListener("click", () => {
  document.querySelector("audio").play();
  document.querySelector("audio").muted = false;
});
/*document.querySelector("canvas").addEventListener("click", () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true
        }
      )

      // Success callback
      .then((stream) => {
        console.log(stream);
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.connect(audioCtx.destination);
        // document.querySelector("audio").pause();
        source = source || audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        musicPlaying = true;
      })

      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});*/

const avatarOffset = { x: 16, y: -58 },
  // traxOffset = { x: 10, y: -60 };
  traxOffset = { x: 1, y: -74 };
// portaOffset = { x: 33, y: -86 };

const canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = 322;
const ctx = canvas.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function drawImage(src, { x, y }, flip = false) {
  if (typeof src === "string") {
    return new Promise((res) => {
      const image = new Image();
      image.onload = () => {
        if (!flip) ctx.drawImage(image, Math.floor(x), Math.floor(y));
        else {
          ctx.save();
          ctx.translate(x + image.width / 2, y + image.height / 2);
          ctx.scale(-1, 1);
          ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2,
            image.width,
            image.height
          );
          ctx.restore();
        }
        res();
      };
      image.src = src;
    });
  } else if (typeof src !== "undefined") {
    if (!flip) ctx.drawImage(src, Math.floor(x), Math.floor(y));
    else {
      ctx.save();
      ctx.translate(x + src.width / 2, y + src.height / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(
        src,
        -src.width / 2,
        -src.height / 2,
        src.width,
        src.height
      );
      ctx.restore();
    }
  }
  // alert('desenhado'+x+y)
}

function mapFloorPosition(x, y, z = 0) {
  const Zero = { x: 199, y: 122 };
  return {
    x: Zero.x + x * 32 - y * 32,
    y: Zero.y + x * 16 + y * 16 - z * 32
  };
}

function mapFloorWithOffset(
  { x = 0, y = 0, z = 0 } = {},
  offset = { x: 0, y: 0, z: 0 }
) {
  const mapped = mapFloorPosition(x, y, z);
  return { x: mapped.x + offset.x, y: mapped.y + offset.y };
}

async function drawBars() {
  return new Promise((res) => {
    let promises = [];
    for (let side = 0; side < 2; side++) {
      const colums = side ? 11 : 16;
      for (let i = 0; i < colums; i++) {
        // const level = Math.floor(Math.random() * 8) + 1;
        const data = dataArray[0 + side ? (16 + i) * STEP : (16 - i) * STEP];
        const level = Math.min(8, map(data, 0, 150, 0, 8));

        const gapVertical = 7 / 16;
        const gapHorizontal = 7 / 16;
        for (let j = 0; j < level; j++) {
          let image, color;
          switch (barsStyle) {
            case "levels":
              color =
                j >= 6
                  ? window.CRO
                  : j >= 5
                  ? window.CAM
                  : j >= 2
                  ? window.CVE
                  : window.CAZ;
              image = tintImage(Onda, color, 0.7, side ? 0.2 : 0);
              break;
            case "rainbow":
              color =
                i % 4 === 0
                  ? window.CRO
                  : i % 4 === 1
                  ? window.CAM
                  : i % 4 === 2
                  ? window.CVE
                  : window.CAZ;
              image = tintImage(Onda, color, 0.7, side ? 0.2 : 0);
              break;
            case "no-color":
            default:
              image = Onda;
          }

          const pos = {};
          if (!side) {
            pos.y = i * gapVertical - 0.6;
          } else {
            ctx.save();
            ctx.translate(424 + 28 * i, 0);
            ctx.scale(-1, 1);
            pos.x = i * gapVertical - 0.6;
          }
          let promise = drawImage(
            image,
            mapFloorWithOffset({ ...pos, z: j * gapHorizontal + 0.05 })
          );
          promises.push(promise);
          if (side) ctx.restore();
        }
      }
    }
    Promise.all(promises).then(res);
  });
}

async function drawFloor() {
  return new Promise((res) => {
    musicPlaying && updateAnimation();

    const promises = [];
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= 6; j++) {
        if (musicPlaying) {
          const animationState = animatedGrid[i] && animatedGrid[i][j];
          if (typeof animationState !== "undefined") {
            let promise = drawImage(
              Pisos[actualColor][animationState.color],
              mapFloorWithOffset({ x: i, y: j })
            );
            promises.push(promise);
          }
        } else {
          let promise = drawImage(PD, mapFloorWithOffset({ x: i, y: j }));
          promises.push(promise);
        }
      }
    }
    Promise.all(promises).then(res);
  });
}

// setInterval(() => musicPlaying && updateAnimation(), 10);
const draw = async () => {
  analyser.getByteFrequencyData(dataArray);

  await drawImage(Quarto, { x: 0, y: 0 });

  await drawBars();

  // await drawImage(Porta, mapFloorWithOffset({ x: 2, y: 0 }, portaOffset));

  await drawFloor();

  // await drawImage(Trax, mapFloorWithOffset({ x: 0, y: 3 }, traxOffset)); /*
  if (!musicPlaying) {
    await drawImage(
      JukePurpleOff,
      mapFloorWithOffset({ x: 0, y: 3 }, traxOffset),
      true
    );
    // await drawImage(JukeRedOff, mapFloorWithOffset({ x: 0, y: 3 }, traxOffset));
  } else {
    await drawImage(
      JukePurpleOn,
      mapFloorWithOffset({ x: 0, y: 3 }, traxOffset),
      true
    );
    // await drawImage(JukeRedOn, mapFloorWithOffset({ x: 0, y: 3 }, traxOffset));
  }
  /* */
  await drawImage(Avatar, mapFloorWithOffset({ x: 2, y: 3 }, avatarOffset));
  // console.log({Alynva})
  // await drawImage(Alynva.frames[0], mapFloorWithOffset({ x: 2, y: 3 }, avatarOffset));

  requestAnimationFrame(draw);
};

initAnimation();
draw();
