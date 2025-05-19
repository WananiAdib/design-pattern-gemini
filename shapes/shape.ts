interface Shape {
	draw(): void;
}

class Circle implements Shape {
	private radius: number;

	constructor(radius: number) {
		this.radius = radius;
	}

	draw(): void {
		console.log(`Drawing Circle with radius ${this.radius}`);
	}
}

class Square implements Shape {
	private sideLength: number;

	constructor(sideLength: number) {
		this.sideLength = sideLength;
	}

	draw(): void {
		console.log(`Drawing Square with side length ${this.sideLength}`);
	}
}

abstract class ShapeCreator {
	// This method is responsible for deciding *which* shape to create

	public abstract createShape(...args: any[]): Shape | null;
}

class SquareCreator extends ShapeCreator {
	public createShape(...args: any[]): Shape | null {
		const sideLength = args[0] as number;
		if (typeof sideLength === "number") {
			return new Square(sideLength);
		}
        console.error('wrong args')
		return null;
	}
}

class CircleCreator extends ShapeCreator {
	public createShape(...args: any[]): Shape | null {
		const radius = args[0] as number;
		if (typeof radius === "number") {
		return new Circle(radius);
        }
        console.error('wrong args')
        return null
	}
}

// --- Usage ---

const circle = new CircleCreator().createShape(5);
if (circle) {
	circle.draw();
}

const square = new SquareCreator().createShape(10);
if (square) {
	square.draw();
}
