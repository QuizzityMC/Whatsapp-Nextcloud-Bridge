# Message Flow Examples

This document shows examples of how messages flow between WhatsApp and Nextcloud Talk.

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
[Nextcloud] *Alice*: Hi from Nextcloud!
```

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
📱 *Alice*: Hi!
```

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
