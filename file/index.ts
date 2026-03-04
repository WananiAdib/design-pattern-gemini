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