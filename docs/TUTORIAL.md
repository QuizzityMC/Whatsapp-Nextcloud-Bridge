# Complete Tutorial: Setting Up WhatsApp-Nextcloud Bridge

This tutorial will guide you through setting up the WhatsApp-Nextcloud Bridge step-by-step. **Important: You do NOT need a separate phone number** - the bridge uses your existing WhatsApp account via WhatsApp Web's linked device feature.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Understanding How It Works](#understanding-how-it-works)
3. [Installation Steps](#installation-steps)
4. [Configuration Guide](#configuration-guide)
5. [First Time Setup](#first-time-setup)
6. [Verifying the Setup](#verifying-the-setup)
7. [Advanced Topics](#advanced-topics)

## Prerequisites

Before you begin, make sure you have:

- ✅ **A Nextcloud instance** with the Talk app installed and configured
- ✅ **Node.js 18 or higher** installed on your server
- ✅ **Your existing WhatsApp account** on your phone (no separate number needed!)
- ✅ **Basic terminal/command line knowledge**
- ✅ **SSH access** to your server (if deploying remotely)

### Checking Your Prerequisites

#### Verify Node.js Installation
```bash
node -v
# Should show v18.0.0 or higher
```

If Node.js is not installed or version is lower than 18:
- **Ubuntu/Debian**: `sudo apt install nodejs npm`
- **macOS**: `brew install node`
- **Other systems**: Visit https://nodejs.org/

#### Verify Nextcloud Talk
1. Log into your Nextcloud instance
2. Click the "Talk" icon in the top menu
3. If you don't see it, install the Talk app from the Apps section

## Understanding How It Works

### The WhatsApp Connection (No Separate Phone Number!)

**Important Clarification**: This bridge uses **WhatsApp Web**, which means:

- ❌ You do **NOT** need a second phone number
- ❌ You do **NOT** need a separate SIM card
- ❌ You do **NOT** need a virtual phone number service
- ✅ You **DO** use your existing WhatsApp account
- ✅ The bridge appears as a "Linked Device" in WhatsApp (like WhatsApp Web or Desktop)

**How WhatsApp Linking Works:**
1. WhatsApp allows you to link multiple devices to one account
2. When you scan the QR code, you're linking the bridge as a new device
3. The bridge receives and sends messages on behalf of your WhatsApp account
4. Your phone stays the primary device
5. All messages sync across all linked devices

**What appears in WhatsApp:**
- Messages sent by the bridge will appear to come from you
- The bridge uses your WhatsApp account's identity
- Messages will show in your chat history on your phone too

### Message Flow

```
Nextcloud Talk              Bridge Server              WhatsApp
     │                            │                         │
     │  1. Alice: "Hello!"        │                         │
     ├───────────────────────────>│                         │
     │                            │  2. [Nextcloud] Alice:  │
     │                            │     "Hello!"            │
     │                            ├────────────────────────>│
     │                            │                         │
     │                            │  3. Bob: "Hi there!"    │
     │                            │<────────────────────────┤
     │  4. [WhatsApp] Bob:        │                         │
     │     "Hi there!"            │                         │
     │<───────────────────────────┤                         │
```

## Installation Steps

### Step 1: Clone the Repository

```bash
# Navigate to where you want to install the bridge
cd /opt  # or ~/apps or anywhere you prefer

# Clone the repository
git clone https://github.com/QuizzityMC/Whatsapp-Nextcloud-Bridge.git
cd Whatsapp-Nextcloud-Bridge
```

### Step 2: Install Dependencies

```bash
npm install
```

This will download all required packages, including the WhatsApp Web client libraries.

**Note**: If you encounter Chromium download errors, this is normal in some environments. The bridge will work fine.

### Step 3: Verify Installation (Optional but Recommended)

The repository includes a verification script to check your setup:

```bash
chmod +x verify.sh
./verify.sh
```

This checks that all dependencies are correctly installed.

## Configuration Guide

### Step 1: Create Your Configuration File

```bash
cp .env.example .env
nano .env  # or use vim, code, or any text editor
```

### Step 2: Get Your Nextcloud Information

#### A. Nextcloud URL
Your Nextcloud URL is simply the address you use to access Nextcloud:
```
NEXTCLOUD_URL=https://cloud.example.com
```
**Include `https://` but don't include any path like `/index.php`**

#### B. Nextcloud Username and Password
```
NEXTCLOUD_USERNAME=your-username
NEXTCLOUD_PASSWORD=your-password
```

**Security Tip**: Use an app password instead of your main password:
1. Log into Nextcloud
2. Go to Settings → Security
3. Scroll to "Devices & sessions"
4. Create a new app password
5. Name it "WhatsApp Bridge"
6. Use this password in your configuration

#### C. Nextcloud Talk Token

The Talk token identifies which conversation to bridge.

**How to find it:**
1. Open Nextcloud Talk in your browser
2. Navigate to the conversation you want to bridge
3. Look at the URL in your browser's address bar
4. The token is the part after `/call/`

Example URL:
```
https://cloud.example.com/call/x7k9m2p5
                               ^^^^^^^^
                               This is your token
```

Copy the token to your `.env` file:
```
NEXTCLOUD_TALK_TOKEN=x7k9m2p5
```

### Step 3: Configure WhatsApp Chat ID

The WhatsApp Chat ID identifies which WhatsApp chat to bridge.

**For now, use a placeholder:**
```
WHATSAPP_CHAT_ID=placeholder@c.us
```

We'll get the real chat ID in the next section when we first run the bridge.

### Step 4: Customize Message Prefixes (Optional)

You can customize how messages are labeled:

```
NC_TO_WA_PREFIX=[Nextcloud]     # Messages from Nextcloud to WhatsApp
WA_TO_NC_PREFIX=[WhatsApp]      # Messages from WhatsApp to Nextcloud
```

**Creative alternatives:**
```
NC_TO_WA_PREFIX=💬
WA_TO_NC_PREFIX=📱
```

Or remove prefixes entirely:
```
NC_TO_WA_PREFIX=
WA_TO_NC_PREFIX=
```

### Complete Example Configuration

Your `.env` file should look like this:

```env
# Nextcloud Configuration
NEXTCLOUD_URL=https://cloud.example.com
NEXTCLOUD_USERNAME=johndoe
NEXTCLOUD_PASSWORD=your-app-password-here
NEXTCLOUD_TALK_TOKEN=x7k9m2p5

# WhatsApp Configuration
WHATSAPP_CHAT_ID=placeholder@c.us

# Bridge Configuration (optional)
NC_TO_WA_PREFIX=[Nextcloud]
WA_TO_NC_PREFIX=[WhatsApp]

# Session directory (optional)
SESSION_DIR=./session

# Logging (optional)
LOG_LEVEL=INFO
```

## First Time Setup

### Step 1: Start the Bridge

```bash
npm start
```

You'll see output like:
```
[Main] Starting WhatsApp-Nextcloud Bridge...
[WhatsApp] Initializing WhatsApp client...
[Nextcloud] Initializing Nextcloud client...
[Nextcloud] Successfully connected to Nextcloud Talk
```

### Step 2: Link Your WhatsApp Account (No Separate Number Needed!)

After a few seconds, a QR code will appear in your terminal:

```
[WhatsApp] Scan this QR code with WhatsApp to authenticate:
█████████████████████████████
█████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▀▄ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▄▄ █   █ ████
...
```

**On your phone:**
1. Open WhatsApp
2. Tap the three dots (⋮) or Settings
3. Select **"Linked Devices"**
4. Tap **"Link a Device"**
5. Your camera will open
6. **Scan the QR code** displayed in your terminal

**What happens:**
- WhatsApp will link the bridge as a new device
- The bridge appears in your Linked Devices list as "WhatsApp Web"
- You'll see a confirmation message in the terminal

```
[WhatsApp] WhatsApp authenticated successfully
[WhatsApp] WhatsApp client is ready!
```

### Step 3: Get Your WhatsApp Chat ID

Now we need to find the Chat ID for the conversation you want to bridge.

**Enable debug logging:**
1. Stop the bridge (press Ctrl+C)
2. Edit `.env` and change:
   ```
   LOG_LEVEL=DEBUG
   ```
3. Start the bridge again:
   ```bash
   npm start
   ```

**Send a test message:**
1. Open WhatsApp on your phone
2. Go to the chat you want to bridge (could be a group or individual chat)
3. Send any message (like "test")
4. Look at the bridge terminal output

You'll see something like:
```
[WhatsApp] Message received from: 1234567890@c.us
[WhatsApp] Message received from: 123456789123@g.us  # for groups
```

**Copy the Chat ID:**
- For individual chats: `1234567890@c.us`
- For group chats: `123456789123@g.us`

**Update your configuration:**
1. Stop the bridge (Ctrl+C)
2. Edit `.env`:
   ```
   WHATSAPP_CHAT_ID=1234567890@c.us  # Use your actual chat ID
   LOG_LEVEL=INFO  # Optional: change back to INFO
   ```
3. Save the file

### Step 4: Start the Bridge (Final)

```bash
npm start
```

The bridge is now fully configured and running! You should see:

```
[Main] Starting WhatsApp-Nextcloud Bridge...
[WhatsApp] WhatsApp client is ready!
[Nextcloud] Successfully connected to Nextcloud Talk
[Bridge] Message bridge is now active
[Main] Bridge started successfully!
[Main] Press Ctrl+C to stop
```

## Verifying the Setup

### Test Message Flow

#### Test 1: Nextcloud → WhatsApp

1. Open Nextcloud Talk in your browser
2. Navigate to the bridged conversation
3. Send a message: "Hello from Nextcloud!"
4. Check WhatsApp on your phone
5. You should see: `[Nextcloud] YourName: Hello from Nextcloud!`

#### Test 2: WhatsApp → Nextcloud

1. Open WhatsApp on your phone
2. Go to the bridged chat
3. Send a message: "Hello from WhatsApp!"
4. Check Nextcloud Talk in your browser
5. You should see: `[WhatsApp] ContactName: Hello from WhatsApp!`

### How Messages Appear

**In WhatsApp:**
- Messages appear to come from your account (because the bridge uses your WhatsApp)
- Messages sent from Nextcloud will show with your name
- The prefix helps distinguish the source

**In Nextcloud Talk:**
- Messages show with the WhatsApp contact's name
- The prefix shows they came from WhatsApp

### Common Issues During Testing

**Messages not appearing in WhatsApp:**
- Verify `WHATSAPP_CHAT_ID` is correct
- Check bridge logs for errors
- Ensure WhatsApp is still linked (check Linked Devices)

**Messages not appearing in Nextcloud:**
- Verify `NEXTCLOUD_TALK_TOKEN` is correct
- Check that your Nextcloud user has access to the conversation
- Ensure Nextcloud is accessible from your server

**No QR code appears:**
- Make sure your terminal supports QR code display
- Try viewing logs if running in Docker: `docker logs -f container-name`

## Advanced Topics

### Running as a Service

The bridge should run continuously. See:
- [Systemd Installation Guide](../../systemd/INSTALL.md) for Linux
- [Docker Deployment](#docker-deployment) for containerized setup

### Docker Deployment

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  whatsapp-bridge:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
      - whatsapp-session:/app/session
    env_file: .env
    command: sh -c "npm install && npm start"
    restart: unless-stopped

volumes:
  whatsapp-session:
```

Run with:
```bash
docker-compose up -d
docker-compose logs -f  # View the QR code and logs
```

### Bridging Multiple Chats

To bridge multiple WhatsApp chats to different Nextcloud conversations:

1. Clone or copy the bridge directory for each chat pair
2. Configure each with different `.env` files
3. Run each instance separately (use different `SESSION_DIR` for each)

Example:
```bash
# First bridge
cd /opt/whatsapp-bridge-1
# Configure .env for first chat pair
npm start

# Second bridge
cd /opt/whatsapp-bridge-2
# Configure .env for second chat pair
npm start
```

### Security Best Practices

1. **Use App Passwords**: Never use your main Nextcloud password
2. **Secure the `.env` file**:
   ```bash
   chmod 600 .env
   ```
3. **Protect session data**:
   ```bash
   chmod 700 session/
   ```
4. **Use HTTPS**: Always use HTTPS for your Nextcloud instance
5. **Firewall**: Ensure your server has proper firewall rules
6. **Updates**: Keep the bridge and dependencies updated

### Customizing the Bridge

#### Change polling interval

By default, the bridge polls Nextcloud for new messages every 5 seconds. To reduce server load, you can increase this interval.

Edit `src/nextcloud-client.js` and find the `startPolling` call (around line 107):

```javascript
// Change from default 5000ms to 10000ms (10 seconds)
startPolling(10000)  // Poll every 10 seconds instead of 5
```

Or modify where it's called in `src/message-bridge.js` (line 26):

```javascript
// Start polling Nextcloud messages every 10 seconds
this.nextcloudClient.startPolling(10000);
```

#### Modify message format

Edit `src/message-bridge.js` to customize how messages are formatted:
```javascript
// Example: Add timestamps
const formattedMessage = `${this.config.waToNcPrefix} **${sender}** (${new Date().toLocaleTimeString()}): ${messageText}`;
```

### Monitoring and Logs

**View logs in real-time:**
```bash
npm start  # Logs appear in the console
```

**With systemd:**
```bash
sudo journalctl -u whatsapp-nextcloud-bridge -f
```

**With Docker:**
```bash
docker logs -f whatsapp-bridge
```

**Debug mode for troubleshooting:**
```bash
LOG_LEVEL=DEBUG npm start
```

## Frequently Asked Questions

### Do I need a separate phone number?

**No!** The bridge uses WhatsApp Web technology, which allows you to link multiple devices to one WhatsApp account. You only need your existing WhatsApp number.

### Will this log me out of WhatsApp Web?

No. WhatsApp allows multiple linked devices. The bridge is just another linked device alongside your WhatsApp Web sessions.

### Can I use this with WhatsApp Business?

Yes! The setup is identical. Just use your WhatsApp Business account when scanning the QR code.

### What happens if my phone is offline?

WhatsApp's multi-device feature allows linked devices to work even when your phone is offline. However, your phone must have an internet connection at least once every 14 days to keep devices linked.

### Can others see who sent the original message?

Yes! The bridge includes the sender's name in the forwarded message:
- From WhatsApp: `[WhatsApp] **John**: Hello`
- From Nextcloud: `[Nextcloud] *Alice*: Hi`

### Will the bridge forward images and files?

Currently, only text messages are supported. Media support is planned for future versions.

### Can I bridge multiple chats?

Yes! Run multiple instances of the bridge with different configurations. See [Bridging Multiple Chats](#bridging-multiple-chats).

### How do I unlink the bridge?

1. Stop the bridge (Ctrl+C or stop the service)
2. On your phone, go to WhatsApp → Linked Devices
3. Find the bridge device and tap "Log Out"
4. Optionally, delete the session folder: `rm -rf session/`

### Is this official WhatsApp/Nextcloud software?

No, this is an independent open-source project. It's not affiliated with or endorsed by WhatsApp or Nextcloud.

## Troubleshooting

For detailed troubleshooting, see the [Troubleshooting Guide](TROUBLESHOOTING.md).

**Quick fixes:**

- **QR code not showing**: Check you're in a terminal that supports QR codes, or view Docker/systemd logs
- **Authentication failed**: Delete `session/` folder and scan QR code again
- **Messages not forwarding**: Verify chat IDs and tokens in `.env`, check logs for errors
- **Bridge disconnects**: Check internet connection, verify WhatsApp is still linked in Linked Devices

## Getting Help

If you need help:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review the [Message Flow Examples](MESSAGE_FLOW.md)
3. Enable debug logging: `LOG_LEVEL=DEBUG`
4. Check [GitHub Issues](https://github.com/QuizzityMC/Whatsapp-Nextcloud-Bridge/issues)
5. Open a new issue with your logs (remove sensitive info first)

## Next Steps

Now that your bridge is set up:

- ✅ Consider running it as a system service for automatic startup
- ✅ Set up monitoring to ensure it stays running
- ✅ Join the community to share tips and improvements
- ✅ Star the repository if you find it useful!

---

**Congratulations!** Your WhatsApp-Nextcloud Bridge is now running. Messages will flow seamlessly between WhatsApp and Nextcloud Talk without needing any separate phone number!
