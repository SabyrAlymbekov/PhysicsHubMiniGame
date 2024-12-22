import { Obj, CircleObj } from "./obj.js";

export class Player extends Obj {
    type = "player";
    static player = null;

    constructor(x, y) {
        if (Player.player) {
            return Player.player; // Singleton pattern
        }
        super(x, y, new CircleObj(20)); // Initialize with a CircleObj of radius 20
        Player.player = this;
    }

    start() {
        window.addEventListener("keydown", (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight') {
                this.a.x = 0.3; // Move right
            } else if (e.key === 'a' || e.key === 'ArrowLeft') {
                this.a.x = -0.3; // Move left
            } else if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && this.isOnGround()) {
                this.d.y = -9; // Jump
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'ArrowLeft') {
                this.a.x = 0; // Stop horizontal acceleration
            }
        });
    }

    isOnGround() {
        // Example: Check if the player is on the ground. Adjust according to your game environment.
        return this.y >= 300; // Replace '300' with your ground level
    }

    update() {
        // Gravity simulation
        this.d.y += 0.5; // Adjust gravity value as needed

        // Update position based on velocity
        this.x += this.d.x;
        this.y += this.d.y;

        // Prevent falling below ground level
        if (this.y >= 300) { // Replace '300' with your ground level
            this.y = 300;
            this.d.y = 0; // Stop vertical velocity when on the ground
        }

        // Apply friction when no horizontal acceleration
        if (this.a.x === 0) {
            this.d.x *= 0.9; // Friction slows horizontal movement gradually
        }
    }
}
