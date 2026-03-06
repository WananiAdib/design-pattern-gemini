
### Exercise: The Memory-Intensive Forest

The **Flyweight** pattern is an optimization pattern. It is used when you need to create a massive number of objects (tens of thousands or more) that would normally crash your RAM. It works by separating the object's state into two parts:

1. **Intrinsic State:** The data that is identical across many objects (e.g., the 3D mesh and texture of a tree). This state is extracted, cached, and shared.
2. **Extrinsic State:** The data that is unique to each specific instance (e.g., the X and Y coordinates of a tree). This is passed in by the client when needed.

Imagine you are rendering a huge forest in a game. Currently, every single tree holds its own copy of heavy texture data.

Here is the initial "problem" code:

```typescript
// flyweight/instructions.md (or initial code)

class Tree {
    public x: number;
    public y: number;
    public speciesName: string;
    public leafColor: string;
    public barkTexture: string; // Imagine this is a heavy 5MB image buffer

    constructor(x: number, y: number, speciesName: string, leafColor: string, barkTexture: string) {
        this.x = x;
        this.y = y;
        this.speciesName = speciesName;
        this.leafColor = leafColor;
        this.barkTexture = barkTexture;
    }

    public draw(): void {
        console.log(`Drawing [${this.speciesName}] tree with ${this.leafColor} leaves at (${this.x}, ${this.y})`);
    }
}

class Forest {
    private trees: Tree[] = [];

    public plantTree(x: number, y: number, speciesName: string, leafColor: string, barkTexture: string): void {
        const tree = new Tree(x, y, speciesName, leafColor, barkTexture);
        this.trees.push(tree);
    }

    public draw(): void {
        for (const tree of this.trees) {
            tree.draw();
        }
    }
}

// --- Client Usage (Initial) ---
const forest = new Forest();

// We are planting 1,000,000 trees. 
// PROBLEM: Because 'barkTexture' and 'speciesName' are duplicated in EVERY tree object, 
// this will consume Gigabytes of RAM and likely crash the application.
for (let i = 0; i < 500000; i++) {
    forest.plantTree(Math.random() * 100, Math.random() * 100, "Oak", "Green", "oak_bark_5MB.png");
}
for (let i = 0; i < 500000; i++) {
    forest.plantTree(Math.random() * 100, Math.random() * 100, "Pine", "Dark Green", "pine_bark_5MB.png");
}

forest.draw();

```

### Your Task:

Refactor this system using the **Flyweight Design Pattern**.

Here's what you should aim for:

1. **Create the Flyweight Class (`TreeType`):**
Extract the *Intrinsic* (shared) state into a new class called `TreeType`. It should hold `speciesName`, `leafColor`, and `barkTexture`. It should also have the `draw(x: number, y: number)` method (taking the extrinsic state as arguments).
2. **Create the Flyweight Factory (`TreeFactory`):**
Create a factory that manages a cache/dictionary of `TreeType` objects.
When asked for a `TreeType`, it should check if a type with that name/color/texture already exists. If it does, return the cached one. If it doesn't, create a new one, save it in the cache, and return it.
3. **Update the Context Class (`Tree`):**
The `Tree` class now only holds the *Extrinsic* state (`x` and `y`) and a reference to a `TreeType` object. Its `draw()` method simply calls `this.treeType.draw(this.x, this.y)`.
4. **Update the `Forest` (Client):**
When `plantTree` is called, use the `TreeFactory` to get the shared `TreeType`, then instantiate the lightweight `Tree` with the coordinates and the `TreeType` reference.

### Expected Outcome After Refactoring:

Even if you plant 1,000,000 trees, your application will only create **two** `TreeType` objects in memory (one for Oak, one for Pine). The millions of `Tree` objects will just be tiny wrappers holding an X/Y coordinate and a pointer, saving massive amounts of RAM.

Create your `flyweight/instructions.md` and `index.ts` files and share your code when you're ready!