// flyweight/instructions.md (or initial code)
class TreeType {
    public speciesName: string;
    public leafColor: string;
    public barkTexture: string;

    constructor(speciesName: string, leafColor: string, barkTexture: string) {
        this.speciesName = speciesName;
        this.leafColor = leafColor;
        this.barkTexture = barkTexture;
    }

    public draw(x: number, y:number): void {
        console.log(`Drawing [${this.speciesName}] tree with ${this.leafColor} leaves at (${x}, ${y})`);
    }
    
}

class TreeFactory {
    private static treeMap: Map<`${string}_${string}_${string}`, TreeType> = new Map();


    static createTreeType(speciesName: string, leafColor: string, barkTexture: string): TreeType {
        const cache = TreeFactory.treeMap.get(`${speciesName}_${leafColor}_${barkTexture}`) 
        if (cache !== undefined) {
            return cache
        } 

        const newType = new TreeType(speciesName, leafColor, barkTexture)
        TreeFactory.treeMap.set(`${speciesName}_${leafColor}_${barkTexture}`, newType)
        return newType
    }
}

class Tree {
    public x: number;
    public y: number;
    public treeType: TreeType;

    constructor(x: number, y: number, treeType: TreeType) {
        this.x = x;
        this.y = y;
        this.treeType = treeType;
    }

    public draw(): void {
        this.treeType.draw(this.x, this.y)
    }
}

class Forest {
    private trees: Tree[] = [];

    public plantTree(x: number, y: number, speciesName: string, leafColor: string, barkTexture: string): void {
        const treeType = TreeFactory.createTreeType(speciesName, leafColor, barkTexture)
        const tree = new Tree(x, y, treeType);
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
