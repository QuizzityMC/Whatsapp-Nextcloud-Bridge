# Systemd Installation Guide

This guide shows you how to run the WhatsApp-Nextcloud Bridge as a systemd service on Linux.

## Prerequisites

- Linux system with systemd
- Node.js 18 or higher installed
- Root or sudo access

## Installation Steps

### 1. Create a System User

Create a dedicated user for the bridge:

```bash
sudo useradd -r -s /bin/false whatsapp-bridge
```

### 2. Install the Bridge

Clone and install the bridge:

```bash
sudo mkdir -p /opt/whatsapp-nextcloud-bridge
sudo git clone https://github.com/QuizzityMC/Whatsapp-Nextcloud-Bridge.git /opt/whatsapp-nextcloud-bridge
cd /opt/whatsapp-nextcloud-bridge
sudo npm install --production
```

### 3. Configure the Bridge

Create the configuration file:

```bash
sudo cp .env.example .env
sudo nano /opt/whatsapp-nextcloud-bridge/.env
```

Fill in your configuration values.

### 4. Set Permissions

```bash
sudo chown -R whatsapp-bridge:whatsapp-bridge /opt/whatsapp-nextcloud-bridge
sudo chmod 600 /opt/whatsapp-nextcloud-bridge/.env
```

### 5. Install Systemd Service

```bash
sudo cp systemd/whatsapp-nextcloud-bridge.service /etc/systemd/system/
sudo systemctl daemon-reload
```

### 6. Start the Service

```bash
sudo systemctl start whatsapp-nextcloud-bridge
```

### 7. Authenticate WhatsApp

On first run, you need to scan the QR code:

```bash
sudo journalctl -u whatsapp-nextcloud-bridge -f
```

Wait for the QR code to appear in the logs, then scan it with WhatsApp.

### 8. Enable Auto-Start

Once authenticated and working, enable the service to start on boot:

```bash
sudo systemctl enable whatsapp-nextcloud-bridge
```

## Managing the Service

### Check Status

```bash
sudo systemctl status whatsapp-nextcloud-bridge
```

### View Logs

```bash
sudo journalctl -u whatsapp-nextcloud-bridge -f
```

### Restart Service

```bash
sudo systemctl restart whatsapp-nextcloud-bridge
```

### Stop Service

```bash
sudo systemctl stop whatsapp-nextcloud-bridge
```

### Update the Bridge

```bash
sudo systemctl stop whatsapp-nextcloud-bridge
cd /opt/whatsapp-nextcloud-bridge
sudo git pull
sudo npm install --production
sudo systemctl start whatsapp-nextcloud-bridge
```

## Troubleshooting

### Service Won't Start

Check the logs:
```bash
sudo journalctl -u whatsapp-nextcloud-bridge -n 50
```

### Permission Issues

Ensure the service user owns the files:
```bash
sudo chown -R whatsapp-bridge:whatsapp-bridge /opt/whatsapp-nextcloud-bridge
```

### WhatsApp Authentication Issues

Remove the session and re-authenticate:
```bash
sudo systemctl stop whatsapp-nextcloud-bridge
sudo rm -rf /opt/whatsapp-nextcloud-bridge/session
sudo systemctl start whatsapp-nextcloud-bridge
sudo journalctl -u whatsapp-nextcloud-bridge -f
```

Then scan the QR code again.
