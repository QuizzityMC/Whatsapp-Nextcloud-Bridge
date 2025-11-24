import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { createLogger } from './utils/logger.js';
import path from 'path';

class WhatsAppClient {
  constructor() {
    this.logger = createLogger('WhatsApp');
    this.client = null;
    this.isReady = false;
    this.messageHandlers = [];
    
    const sessionDir = process.env.SESSION_DIR || './session';
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: path.resolve(sessionDir)
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      this.logger.info('Scan this QR code with WhatsApp to authenticate:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.info('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      this.logger.info('WhatsApp authenticated successfully');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('WhatsApp authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });

    this.client.on('message', async (message) => {
      // Call all registered message handlers
      for (const handler of this.messageHandlers) {
        try {
          await handler(message);
        } catch (error) {
          this.logger.error('Error in message handler:', error);
        }
      }
    });
  }

  async initialize() {
    this.logger.info('Initializing WhatsApp client...');
    await this.client.initialize();
    
    // Wait for client to be ready
    if (!this.isReady) {
      await new Promise((resolve) => {
        const checkReady = setInterval(() => {
          if (this.isReady) {
            clearInterval(checkReady);
            resolve();
          }
        }, 100);
      });
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  async sendMessage(chatId, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }
    
    try {
      await this.client.sendMessage(chatId, message);
      this.logger.debug(`Message sent to ${chatId}`);
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      throw error;
    }
  }

  async destroy() {
    this.logger.info('Destroying WhatsApp client...');
    await this.client.destroy();
  }
}

export default WhatsAppClient;
