### Exercise: Game Monster Spawner

Imagine you are building a video game. You have an enemy spawner that needs to generate waves of monsters. Monsters are complex objects: they have health, speed, names, and equipped weapons (which are themselves objects).

Currently, to spawn a wave of specific enemies, the client code has to manually instantiate each one and re-configure all of their stats. Even worse, if a monster picks up a buff during gameplay and you want to clone its *current* state, you have to manually copy every property over.

Here is the initial "problem" code:

```typescript
// prototype/instructions.md (or initial code)

class Weapon {
    constructor(public name: string, public damage: number) {}
}

class Monster {
    public name: string;
    public health: number;
    public speed: number;
    public weapon: Weapon;

    constructor(name: string, health: number, speed: number, weapon: Weapon) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.weapon = weapon;
    }

    public display(): void {
        console.log(`[${this.name}] HP: ${this.health} | Speed: ${this.speed} | Weapon: ${this.weapon.name} (+${this.weapon.damage} dmg)`);
    }
}

// --- Client Usage (Initial) ---

// 1. The designers created a base template for a Poison Goblin
const baseGoblin = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
baseGoblin.display();

// PROBLEM: The Spawner needs to spawn 3 more identical goblins.
// It has to tightly couple itself to the Monster constructor and know all the stats!
const goblin2 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
const goblin3 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
const goblin4 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));

// PROBLEM 2: What if we want to clone a monster's *current* state?
// Let's say baseGoblin finds a sword. If we want to clone him now, 
// we have to manually copy every single property.
baseGoblin.weapon = new Weapon("Iron Sword", 25);
const clonedMutatedGoblin = new Monster(baseGoblin.name, baseGoblin.health, baseGoblin.speed, new Weapon(baseGoblin.weapon.name, baseGoblin.weapon.damage));

```

### Your Task:

Refactor this system using the **Prototype Design Pattern**.

Here's what you should aim for:

1. **The Prototype Interface (`Cloneable`):**
Create an interface that declares a `clone()` method. This method should return an object of the same type.
2. **Implement the Interface:**
Make the `Monster` class implement your `Cloneable` interface.
Inside the `clone()` method, create a new instance of `Monster` using `this` object's current properties.
3. **The "Gotcha" - Deep Copy vs. Shallow Copy:**
Pay close attention to the `weapon` property! If you simply pass `this.weapon` into the clone's constructor, both the original monster and the clone will share the *exact same* Weapon object reference in memory (a shallow copy). If the clone's weapon damage increases, the original monster's damage will increase too!
*To fix this, ensure your `clone()` method makes a **deep copy** by instantiating a new `Weapon` for the clone, using the current weapon's name and damage.*
*(Bonus points: You can also make `Weapon` implement `Cloneable`!)*

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// 1. Create our base prototype
const baseGoblin = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));

// 2. The spawner simply asks the prototype to clone itself!
const goblin2 = baseGoblin.clone();
const goblin3 = baseGoblin.clone();

// 3. Let's test the Deep Copy!
// We give goblin2 a new name and upgrade its weapon.
goblin2.name = "Elite Goblin";
goblin2.weapon.name = "Venomous Strike";
goblin2.weapon.damage = 50;

console.log("--- Checking Clones ---");
baseGoblin.display(); // Should STILL be "Poison Dagger" with 10 dmg
goblin2.display();    // Should be "Venomous Strike" with 50 dmg

```

Create your `prototype/instructions.md` and `index.ts` files. Give it a shot, and share your refactored TypeScript code whenever you're ready!