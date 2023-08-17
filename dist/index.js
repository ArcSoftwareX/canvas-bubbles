var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var mouse = {
    x: null,
    y: null,
};
var updateMouse = function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
window.addEventListener("mousemove", updateMouse);
var colors = ["#44001A", "#600047", "#770058", "#8E0045", "#9E0031"];
var getRandomColor = function () { return colors[Math.floor(Math.random() * colors.length)]; };
var distance = function (from, to) {
    var xDiff = to.x - from.x;
    var yDiff = to.y - from.y;
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};
var clamp = function (value, min, max) {
    if (value < min)
        value = min;
    else if (value > max)
        value = max;
    return value;
};
var clampMax = function (value, max) {
    if (value > max)
        value = max;
    return value;
};
var Bubble = (function () {
    function Bubble(initialSize, maxSize, maxSpeed, meltSpeed) {
        this.initialSize = initialSize;
        this.maxSize = maxSize;
        this.maxSpeed = maxSpeed;
        this.meltSpeed = meltSpeed;
        this.size = 0;
        this.isScaled = false;
        this.x = Math.random() * (window.innerWidth - this.size * 2) + this.size;
        this.y = Math.random() * (window.innerHeight - this.size * 2) + this.size;
        this.dx = (Math.random() - 0.5) * this.maxSpeed;
        this.dy = (Math.random() - 0.5) * this.maxSpeed;
        this.color = getRandomColor();
    }
    Bubble.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };
    Bubble.prototype.checkCollisions = function () {
        if ((this.x + this.size > window.innerWidth && this.dx > 0) ||
            (this.x - this.size < 0 && this.dx < 0))
            this.dx = -this.dx;
        if ((this.y + this.size > window.innerHeight && this.dy > 0) ||
            (this.y - this.size < 0 && this.dy < 0))
            this.dy = -this.dy;
    };
    Bubble.prototype.getCoordinates = function () {
        return { x: this.x, y: this.y };
    };
    Bubble.prototype.sizeByMousePosition = function () {
        var distanceToMouse = distance(this.getCoordinates(), mouse);
        if (distanceToMouse < 200)
            this.size += 1;
        else if (this.size > this.initialSize)
            this.size -= 0.5;
        this.size = clampMax(this.size, this.maxSize);
    };
    Bubble.prototype.isAlive = function () {
        return this.size > 1 || !this.isScaled;
    };
    Bubble.prototype.update = function (ctx) {
        this.sizeByMousePosition();
        this.checkCollisions();
        if (this.isScaled)
            this.size -= this.meltSpeed;
        else {
            this.size += 0.1;
            this.isScaled = this.size >= this.initialSize;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw(ctx);
    };
    return Bubble;
}());
var bubbles = Array(500).fill(null);
for (var i = 0; i < bubbles.length; i++)
    bubbles[i] = new Bubble(10, 50, 4, 0.1);
var update = function () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    for (var i = 0; i < bubbles.length; i++) {
        if (!bubbles[i].isAlive())
            bubbles[i] = new Bubble(10, 50, 4, 0.1);
        bubbles[i].update(ctx);
    }
    requestAnimationFrame(update);
};
update();
