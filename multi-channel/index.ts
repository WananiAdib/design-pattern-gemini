
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