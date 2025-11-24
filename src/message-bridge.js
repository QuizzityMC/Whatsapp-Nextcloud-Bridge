import { createLogger } from './utils/logger.js';

class MessageBridge {
  constructor(whatsappClient, nextcloudClient, config) {
    this.logger = createLogger('Bridge');
    this.whatsappClient = whatsappClient;
    this.nextcloudClient = nextcloudClient;
    this.config = config;
    this.isRunning = false;
  }

  async start() {
    this.logger.info('Starting message bridge...');
    
    // Set up WhatsApp message handler
    this.whatsappClient.onMessage(async (message) => {
      await this.handleWhatsAppMessage(message);
    });

    // Set up Nextcloud message handler
    this.nextcloudClient.onMessage(async (message) => {
      await this.handleNextcloudMessage(message);
    });

    // Start polling Nextcloud messages
    this.nextcloudClient.startPolling();

    this.isRunning = true;
    this.logger.info('Message bridge is now active');
  }

  async handleWhatsAppMessage(message) {
    try {
      // Only process messages from the configured chat
      if (message.from !== this.config.whatsappChatId) {
        return;
      }

      // Get sender name from message contact or fallback to phone number
      let sender = message.from;
      try {
        const contact = await message.getContact();
        sender = contact.pushname || contact.name || message.from;
      } catch (error) {
        this.logger.debug('Could not get contact name, using phone number');
      }

      const messageText = message.body;

      // Skip empty messages
      if (!messageText || messageText.trim() === '') {
        return;
      }

      this.logger.info(`WhatsApp → Nextcloud: ${sender}: ${messageText}`);

      // Format message for Nextcloud
      const formattedMessage = `${this.config.waToNcPrefix} **${sender}**: ${messageText}`;

      // Send to Nextcloud
      await this.nextcloudClient.sendMessage(formattedMessage);
    } catch (error) {
      this.logger.error('Error handling WhatsApp message:', error);
    }
  }

  async handleNextcloudMessage(message) {
    try {
      const sender = message.actorDisplayName || message.actorId;
      const messageText = message.message;

      // Skip empty messages
      if (!messageText || messageText.trim() === '') {
        return;
      }

      // Skip system messages
      if (message.systemMessage) {
        return;
      }

      this.logger.info(`Nextcloud → WhatsApp: ${sender}: ${messageText}`);

      // Format message for WhatsApp
      const formattedMessage = `${this.config.ncToWaPrefix} *${sender}*: ${messageText}`;

      // Send to WhatsApp
      await this.whatsappClient.sendMessage(this.config.whatsappChatId, formattedMessage);
    } catch (error) {
      this.logger.error('Error handling Nextcloud message:', error);
    }
  }

  async stop() {
    this.logger.info('Stopping message bridge...');
    this.nextcloudClient.stopPolling();
    this.isRunning = false;
    this.logger.info('Message bridge stopped');
  }
}

export default MessageBridge;
