
// bridge/instructions.md (or initial code)

interface MessageSender {
    sendMessage(text: string): void;
}

class EmailSender implements MessageSender {
    sendMessage(text: string): void {
        console.log(`[Email] ${text}`)
    }
}

class SMSSender implements MessageSender {
    sendMessage(text: string): void {
        console.log(`[SMS] ${text}`)
    }
}

class SlackSender implements MessageSender {
    sendMessage(text: string): void {
        console.log(`[Slack] ${text}`)
    }
}

abstract class MessageNotifier {
    constructor (protected messageSender: MessageSender) {}

    abstract send(title: string, message: string): void;
}


class StandardNotification extends MessageNotifier {
    send(title: string, message: string): void {
        this.messageSender.sendMessage(`${title} - ${message}`)
    }
}

class UrgentNotification extends MessageNotifier {
    send(title: string, message: string): void {
        this.messageSender.sendMessage(`[URGENT] ${title} - ${message}`)
    }
}


// --- Client Usage (Initial) ---
const emailAlert = new StandardNotification(new EmailSender());
emailAlert.send("Server Load High", "CPU usage is at 85%.");

const smsUrgent = new UrgentNotification( new SMSSender());
smsUrgent.send("Server Down", "The main database is unresponsive.");

// PROBLEM: If we add a new Channel (e.g., Slack) we have to create `StandardSlackAlert` and `UrgentSlackAlert`. 
// If we add a new Type (e.g., DailyDigest), we have to create `DailyDigestEmail`, `DailyDigestSMS`, `DailyDigestSlack`.
// The number of classes multiplies rapidly (Type × Channel).