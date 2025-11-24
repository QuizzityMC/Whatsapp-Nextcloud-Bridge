#!/bin/bash

echo "======================================"
echo "WhatsApp-Nextcloud Bridge Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy example file
cp .env.example .env
echo "✓ Created .env file from template"
echo ""

# Prompt for configuration
echo "Please provide the following information:"
echo ""

read -p "Nextcloud URL (e.g., https://cloud.example.com): " NEXTCLOUD_URL
read -p "Nextcloud Username: " NEXTCLOUD_USERNAME
echo "⚠️  For better security, use a Nextcloud App Password instead of your main password."
echo "   You can create one at: Settings → Security → Devices & sessions"
read -sp "Nextcloud Password (or App Password): " NEXTCLOUD_PASSWORD
echo ""
read -p "Nextcloud Talk Token (from conversation URL): " NEXTCLOUD_TALK_TOKEN
read -p "WhatsApp Chat ID (e.g., 1234567890@c.us): " WHATSAPP_CHAT_ID

# Update .env file
sed -i "s|NEXTCLOUD_URL=.*|NEXTCLOUD_URL=$NEXTCLOUD_URL|" .env
sed -i "s|NEXTCLOUD_USERNAME=.*|NEXTCLOUD_USERNAME=$NEXTCLOUD_USERNAME|" .env
sed -i "s|NEXTCLOUD_PASSWORD=.*|NEXTCLOUD_PASSWORD=$NEXTCLOUD_PASSWORD|" .env
sed -i "s|NEXTCLOUD_TALK_TOKEN=.*|NEXTCLOUD_TALK_TOKEN=$NEXTCLOUD_TALK_TOKEN|" .env
sed -i "s|WHATSAPP_CHAT_ID=.*|WHATSAPP_CHAT_ID=$WHATSAPP_CHAT_ID|" .env

echo ""
echo "✓ Configuration saved to .env"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To start the bridge, run:"
echo "  npm start"
echo ""
echo "On first run, scan the QR code with WhatsApp."
echo "After that, the bridge will run automatically."
echo ""
