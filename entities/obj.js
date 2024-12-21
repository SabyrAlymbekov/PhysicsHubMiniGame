import { vec } from "../utils.js";
import { AirFriction, g, elasticity } from "../index.js";
import { Block } from "./block.js";

export class CircleObj {
  constructor(r = 10) {
    this.r = r;
  }

  draw(ctx, camera, coords, player) {
    ctx.beginPath();
    let newCoords = coords.getSub(player);
    newCoords.add(camera);
    ctx.arc(newCoords.x, newCoords.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }

  isCollideWithObject(obj, coords, d = null) {
    if (d) {
      const steps = Math.ceil(Math.sqrt(d.x * d.x + d.y * d.y) / this.r);
      if (steps > 1) {
        const stepX = d.x / steps;
        const stepY = d.y / steps;
        const tempCoords = new vec(coords.x, coords.y);
        
        for (let i = 0; i < steps; i++) {
          if (this.isCollideWithObject(obj, tempCoords)) {
            return true;
          }
          tempCoords.x -= stepX;
          tempCoords.y -= stepY;
        }
      }
    }

    if (obj instanceof CircleObj) {
      const dx = coords.x - obj.coords.x;
      const dy = coords.y - obj.coords.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= (this.r + obj.r);
    } else {
      const cx = Math.max(obj.coords.x, Math.min(coords.x, obj.coords.x + obj.w));
      const cy = Math.max(obj.coords.y, Math.min(coords.y, obj.coords.y + obj.w));
      const dx = coords.x - cx;
      const dy = coords.y - cy;
      const ds = (dx * dx) + (dy * dy);
      return ds <= (this.r * this.r);
    }
  }

  handleCollision(block, coords, d) {
    const velocity = Math.sqrt(d.x * d.x + d.y * d.y);
    
    const overlapX = coords.x < block.coords.x + block.w/2 ? 
                     block.coords.x - (coords.x + this.r) :
                     block.coords.x + block.w - (coords.x - this.r);
    const overlapY = coords.y < block.coords.y + block.w/2 ?
                     block.coords.y - (coords.y + this.r) :
                     block.coords.y + block.w - (coords.y - this.r);

    if (Math.abs(overlapX) < Math.abs(overlapY)) {
      d.x *= -elasticity;
      coords.x += overlapX * (1 + Math.min(velocity * 0.1, 1)); 
    } else {
      d.y *= -elasticity;
      coords.y += overlapY * (1 + Math.min(velocity * 0.1, 1));
    }

    const maxSpeed = 20;
    const currentSpeed = Math.sqrt(d.x * d.x + d.y * d.y);
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      d.x *= scale;
      d.y *= scale;
    }
  }
handleCircleCollision(otherCircle, coords, d) {
  console.log("wer")
  otherCoords = otherCircle.coords;
  otherd = otherCircle.d;
  const nx = otherCoords.x - coords.x;
  const ny = otherCoords.y - coords.y;
  const dist = Math.sqrt(nx * nx + ny * ny);
  const nx_norm = nx / dist;
  const ny_norm = ny / dist;

  const vx = d.x - otherD.x;
  const vy = d.y - otherD.y;

  const velAlongNormal = vx * nx_norm + vy * ny_norm;

  if (velAlongNormal > 0) return;

  const j = -(1 + elasticity) * velAlongNormal;

  d.x -= j * nx_norm;
  d.y -= j * ny_norm;
  otherD.x += j * nx_norm;
  otherD.y += j * ny_norm;

  const overlap = this.r + otherCircle.r - dist;
  if (overlap > 0) {
    coords.x -= overlap * nx_norm / 2;
    coords.y -= overlap * ny_norm / 2;
    otherCoords.x += overlap * nx_norm / 2;
    otherCoords.y += overlap * ny_norm / 2;
  }
}
}

export class SquareObj {
    constructor(w = 10) {
      this.w = w;
    }

    draw(ctx, camera, coords, player) {
      ctx.beginPath();
      let newCoords = coords.getSub(player);
      newCoords.add(camera);
      ctx.fillRect(newCoords.x, newCoords.y, this.w, this.w);
      ctx.fill();
    }
}

export class Obj {
  constructor(x, y, shape) {
    this.coords = new vec(x, y);
    this.d = new vec(0, 0);
    this.a = new vec(0, 0);
    this.shape = shape;
  }

  draw({ ctx, camera, player }) {
    this.shape.draw(ctx, camera, this.coords, player);
  }

  update(context) {
    this.d.add(this.a);
    this.d.mul(AirFriction);
    this.d.y += g;
    this.coords.add(this.d);

    if (!(this.shape instanceof Block)) {
      for (let entity of context.entities) {
        if (this.shape.isCollideWithObject(entity, this.coords)) {
          if (entity.shape instanceof CircleObj) {
            this.shape.handleCircleCollision(entity, this.coords, this.d);
          } else 
            this.shape.handleCollision(entity, this.coords, this.d);
        }
      }
    }
  }
}
