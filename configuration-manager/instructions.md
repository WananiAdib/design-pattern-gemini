Your Task:

Implement a ConfigurationManager class using the Singleton Design Pattern.

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance.

Here's what your ConfigurationManager should do:

Enforce Single Instance: Ensure that only one instance of ConfigurationManager can ever be created.
Global Access Point: Provide a static method to get that single instance.
Basic Functionality: Include a method to load configuration (e.g., loadConfig()) and a method to get a specific setting (e.g., getSetting(key: string)). For simplicity, you can just use a hardcoded object for the configuration data.
Example of how it should be used (and what it prevents):

```ts
// This should NOT be possible if you try to instantiate directly:
// const manager1 = new ConfigurationManager(); // Should cause a compile-time or runtime error

// This is how you SHOULD get the instance:
const config1 = ConfigurationManager.getInstance();
config1.loadConfig(); // Simulate loading config

const config2 = ConfigurationManager.getInstance();

// Both config1 and config2 should reference the exact same object
console.log(config1 === config2); // Expected: true

console.log(config1.getSetting("appName")); // Example of getting a setting
console.log(config2.getSetting("version")); // Example of getting another setting
```

Think about how you can use private constructors and static properties/methods in TypeScript to achieve this.

Share your TypeScript code for the ConfigurationManager when you're ready for feedback! Good luck!
