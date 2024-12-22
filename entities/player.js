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
        this.maxSpeed = 5; // Maximum horizontal speed
        this.groundLevel = 300; // Example ground level for jump checks
    }

    start() {
        window.addEventListener("keydown", (e) => {
            if (e.key === 'd') {
                this.a.x = 0.3; // Move right
            } else if (e.key === 'a') {
                this.a.x = -0.3; // Move left
            } else if (e.key === ' ' && this.isOnGround()) {
                this.d.y = -9; // Jump
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === 'd' || e.key === 'a') {
                this.a.x = 0; // Stop horizontal acceleration
            }
        });
    }

    isOnGround() {
        return this.y >= this.groundLevel; // Check if player is on the ground
    }

    update() {
        // Apply friction if no horizontal acceleration
        if (this.a.x === 0) {
            this.d.x *= 0.9; // Friction slows the player down gradually
        }

        // Cap horizontal speed
        if (this.d.x > this.maxSpeed) {
            this.d.x = this.maxSpeed;
        } else if (this.d.x < -this.maxSpeed) {
            this.d.x = -this.maxSpeed;
        }

        // Simulate gravity
        this.d.y += 0.5; // Adjust gravity value as needed

        // Update position
        this.x += this.d.x;
        this.y += this.d.y;

        // Prevent falling below ground
        if (this.y >= this.groundLevel) {
            this.y = this.groundLevel;
            this.d.y = 0; // Stop vertical velocity when hitting the ground
        }
    }
}
