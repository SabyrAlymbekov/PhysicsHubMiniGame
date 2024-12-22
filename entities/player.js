import { Obj, CircleObj } from "./obj.js";

export class Player extends Obj {
    type = "player";
    static player = null;
    constructor(x, y) {
        if (Player.player) {
            return Player.player;
        }
        super(x, y, new CircleObj(20));
        Player.player = this;
    }

    start() {
        window.addEventListener("keydown", (e) => {
            if (e.key === 'd') {
                this.a.x = 0.3;
            } else if (e.key === 'a') {
                this.a.x = -0.3;
            } else if (e.key === ' ') {
                this.d.y = -9;
            }
        });
        window.addEventListener("keyup", (e) => {
            if (e.key == 'd') {
                this.a.x = 0;
            } else if (e.key == 'a') {
                this.a.x = 0;
            }
        });
    }

there
