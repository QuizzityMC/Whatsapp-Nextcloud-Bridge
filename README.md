# WhatsApp-Nextcloud Bridge

A seamless, easy-to-setup bridge that connects WhatsApp and Nextcloud Talk, allowing messages to flow bidirectionally between the two platforms.

> **⚡ No separate phone number needed!** This bridge uses WhatsApp Web's linked device feature - just scan a QR code with your existing WhatsApp account.

## Features

- 🔄 **Bidirectional messaging**: Messages flow seamlessly in both directions
- 🚀 **Easy setup**: Minimal configuration required
- 📱 **WhatsApp Web integration**: Uses WhatsApp Web, no unofficial APIs
- 🔐 **Secure**: Self-hosted on your own server
- 🐳 **Docker support**: Easy deployment with Docker
- 📝 **Message prefixes**: Clear indication of message source
- 💾 **Session persistence**: Stays authenticated between restarts

## Prerequisites

- Node.js 18 or higher
- A Nextcloud instance with Talk app installed
- Your existing WhatsApp account (no separate phone number required!)

## Quick Start

**📖 For a comprehensive step-by-step guide**, see the [Complete Tutorial](docs/TUTORIAL.md)

**⚡ Quick setup for experienced users:**

### 1. Clone the Repository

```bash
git clone https://github.com/QuizzityMC/Whatsapp-Nextcloud-Bridge.git
cd Whatsapp-Nextcloud-Bridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. (Optional) Verify Installation

Run the verification script to check your setup:

```bash
./verify.sh
```

### 4. Configure the Bridge

Copy the example environment file and edit it with your details:

```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

Fill in the following required values:

- **NEXTCLOUD_URL**: Your Nextcloud instance URL (e.g., `https://cloud.example.com`)
- **NEXTCLOUD_USERNAME**: Your Nextcloud username
- **NEXTCLOUD_PASSWORD**: Your Nextcloud password or app password
- **NEXTCLOUD_TALK_TOKEN**: The conversation token from Nextcloud Talk
- **WHATSAPP_CHAT_ID**: The WhatsApp chat ID (format: `1234567890@c.us`)

#### Getting the Nextcloud Talk Token

1. Open Nextcloud Talk in your browser
2. Navigate to the conversation you want to bridge
3. The token is in the URL: `https://your-nextcloud.com/call/TOKEN_HERE`

#### Getting the WhatsApp Chat ID

The chat ID will be displayed in the logs when you first receive a message. Alternatively:
- For individual chats: `[country_code][phone_number]@c.us` (e.g., `1234567890@c.us`)
- For group chats: Run the bridge once and check the logs when messages are received

### 5. Start the Bridge

```bash
npm start
```

On first run, you'll see a QR code in the terminal. **You'll use your existing WhatsApp account** - no separate phone number needed!

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
   - **Android**: Tap the three-dot menu (⋮) → Linked Devices
   - **iOS**: Tap Settings (gear icon) → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code displayed in the terminal

**How it works:** The bridge acts as a linked device (like WhatsApp Web) to your existing WhatsApp account. You don't need a second phone number - it's all connected to your current WhatsApp!

Once authenticated, the bridge will start forwarding messages automatically!

## Docker Deployment

### Using Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  whatsapp-nextcloud-bridge:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
      - session-data:/app/session
    environment:
      - NEXTCLOUD_URL=${NEXTCLOUD_URL}
      - NEXTCLOUD_USERNAME=${NEXTCLOUD_USERNAME}
      - NEXTCLOUD_PASSWORD=${NEXTCLOUD_PASSWORD}
      - NEXTCLOUD_TALK_TOKEN=${NEXTCLOUD_TALK_TOKEN}
      - WHATSAPP_CHAT_ID=${WHATSAPP_CHAT_ID}
      - NC_TO_WA_PREFIX=${NC_TO_WA_PREFIX:-[Nextcloud]}
      - WA_TO_NC_PREFIX=${WA_TO_NC_PREFIX:-[WhatsApp]}
    command: sh -c "npm install && npm start"
    restart: unless-stopped

volumes:
  session-data:
```

Then run:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

### Using Docker

Build the image:

```bash
docker build -t whatsapp-nextcloud-bridge .
```

Run the container:

```bash
docker run -d \
  --name whatsapp-bridge \
  --env-file .env \
  -v $(pwd)/session:/app/session \
  whatsapp-nextcloud-bridge
```

## Systemd Service Deployment (Linux)

For running as a system service on Linux, see the [Systemd Installation Guide](systemd/INSTALL.md).

## Configuration Options

All configuration is done via environment variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXTCLOUD_URL` | Yes | Your Nextcloud instance URL | - |
| `NEXTCLOUD_USERNAME` | Yes | Nextcloud username | - |
| `NEXTCLOUD_PASSWORD` | Yes | Nextcloud password or app password | - |
| `NEXTCLOUD_TALK_TOKEN` | Yes | Talk conversation token | - |
| `WHATSAPP_CHAT_ID` | Yes | WhatsApp chat ID to bridge | - |
| `NC_TO_WA_PREFIX` | No | Prefix for Nextcloud messages | `[Nextcloud]` |
| `WA_TO_NC_PREFIX` | No | Prefix for WhatsApp messages | `[WhatsApp]` |
| `SESSION_DIR` | No | Directory for session storage | `./session` |
| `LOG_LEVEL` | No | Logging level (DEBUG, INFO, WARN, ERROR) | `INFO` |

## How It Works

### WhatsApp Connection (No Separate Phone Number!)

The bridge uses **WhatsApp Web** technology, which means:
- ❌ You do **NOT** need a second phone number or SIM card
- ✅ You use your **existing WhatsApp account**
- ✅ The bridge appears as a "Linked Device" in WhatsApp (like WhatsApp Web or Desktop)
- ✅ Your phone stays the primary device
- ✅ All messages sync across devices

When you scan the QR code, the bridge links to your WhatsApp account just like WhatsApp Web does. You can manage linked devices in WhatsApp Settings → Linked Devices.

### Message Flow

1. **WhatsApp → Nextcloud**: When a message is received in the configured WhatsApp chat, it's forwarded to Nextcloud Talk with a `[WhatsApp]` prefix and the sender's name.

2. **Nextcloud → WhatsApp**: When a message is posted in the configured Nextcloud Talk conversation, it's forwarded to WhatsApp with a `[Nextcloud]` prefix and the sender's name.

3. **Authentication**: WhatsApp uses session persistence, so you only need to scan the QR code once. The session data is stored in the `session` directory.

## Troubleshooting

For detailed troubleshooting information, see the [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

### Quick Fixes

**QR Code Not Appearing**
- Use `docker logs -f container-name` for Docker
- Use `sudo journalctl -u whatsapp-nextcloud-bridge -f` for systemd

**Authentication Failures**
```bash
rm -rf session/
npm start  # Scan QR code again
```

**Messages Not Being Forwarded**
- Check logs for errors
- Verify configuration in `.env`
- See [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for detailed steps

## Additional Documentation

- **[Complete Step-by-Step Tutorial](docs/TUTORIAL.md)** - Comprehensive guide for first-time setup ⭐ **Start here!**
- [Message Flow Examples](docs/MESSAGE_FLOW.md) - See how messages are formatted and forwarded
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Detailed solutions for common issues
- [Systemd Installation](systemd/INSTALL.md) - Run as a Linux system service
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to the project

## Security Considerations

- **Passwords**: Use Nextcloud app passwords instead of your main password
- **Session Data**: The `session` directory contains authentication data - keep it secure
- **Network**: Run on a trusted network or use proper firewall rules
- **HTTPS**: Always use HTTPS for your Nextcloud instance

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses Node's watch mode to automatically restart on file changes.

### Project Structure

```
.
├── src/
│   ├── index.js              # Main entry point
│   ├── whatsapp-client.js    # WhatsApp integration
│   ├── nextcloud-client.js   # Nextcloud Talk integration
│   ├── message-bridge.js     # Message bridging logic
│   └── utils/
│       └── logger.js         # Logging utility
├── .env.example              # Example configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Frequently Asked Questions

### Do I need a separate phone number for this bridge?

**No!** This is one of the most common questions. The bridge uses **WhatsApp Web** technology - you just scan a QR code with your existing WhatsApp account. No second phone number, no separate SIM card needed!

### How does the bridge appear in WhatsApp?

The bridge links to your existing WhatsApp account as a device (like WhatsApp Web). Messages sent from Nextcloud to WhatsApp will appear to come from "You" (your account), but they include the original sender's name in the message text (e.g., `[Nextcloud] *Alice*: Hi!`).

### Can I use this with WhatsApp Business?

Yes! The setup is exactly the same. Just scan the QR code with your WhatsApp Business account.

### Will this log me out of WhatsApp Web?

No. WhatsApp supports multiple linked devices simultaneously. The bridge is just another linked device.

### What happens if my phone is offline?

WhatsApp's multi-device feature allows the bridge to work even when your phone is offline. However, your phone needs to be online at least once every 14 days to keep devices linked.

### Can I bridge multiple chats?

Yes! Run multiple instances of the bridge with different configurations. See the [Tutorial](docs/TUTORIAL.md#bridging-multiple-chats) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for any purpose.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Built with [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Uses the [Nextcloud Talk API](https://nextcloud-talk.readthedocs.io/)

---

**Note**: This bridge is not affiliated with WhatsApp or Nextcloud. Use at your own risk.