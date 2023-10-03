export const mouse = {
    x: undefined,
    y: undefined,
    b1: false,
    b2: false,
    b3: false,
    touched: false,
    buttonNames: ["b1", "b2", "b3"]

}

function Circle(x,y,radius,color, fill=true) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.fill = fill;

    this.pos = (x,y) => {
        this.x = x;
        this.y = y;
    }

    this.draw = (canvasContext) => {
        const ctx = canvasContext;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);

        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
}

class Canvas {
    #touchMoveCallback;
    #mouseMoveCallback;
    #mouseCallback;
    #touchCallback;

    constructor(canvasElem, context) {
        this.particles = [];
        this.canvasElem = canvasElem;
        this.context = context;
        this.#mouseMoveCallback = () => {};
        this.#touchMoveCallback = () => {};
        this.#touchCallback = (event) => {
            if (event.touches.length > 0) {
                mouse.x = event.touches[0].clientX;
                mouse.y = event.touches[0].clientY;
            }
            switch(event.type) {
                case "touchstart":
                    mouse.touched = true;
                    break;
                case "touchend":
                    mouse.touched = false;
                    break;
                default:
                    break;
            }
        };

        this.#mouseCallback = (event) => {
            let rect = this.canvasElem.getBoundingClientRect();
            mouse.x = event.x - rect.left;
            mouse.y = event.y - rect.top;
            switch(event.type) {
                case "mousedown":
                    mouse[mouse.buttonNames[event.which - 1]] = true;
                    break;
                case "mouseup":
                    mouse[mouse.buttonNames[event.which - 1]] = false;
                    break;
                default:
                    break;
            }
        };

        this.canvasElem.addEventListener("mousemove", (event) => {
            this.#mouseCallback(event);
            this.#mouseMoveCallback(event, this.canvasElem, this.context);
        });
        this.canvasElem.addEventListener("touchmove", (event) => {
            this.#touchCallback(event);
            this.#touchMoveCallback(event, this.canvasElem, this.context);
        });
        this.canvasElem.addEventListener("mousedown", this.#mouseCallback);
        this.canvasElem.addEventListener("mouseup", this.#mouseCallback);
        this.canvasElem.addEventListener("touchstart", this.#touchCallback);
        this.canvasElem.addEventListener("touchend", this.#touchCallback);
    }

    constrainSize(parentNode) {
        this.canvasElem.width = parentNode.clientWidth;
        this.canvasElem.height = parentNode.clientHeight;
        
        window.addEventListener("resize", () => {
            this.canvasElem.width = parentNode.clientWidth;
            this.canvasElem.height = parentNode.clientHeight;
        });
    }

    onMouseMove(callback) {
        this.#mouseMoveCallback = callback;
    }

    onTouchMove(callback) {
        this.#touchMoveCallback = callback;
    }
    
    drawParticles() {
        this.particles.forEach((particle) => {
            particle.draw(this.context);
        });
    }
    
    addCircle(x,y,radius,color,fill=true) {
        const circle = new Circle(x,y,radius,color,fill)
        this.particles.push(circle);
        return circle;
    }

    animate(callback) {
        let canvasElem = this.canvasElem;
        let context = this.context;
        function _animate(time) {
            requestAnimationFrame(_animate);
            callback(canvasElem, context, time);
        }
        _animate();
    }
}

function createCanvas(width=window.innerWidth, height=window.innerHeight) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    return new Canvas(canvas, context);
}

export default {
    createCanvas,
};