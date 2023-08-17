const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

type Coordinates = { x: number; y: number };

const mouse: Coordinates = {
  x: null,
  y: null,
};

const updateMouse = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

window.addEventListener("mousemove", updateMouse);

const colors = ["#44001A", "#600047", "#770058", "#8E0045", "#9E0031"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const distance = (from: Coordinates, to: Coordinates) => {
  const xDiff = to.x - from.x;
  const yDiff = to.y - from.y;

  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

const clamp = <T>(value: T, min: T, max: T) => {
  if (value < min) value = min;
  else if (value > max) value = max;

  return value;
};

const clampMax = <T>(value: T, max: T) => {
  if (value > max) value = max;

  return value;
};

class Bubble {
  private size = 0;
  private isScaled = false;

  private x = Math.random() * (window.innerWidth - this.size * 2) + this.size;
  private y = Math.random() * (window.innerHeight - this.size * 2) + this.size;

  private dx = (Math.random() - 0.5) * this.maxSpeed;
  private dy = (Math.random() - 0.5) * this.maxSpeed;

  private color = getRandomColor();

  constructor(
    private initialSize: number,
    private maxSize: number,
    private maxSpeed: number,
    private meltSpeed: number
  ) {}

  private draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private checkCollisions() {
    if (
      (this.x + this.size > window.innerWidth && this.dx > 0) ||
      (this.x - this.size < 0 && this.dx < 0)
    )
      this.dx = -this.dx;
    if (
      (this.y + this.size > window.innerHeight && this.dy > 0) ||
      (this.y - this.size < 0 && this.dy < 0)
    )
      this.dy = -this.dy;
  }

  private getCoordinates(): Coordinates {
    return { x: this.x, y: this.y };
  }

  private sizeByMousePosition() {
    const distanceToMouse = distance(this.getCoordinates(), mouse);

    if (distanceToMouse < 200) this.size += 1;
    else if (this.size > this.initialSize) this.size -= 0.5;

    this.size = clampMax(this.size, this.maxSize);
  }

  isAlive() {
    return this.size > 1 || !this.isScaled;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.sizeByMousePosition();
    this.checkCollisions();

    if (this.isScaled) this.size -= this.meltSpeed;
    else {
      this.size += 0.1;
      this.isScaled = this.size >= this.initialSize;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw(ctx);
  }
}

const bubbles = Array<Bubble | null>(500).fill(null);

for (let i = 0; i < bubbles.length; i++)
  bubbles[i] = new Bubble(10, 50, 4, 0.1);

const update = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  for (let i = 0; i < bubbles.length; i++) {
    if (!bubbles[i].isAlive()) bubbles[i] = new Bubble(10, 50, 4, 0.1);

    bubbles[i].update(ctx);
  }

  requestAnimationFrame(update);
};

update();
