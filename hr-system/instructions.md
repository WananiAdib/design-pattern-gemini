### Exercise: The HR Department Tool

The **Visitor Pattern** lets you separate algorithms from the objects on which they operate. It is incredibly useful when you have a stable structure of classes (like a hierarchy of elements) but you frequently want to add new operations to them.

Imagine an HR system managing different types of employees. Currently, every time HR wants to run a new process (e.g., calculate end-of-year bonuses, generate an XML report, evaluate health benefits), you have to go into the core `Employee`, `Developer`, and `Manager` classes and add a new method to all of them. This violates the Open/Closed Principle and creates bloated classes.

Here is the initial "problem" code:

```typescript
// visitor/instructions.md (or initial code)

abstract class Employee {
	constructor(
		public name: string,
		public salary: number,
	) {}

	// PROBLEM: Every time we want a new operation, we must modify the base class and ALL subclasses.
	abstract calculateBonus(): number;
	abstract generateReport(): string;
}

class Developer extends Employee {
	calculateBonus(): number {
		return this.salary * 0.1; // Devs get 10% bonus
	}

	generateReport(): string {
		return `<developer><name>${this.name}</name><salary>${this.salary}</salary></developer>`;
	}
}

class Manager extends Employee {
	constructor(
		name: string,
		salary: number,
		public teamSize: number,
	) {
		super(name, salary);
	}

	calculateBonus(): number {
		return this.salary * 0.2 + this.teamSize * 1000; // Managers get 20% + $1000 per team member
	}

	generateReport(): string {
		return `<manager><name>${this.name}</name><teamSize>${this.teamSize}</teamSize></manager>`;
	}
}

// --- Client Usage (Initial) ---
const company: Employee[] = [
	new Developer("Alice", 80000),
	new Manager("Bob", 120000, 5),
];

console.log("--- Generating Reports ---");
for (const employee of company) {
	console.log(employee.generateReport());
}

console.log("\n--- Calculating Bonuses ---");
for (const employee of company) {
	console.log(`${employee.name}'s Bonus: $${employee.calculateBonus()}`);
}
```

### Your Task:

Refactor this system using the **Visitor Design Pattern**.

Here's what you should aim for:

1. **The Visitor Interface (`EmployeeVisitor`):**
   Create an interface that declares a "visit" method for _each_ concrete element class.

- `visitDeveloper(dev: Developer): void`
- `visitManager(manager: Manager): void`

2. **The Concrete Visitors:**
   Extract the algorithms out of the employee classes and put them into new Visitor classes.

- Create a `BonusCalculatorVisitor`. When visiting, it should calculate the bonus and store the total (or print it).
- Create an `XMLReportVisitor`. When visiting, it should generate the XML string and store it (or print it).

3. **The Element Interface / Abstract Class:**
   Modify the `Employee` base class. Remove `calculateBonus` and `generateReport`. Instead, add a single method: `accept(visitor: EmployeeVisitor): void`.
4. **The Concrete Elements (`Developer`, `Manager`):**
   Implement the `accept` method. This is the magic of the Visitor pattern—it requires "Double Dispatch".
   Inside `Developer`, the method should simply be: `visitor.visitDeveloper(this);`
   Inside `Manager`, the method should be: `visitor.visitManager(this);`

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

const company: Employee[] = [
	new Developer("Alice", 80000),
	new Manager("Bob", 120000, 5),
];

// Now, the operations are extracted into their own classes!
const reportVisitor = new XMLReportVisitor();
const bonusVisitor = new BonusCalculatorVisitor();

console.log("--- Generating Reports ---");
for (const employee of company) {
	// We pass the operation (visitor) into the element
	employee.accept(reportVisitor);
}

console.log("\n--- Calculating Bonuses ---");
for (const employee of company) {
	employee.accept(bonusVisitor);
}

// NOTE: You might need to add a way for the visitor to output its final results,
// or have the visit methods return values (though standard Visitor usually returns void and accumulates state internally).
```

Create your `visitor/instructions.md` and `index.ts` files, and share your refactored code when you've got it working! After this, you are effectively at the finish line!
