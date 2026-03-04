### Exercise: File System Size Calculator

The Composite pattern lets you compose objects into tree structures and then work with these structures as if they were individual objects. It is incredibly useful whenever you are dealing with hierarchies (like the DOM in a browser, UI component trees, or file systems).

Imagine you are building a tool to analyze a file system. You have `Files` (which have a size) and `Folders` (which contain files and other folders).

Currently, the client code has to treat Files and Folders differently. Calculating the total size of a folder requires messy loops and type checking (or separate arrays) because there is no unified way to interact with them.

Here is the initial "problem" code:

```typescript
// composite/instructions.md (or initial code)

class SimpleFile {
    constructor(public name: string, public size: number) {}
}

class SimpleFolder {
    public name: string;
    public files: SimpleFile[] = [];
    public subFolders: SimpleFolder[] = []; // Notice how we have to separate them

    constructor(name: string) {
        this.name = name;
    }

    addFile(file: SimpleFile) {
        this.files.push(file);
    }

    addFolder(folder: SimpleFolder) {
        this.subFolders.push(folder);
    }
}

// The client has to know the exact structure and handle Files and Folders differently
class FileSystemAnalyzer {
    public calculateTotalSize(folder: SimpleFolder): number {
        let total = 0;
        
        // Step 1: Add sizes of direct files
        for (const file of folder.files) {
            total += file.size;
        }
        
        // Step 2: Recursively add sizes of sub-folders
        for (const subFolder of folder.subFolders) {
            total += this.calculateTotalSize(subFolder);
        }
        
        return total;
    }
}

// --- Client Usage (Initial) ---
const root = new SimpleFolder("Root");
const docs = new SimpleFolder("Documents");
const pics = new SimpleFolder("Pictures");

const resume = new SimpleFile("resume.pdf", 150); // 150 KB
const coverLetter = new SimpleFile("cover_letter.docx", 50); // 50 KB
const vacationPic = new SimpleFile("beach.png", 2000); // 2000 KB

docs.addFile(resume);
docs.addFile(coverLetter);
pics.addFile(vacationPic);

root.addFolder(docs);
root.addFolder(pics);
root.addFile(new SimpleFile("readme.txt", 10)); // 10 KB

const analyzer = new FileSystemAnalyzer();
console.log(`Total Size of Root: ${analyzer.calculateTotalSize(root)} KB`);

```

### Your Task:

Refactor this system using the **Composite Design Pattern**.

Here's what you should aim for:

1. **The Component Interface (`FileSystemComponent`):**
Create an interface or abstract class that defines the common operations for *both* simple and complex elements of the tree.
* `getName(): string`
* `getSize(): number`


2. **The Leaf (`File`):**
Create a `File` class that implements `FileSystemComponent`. A file doesn't have children. Its `getSize()` method just returns its own size.
3. **The Composite (`Folder`):**
Create a `Folder` class that *also* implements `FileSystemComponent`.
* It should maintain a **single array** of `FileSystemComponent` children (this array can hold both Files and other Folders!).
* It needs an `add(component: FileSystemComponent)` method.
* Its `getSize()` method should iterate over its children array, calling `getSize()` on each child, and returning the sum.



### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// Create the tree
const root = new Folder("Root");
const docs = new Folder("Documents");
const pics = new Folder("Pictures");

// Notice we can add Files and Folders using the exact same method
docs.add(new File("resume.pdf", 150));
docs.add(new File("cover_letter.docx", 50));
pics.add(new File("beach.png", 2000));

root.add(docs);
root.add(pics);
root.add(new File("readme.txt", 10));

// The client code no longer needs a complex analyzer!
// It treats the complex Folder exactly the same as a simple File.
console.log(`Total Size of Root: ${root.getSize()} KB`);
console.log(`Total Size of Documents: ${docs.getSize()} KB`);

```

Create your `composite/instructions.md` and `index.ts` files, and share your refactored code whenever you're ready!