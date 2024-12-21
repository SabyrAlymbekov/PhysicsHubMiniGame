export class vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x
        this.y += v.y
    }

    sub(v) {
        this.x -= v.x
        this.y -= v.y
    }

    getSub(v) {
        return new vec(this.x - v.x, this.y - v.y)
    }

    mul(s) {
        this.x *= s
        this.y *= s
    }
}