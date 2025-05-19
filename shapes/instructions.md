Consider the following TypeScript code that creates different geometric shapes:

```ts
// shapes.ts

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

class ShapeCreator {
    // This method is responsible for deciding *which* shape to create
    createShape(type: string, ...args: any[]): Shape | null {
        if (type === 'circle') {
            const radius = args[0] as number;
            if (typeof radius === 'number') {
                return new Circle(radius);
            }
        } else if (type === 'square') {
             const sideLength = args[0] as number;
             if (typeof sideLength === 'number') {
                return new Square(sideLength);
            }
        }
        // Adding a new shape (e.g., Triangle) requires modifying this method
        console.error(`Unknown shape type: ${type}`);
        return null;
    }
}

// --- Usage ---
const creator = new ShapeCreator();

const circle = creator.createShape('circle', 5);
if (circle) {
    circle.draw();
}

const square = creator.createShape('square', 10);
if (square) {
    square.draw();
}

const unknown = creator.createShape('triangle', 7); // This will log an error
if (unknown) {
    unknown.draw(); // This won't happen
}
```

### Critique:
The ShapeCreator class has a method (createShape) that is directly responsible for instantiating different concrete shape classes (new Circle(), new Square()). This method has to know about all possible shape types and how to create each one, typically using conditional logic (if/else if or switch).

If you introduce a new shape type (like Triangle), you must modify the createShape method within ShapeCreator. This violates the Open/Closed Principle (software entities should be open for extension, but closed for modification) and creates tight coupling between the ShapeCreator and the concrete shape classes.

### Your Task:

Refactor the object creation logic using the Simple Factory Pattern.

The Simple Factory (sometimes called a Static Factory Method) is not an official GoF pattern but is a widely used idiom. It involves creating a dedicated class or function whose sole purpose is to create objects of other classes. This centralizes object creation.

### Think about:

How can you separate the object creation logic from the ShapeCreator's other potential responsibilities?
Where should the logic for deciding which shape to create reside?
How can the client code (the "Usage" section) interact with this factory?
Implement the refactoring in TypeScript. Share your code when you're ready for feedback!