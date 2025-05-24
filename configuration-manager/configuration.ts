class ConfigurationManager {
	private static instance: ConfigurationManager;
	private settings;

	private constructor() {
		this.settings = {};
	}

	public static getInstance(): ConfigurationManager {
		if (!ConfigurationManager.instance) {
			ConfigurationManager.instance = new ConfigurationManager();
		}
		return ConfigurationManager.instance;
	}

	loadConfig() {
		this.settings = {
			appName: "my app",
			version: "v3",
		};
	}

	getSetting(setting: string) {
		return this.settings[setting as keyof typeof this.settings];
	}
}

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
