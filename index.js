import { level1 } from "./map.js";
import { Block } from "./entities/block.js";
import { Player } from "./entities/player.js";
import { CircleObj, Obj } from "./entities/obj.js";
import { vec } from "./utils.js"

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

export const elasticity = 0.5;
export const g = 0.3;
export const AirFriction = 1.99;

let entities = {
    '#': (x, y) => new Block(x, y),
    '@': (x, y) => new Player(x, y),
    'o': (x, y) => new Obj(x, y, new CircleObj(20))
}

class GameLoop {
  constructor(level) {
    this.objs = [];
    let lv = level.split('\n');
    let n = lv[1].length;
    let m = lv.length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < lv[i].length; j++) {
            if (lv[i][j] != ' ') {
              if (!entities[lv[i][j]]) console.log(lv[i][j])
              // console.log(entities[lv[i][j]])
              this.objs.push(entities[lv[i][j]](j * 40, i * 40));
            }
        }
    }
    this.status = "playing";
  }

  addObj(obj) {
    this.objs.push(obj);
  }

  render() {
    for (let obj of this.objs) {
      obj.draw(this.getContext());
    }
  }

  update() {
    for (let obj of this.objs) {
      obj.update(this.getContext());
    }
  }

  draw() {
    ctx.clearRect(0, 0, width, height);
    this.render()
    this.update();
    requestAnimationFrame(this.draw.bind(this));
  }

  getContext() {
    return {
        ctx: ctx,
        entities: this.objs.filter((obj) => obj.type !== "player"),
        width: width,
        height: height,
        player: this.objs.filter((obj) => obj.type === "player")[0],
        camera: new vec(height / 2, width / 2),
        player: this.player.coords
    };
  }

  init() {
    this.player = this.objs.filter((obj) => obj.type === "player")[0];
    this.player.start();
    this.draw();
  }

  run() {
    let lastTime = null;
    const frame = (time) => {
      if (lastTime !== null) {
        const timeStep = Math.min(time - lastTime, 100) / 1000;
        this.update(timeStep);
      }
      lastTime = time;
      this.draw();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

// let obj;
// let d;

// canvas.addEventListener("mousedown", (e) => {
//     obj = new Obj(e.offsetX, e.offsetY, new CircleObj(10));
//     console.log(obj)
// })

// canvas.addEventListener("mouseup", (e) => {
//     d = Math.sqrt((e.offsetX - obj.coords.x) ** 2 + (e.offsetY - obj.coords.x) ** 2);
//     console.log(d)
//     obj.d.add(new vec(d / 40, d / 40));
//     gameLoop.addObj(obj);
// })

let gameLoop = new GameLoop(level1);
gameLoop.init();
