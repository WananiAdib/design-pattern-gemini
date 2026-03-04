### Exercise: Cross-Platform UI Toolkit

Imagine you are building a cross-platform desktop application. You need to render UI elements like Buttons and Checkboxes, but they need to look like native Windows components when running on Windows, and native macOS components when running on a Mac.

Currently, your application code has `if/else` statements scattered everywhere to figure out which concrete class to instantiate.

Here is the initial "problem" code:

```typescript
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

```

### Your Task:

Refactor this system using the **Abstract Factory Design Pattern**.

The Abstract Factory pattern lets you produce families of related objects without specifying their concrete classes. Instead of the `Application` checking the OS and calling `new WinButton()`, it should just ask a factory to "give me a button" and the factory handles the OS-specific details.

Here's what you should aim for:

1. **The Abstract Factory Interface (`GUIFactory`):**
Create an interface that declares a set of methods for creating each of the abstract products.
* `createButton(): Button`
* `createCheckbox(): Checkbox`


2. **The Concrete Factories:**
Create classes that implement `GUIFactory` for each specific family (OS).
* `WinFactory`: `createButton` returns a `WinButton`, `createCheckbox` returns a `WinCheckbox`.
* `MacFactory`: `createButton` returns a `MacButton`, `createCheckbox` returns a `MacCheckbox`.


3. **Refactor the `Application` Class:**
* The `Application` constructor should no longer take a string like `"Windows"`. Instead, it should accept an object of type `GUIFactory`.
* The `renderUI()` method should be completely stripped of `if/else` logic. It should simply call `this.factory.createButton()` and `this.factory.createCheckbox()`.



### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// The "configuration" phase: we decide which factory to use based on the environment
let factory: GUIFactory;
const currentOS = "Windows"; // Imagine this comes from process.env or navigator.userAgent

if (currentOS === "Windows") {
    factory = new WinFactory();
} else {
    factory = new MacFactory();
}

// The Application itself knows nothing about Windows or Mac!
// It just knows it has a factory that makes compatible UI elements.
const app = new Application(factory);
app.renderUI();

```

Create your `abstract-factory/instructions.md` and `index.ts` files, and share your refactored code whenever you're ready!