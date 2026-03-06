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
