### Exercise: Multi-Channel Notification System

Imagine you are building a notification system. Notifications can have different **Types** (e.g., Standard, Urgent) and can be sent over different **Channels** (e.g., Email, SMS).

Currently, the system is designed using inheritance for everything. This tightly couples the notification type to the delivery mechanism.

Here is the initial "problem" code:

```typescript
// bridge/instructions.md (or initial code)

// A standard alert via Email
class StandardEmailAlert {
    send(title: string, message: string) {
        console.log(`[Email] Title: ${title}`);
        console.log(`[Email] Body: ${message}`);
    }
}

// An urgent alert via Email
class UrgentEmailAlert {
    send(title: string, message: string) {
        console.log(`[Email] *** URGENT: ${title} ***`);
        console.log(`[Email] Body: ${message.toUpperCase()}`);
    }
}

// A standard alert via SMS
class StandardSMSAlert {
    send(title: string, message: string) {
        console.log(`[SMS] ${title} - ${message}`);
    }
}

// An urgent alert via SMS
class UrgentSMSAlert {
    send(title: string, message: string) {
        console.log(`[SMS] [URGENT] ${title} - ${message.toUpperCase()}`);
    }
}

// --- Client Usage (Initial) ---
const emailAlert = new StandardEmailAlert();
emailAlert.send("Server Load High", "CPU usage is at 85%.");

const smsUrgent = new UrgentSMSAlert();
smsUrgent.send("Server Down", "The main database is unresponsive.");

// PROBLEM: If we add a new Channel (e.g., Slack) we have to create `StandardSlackAlert` and `UrgentSlackAlert`. 
// If we add a new Type (e.g., DailyDigest), we have to create `DailyDigestEmail`, `DailyDigestSMS`, `DailyDigestSlack`.
// The number of classes multiplies rapidly (Type × Channel).

```

### Your Task:

Refactor this system using the **Bridge Design Pattern** to separate the *Notification Type* (the Abstraction) from the *Delivery Channel* (the Implementation).

Here's what you should aim for:

1. **The Implementor Interface (`MessageSender`):**
Create an interface that handles the actual delivery mechanics. It should have a method like `sendMessage(text: string): void`.
2. **Concrete Implementors (`EmailSender`, `SMSSender`, `SlackSender`):**
Create classes that implement `MessageSender`. These classes don't care about "Urgent" or "Standard"—they just format and print the text for their specific platform.
* *Optional: Implement a `SlackSender` to prove how easy it is to add a new platform!*


3. **The Abstraction (`Notification`):**
Create an abstract class for the notification type.
* It should hold a protected reference to a `MessageSender` (passed in via the constructor). This is the "bridge".
* It should declare an abstract method `send(title: string, message: string): void`.


4. **Refined Abstractions (`StandardNotification`, `UrgentNotification`):**
Create concrete classes extending `Notification`.
* These classes dictate *what* gets sent (formatting the title and message to be urgent or standard), and then they delegate the actual sending to the bridged `sender.sendMessage(...)`.



### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// 1. Create the specific senders (Implementations)
const emailSender = new EmailSender();
const smsSender = new SMSSender();
const slackSender = new SlackSender(); // Try adding this!

// 2. Create the notifications, bridging them with the desired sender
const standardEmail = new StandardNotification(emailSender);
const urgentSMS = new UrgentNotification(smsSender);
const urgentSlack = new UrgentNotification(slackSender);

// 3. Send them!
standardEmail.send("Server Load High", "CPU usage is at 85%.");
urgentSMS.send("Server Down", "The main database is unresponsive.");
urgentSlack.send("Database Locked", "Deadlock detected on users table.");

// Notice how we can mix and match ANY type with ANY sender without needing a specific subclass for the combination!

```

Create your `bridge/instructions.md` and `index.ts` files, and share your refactored code whenever you're ready!