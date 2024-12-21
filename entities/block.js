import { SquareObj } from "./obj.js";
import { vec } from "../utils.js";

export class Block extends SquareObj {
    constructor(x, y, w = 40) {
        super(w);
        this.coords = new vec(x, y);
    }

    draw({ ctx, camera, player }) {
        super.draw(ctx, camera, this.coords, player);
    }

    update({}) {
        // do nothing
    }
}