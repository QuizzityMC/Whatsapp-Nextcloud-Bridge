import dotenv from 'dotenv';
import WhatsAppClient from './whatsapp-client.js';
import NextcloudClient from './nextcloud-client.js';
import MessageBridge from './message-bridge.js';
import { createLogger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const logger = createLogger('Main');

// Validate required environment variables
const requiredEnvVars = [
  'NEXTCLOUD_URL',
  'NEXTCLOUD_USERNAME',
  'NEXTCLOUD_PASSWORD',
  'NEXTCLOUD_TALK_TOKEN',
  'WHATSAPP_CHAT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  logger.error('Please copy .env.example to .env and fill in your configuration');
  process.exit(1);
}

async function main() {
  try {
    logger.info('Starting WhatsApp-Nextcloud Bridge...');

    // Initialize clients
    const whatsappClient = new WhatsAppClient();
    const nextcloudClient = new NextcloudClient({
      url: process.env.NEXTCLOUD_URL,
      username: process.env.NEXTCLOUD_USERNAME,
      password: process.env.NEXTCLOUD_PASSWORD,
      talkToken: process.env.NEXTCLOUD_TALK_TOKEN
    });

    // Initialize bridge
    const bridge = new MessageBridge(whatsappClient, nextcloudClient, {
      whatsappChatId: process.env.WHATSAPP_CHAT_ID,
      ncToWaPrefix: process.env.NC_TO_WA_PREFIX || '[Nextcloud]',
      waToNcPrefix: process.env.WA_TO_NC_PREFIX || '[WhatsApp]'
    });

    // Start the clients
    await whatsappClient.initialize();
    await nextcloudClient.initialize();

    // Start bridging messages
    await bridge.start();

    logger.info('Bridge started successfully!');
    logger.info('Press Ctrl+C to stop');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down...');
      await bridge.stop();
      await whatsappClient.destroy();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start bridge:', error);
    process.exit(1);
  }
}

main();
