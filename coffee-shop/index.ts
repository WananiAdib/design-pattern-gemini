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

// Abstract decorator class
abstract class CoffeeDecorator implements Coffee {
	protected coffee: Coffee;

	constructor(coffee: Coffee) {
		this.coffee = coffee;
	}

	abstract getCost(): number;
	abstract getDescription(): string;
}

class MilkDecorator extends CoffeeDecorator {
	constructor(coffee: Coffee) {
		super(coffee);
	}

	getCost(): number {
		return this.coffee.getCost() + 1.5;
	}

	getDescription(): string {
		return this.coffee.getDescription() + ", Milk";
	}
}

class SugarDecorator extends CoffeeDecorator {
	constructor(coffee: Coffee) {
		super(coffee);
	}
	getCost(): number {
		return this.coffee.getCost() + 1;
	}

	getDescription(): string {
		return this.coffee.getDescription() + ", Sugar";
	}
}
class MochaDecorator extends CoffeeDecorator {
	constructor(coffee: Coffee) {
		super(coffee);
	}
	getCost(): number {
		return this.coffee.getCost() + 0.2;
	}

	getDescription(): string {
		return this.coffee.getDescription() + ", Mocha";
	}
}

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
