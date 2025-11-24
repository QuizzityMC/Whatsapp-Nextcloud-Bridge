# Message Flow Examples

This document shows examples of how messages flow between WhatsApp and Nextcloud Talk.

## Important: Understanding Message Appearance

### How Messages Appear in WhatsApp

Since the bridge uses **your WhatsApp account** as a linked device:
- Messages sent from Nextcloud to WhatsApp appear to come from **you** (your WhatsApp account)
- In the chat, you'll see these messages with **your name**
- The prefix `[Nextcloud]` and the actual sender's name help you identify who originally sent the message

**Example in WhatsApp:**
```
You: [Nextcloud] *Alice*: Hi from Nextcloud!
```

This is because the bridge is linked to your account - it's sending on your behalf, but the prefix and name show the real sender.

### How Messages Appear in Nextcloud Talk

Messages from WhatsApp show the original sender's name:
```
[WhatsApp] **John**: Hello from WhatsApp!
```

## WhatsApp → Nextcloud Talk

When someone sends a message in WhatsApp:

**WhatsApp:**
```
John: Hello from WhatsApp!
```

**Nextcloud Talk receives:**
```
[WhatsApp] **John**: Hello from WhatsApp!
```

## Nextcloud Talk → WhatsApp

When someone sends a message in Nextcloud Talk:

**Nextcloud Talk:**
```
Alice: Hi from Nextcloud!
```

**WhatsApp receives:**
```
You: [Nextcloud] *Alice*: Hi from Nextcloud!
```

**Note:** In WhatsApp, this appears as a message from "You" because the bridge uses your WhatsApp account. The prefix and name `*Alice*` show who actually sent it.

## Customizing Prefixes

You can customize the message prefixes by setting environment variables:

```bash
NC_TO_WA_PREFIX=📱
WA_TO_NC_PREFIX=💬
```

With custom prefixes:

**WhatsApp → Nextcloud:**
```
💬 **John**: Hello!
```

**Nextcloud → WhatsApp:**
```
You: 📱 *Alice*: Hi!
```

(Remember: In WhatsApp, you'll see "You:" before the message since it's your account sending it)

## Message Format

- **Bold** (`**text**`) is used in Nextcloud Talk
- *Italic* (`*text*`) is used in WhatsApp
- Sender names are included in all forwarded messages
- Original sender is preserved to avoid confusion

## What Gets Forwarded

✅ **Forwarded:**
- Text messages
- Sender names
- Message timestamps (in logs)

❌ **Not Forwarded:**
- Images and media (coming in future versions)
- Reactions
- Replies/quotes
- System messages (like "X joined the chat")
- Messages from the bridge itself (prevents loops)

## Privacy Notes

- The bridge only forwards messages between the configured WhatsApp chat and Nextcloud Talk conversation
- Messages from other chats are ignored
- The bridge runs locally on your server - no third-party services involved
- All authentication data stays on your server
- **The bridge uses your WhatsApp account**: Messages sent to WhatsApp will appear to come from you, but the sender's name is included in the message text to show who actually sent it
