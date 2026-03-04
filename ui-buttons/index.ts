
// abstract-factory/instructions.md (or initial code)

// --- The UI Components ---
interface Button {
    paint(): void;
}

interface Checkbox {
    paint(): void;
}

class WinButton implements Button {
    paint() { console.log("Rendering a Windows-style Button."); }
}

class MacButton implements Button {
    paint() { console.log("Rendering a macOS-style Button."); }
}

class WinCheckbox implements Checkbox {
    paint() { console.log("Rendering a Windows-style Checkbox."); }
}

class MacCheckbox implements Checkbox {
    paint() { console.log("Rendering a macOS-style Checkbox."); }
}

// --- The Client Code ---
class Application {
    private os: "Windows" | "macOS";

    constructor(os: "Windows" | "macOS") {
        this.os = os;
    }

    // Problem: The Application is tightly coupled to concrete classes (WinButton, MacButton, etc.)
    // If we add a new OS (like Linux), we have to modify this method and add more if/else blocks.
    public renderUI(): void {
        console.log(`\n--- Rendering UI for ${this.os} ---`);
        
        let button: Button;
        let checkbox: Checkbox;

        if (this.os === "Windows") {
            button = new WinButton();
            checkbox = new WinCheckbox();
        } else if (this.os === "macOS") {
            button = new MacButton();
            checkbox = new MacCheckbox();
        } else {
            throw new Error("Unknown OS");
        }

        button.paint();
        checkbox.paint();
    }
}

// --- Client Usage (Initial) ---
const winApp = new Application("Windows");
winApp.renderUI();

const macApp = new Application("macOS");
macApp.renderUI();
