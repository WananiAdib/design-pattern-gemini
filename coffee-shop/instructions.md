Imagine you're building a system for a coffee shop. You have a basic coffee, and customers can add various "condiments" (like milk, sugar, mocha, whipped cream) to it. Each condiment adds to the total cost and changes the description of the order.

The challenge is to allow customers to choose any combination of these condiments without creating an explosion of subclasses (e.g., CoffeeWithMilk, CoffeeWithSugarAndMilk, CoffeeWithMochaAndMilk, CoffeeWithMilkSugarAndMocha, etc.). This approach quickly becomes unmanageable.

Here's the initial code:

TypeScript

```ts
// Basic Coffee interface
interface Coffee {
	getCost(): number;
	getDescription(): string;
}

// Concrete Coffee product
class SimpleCoffee implements Coffee {
	getCost(): number {
		return 5;
	}
	getDescription(): string {
		return "Simple Coffee";
	}
}

// Problem: How do we add condiments dynamically without
// creating an endless number of subclasses for each combination?

// Example Usage (currently very basic):
const coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} cost: $${coffee.getCost()}`); // Output: Simple Coffee cost: $5
```

Your Task:

Refactor this coffee system using the Decorator Design Pattern.

The Decorator pattern allows you to attach new behaviors or responsibilities to an object dynamically, without altering its structure. It's an alternative to subclassing for extending functionality.

Here's what you should aim for:

Keep the Coffee Interface: This will be the component interface that both concrete components and decorators implement.
Create an Abstract Decorator Base Class: Define an abstract class (e.g., CoffeeDecorator) that also implements the Coffee interface. This class will hold a reference to a Coffee object (the component it's decorating) and delegate its getCost() and getDescription() methods to that wrapped component.
Create Concrete Decorator Classes: For each condiment (e.g., Milk, Sugar, Mocha), create a concrete decorator class (e.g., MilkDecorator, SugarDecorator, MochaDecorator) that extends CoffeeDecorator.
Override Methods: Each concrete decorator will override getCost() and getDescription() to add its specific cost and description to that of the wrapped coffee.
Composability: The design should allow you to wrap a Coffee object with multiple decorators.
Expected Usage after Refactoring:

```ts
const basicCoffee: Coffee = new SimpleCoffee();
console.log(`${basicCoffee.getDescription()} cost: $${basicCoffee.getCost()}`);
// Expected: Simple Coffee cost: $5

const coffeeWithMilk: Coffee = new MilkDecorator(basicCoffee);
console.log(
	`${coffeeWithMilk.getDescription()} cost: $${coffeeWithMilk.getCost()}`
);
// Expected: Simple Coffee, Milk cost: $6.5 (assuming Milk adds $1.5)

const coffeeWithMilkAndSugar: Coffee = new SugarDecorator(
	new MilkDecorator(basicCoffee)
);
console.log(
	`${coffeeWithMilkAndSugar.getDescription()} cost: $${coffeeWithMilkAndSugar.getCost()}`
);
// Expected: Simple Coffee, Milk, Sugar cost: $7.5 (assuming Sugar adds $1)

const customCoffee: Coffee = new MochaDecorator(
	new SugarDecorator(new MilkDecorator(new SimpleCoffee()))
);
console.log(
	`${customCoffee.getDescription()} cost: $${customCoffee.getCost()}`
);
// Expected: Simple Coffee, Milk, Sugar, Mocha cost: $9.5 (assuming Mocha adds $2)
```

Provide your refactored TypeScript code when you're ready for feedback! Good luck!
