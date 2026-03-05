
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

abstract class GUIFactory {
    abstract createButton(): Button;
    abstract createCheckbox(): Checkbox;
}

class WinFactory implements GUIFactory {
    createButton() {
        return new WinButton();
    }

    createCheckbox(): Checkbox {
        return new WinCheckbox();
    }
}

class MacFactory implements GUIFactory {
    createButton() {
        return new MacButton();
    }

    createCheckbox(): Checkbox {
        return new MacCheckbox();
    }
}

// --- The Client Code ---
class Application {

    constructor(private guiFactory: GUIFactory) {
    }

    // Problem: The Application is tightly coupled to concrete classes (WinButton, MacButton, etc.)
    // If we add a new OS (like Linux), we have to modify this method and add more if/else blocks.
    public renderUI(): void {
        
        const button = this.guiFactory.createButton();
        const checkbox = this.guiFactory.createCheckbox();

        button.paint();
        checkbox.paint();
    }
}

// --- Client Usage (Initial) ---
const winApp = new Application(new WinFactory());
winApp.renderUI();

const macApp = new Application(new MacFactory());
macApp.renderUI();
