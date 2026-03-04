interface FileSystemComponent {
    getName(): string;
    getSize(): number;
}

class FileLeaf implements FileSystemComponent {
    constructor(private name: string, private size: number) {}
    public getName() {
        return this.name;
    }

    public getSize() {
        return this.size;
    }
}

class Folder implements FileSystemComponent {
    private components: FileSystemComponent[] = [];
    constructor(private name: string) {}

    public add(component: FileSystemComponent) {
        this.components.push(component)
    }

    public getName() {
        return this.name;
    }

    public getSize() {
        return this.components.reduce((prev, curr) => {
            return prev + curr.getSize()
        }, 0);
    }

}

// Create the tree
const root = new Folder("Root");
const docs = new Folder("Documents");
const pics = new Folder("Pictures");

// Notice we can add  and Folders using the exact same method
docs.add(new FileLeaf("resume.pdf", 150));
docs.add(new FileLeaf("cover_letter.docx", 50));
pics.add(new FileLeaf("beach.png", 2000));

root.add(docs);
root.add(pics);
root.add(new FileLeaf("readme.txt", 10));

// The client code no longer needs a complex analyzer!
// It treats the complex Folder exactly the same as a simple File.
console.log(`Total Size of Root: ${root.getSize()} KB`);
console.log(`Total Size of Documents: ${docs.getSize()} KB`);