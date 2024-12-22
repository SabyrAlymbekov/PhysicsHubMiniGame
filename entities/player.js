import { Obj, CircleObj } from "./obj.js";

export class Player extends Obj {
    type = "player";
    static player = null;

    constructor(x, y) {
        if (Player.player) {
            return Player.player; 
        }
        super(x, y, new CircleObj(20)); // Initialize with a CircleObj of radius 20
        Player.player = this;
    }

    start() {
        window.addEventListener("keydown", (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight') {
                this.a.x = 0.3; 
            } else if (e.key === 'a' || e.key === 'ArrowLeft') {
                this.a.x = -0.3; 
            } else if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && this.isOnGround()) {
                this.d.y = -9; 
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'ArrowLeft') {
                this.a.x = 0;
            }
        });
    }
    update() {
        this.d.y += 0.5;

        this.x += this.d.x;
        this.y += this.d.y;

        if (this.a.x === 0) {
            this.d.x *= 0.9;
        }
    }
}
