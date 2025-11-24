import axios from 'axios';
import { createLogger } from './utils/logger.js';

class NextcloudClient {
  constructor(config) {
    this.logger = createLogger('Nextcloud');
    this.config = config;
    this.lastMessageId = 0;
    this.pollingInterval = null;
    this.messageHandlers = [];
    
    // Create axios instance with authentication
    this.api = axios.create({
      baseURL: `${config.url}/ocs/v2.php/apps/spreed/api/v1`,
      auth: {
        username: config.username,
        password: config.password
      },
      headers: {
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async initialize() {
    this.logger.info('Initializing Nextcloud client...');
    
    // Test connection
    try {
      const response = await this.api.get(`/chat/${this.config.talkToken}`);
      this.logger.info('Successfully connected to Nextcloud Talk');
      
      // Get the latest message ID to avoid processing old messages
      if (response.data.ocs.data && response.data.ocs.data.length > 0) {
        const messages = response.data.ocs.data;
        this.lastMessageId = Math.max(...messages.map(m => m.id));
        this.logger.debug(`Starting from message ID: ${this.lastMessageId}`);
      }
    } catch (error) {
      this.logger.error('Failed to connect to Nextcloud:', error.message);
      if (error.response) {
        this.logger.error('Response status:', error.response.status);
        this.logger.error('Response data:', error.response.data);
      }
      throw new Error('Failed to initialize Nextcloud client');
    }
  }

  async sendMessage(message) {
    try {
      await this.api.post(`/chat/${this.config.talkToken}`, {
        message: message
      });
      this.logger.debug('Message sent to Nextcloud');
    } catch (error) {
      this.logger.error('Failed to send message to Nextcloud:', error.message);
      throw error;
    }
  }

  async pollMessages() {
    try {
      const response = await this.api.get(`/chat/${this.config.talkToken}`, {
        params: {
          lookIntoFuture: 0,
          limit: 50,
          timeout: 30,
          setReadMarker: 0
        }
      });

      if (response.data.ocs.data && response.data.ocs.data.length > 0) {
        const messages = response.data.ocs.data;
        
        // Filter new messages (higher ID than last processed)
        const newMessages = messages.filter(m => m.id > this.lastMessageId);
        
        if (newMessages.length > 0) {
          // Update last message ID
          this.lastMessageId = Math.max(...messages.map(m => m.id));
          
          // Process new messages in order
          for (const message of newMessages.sort((a, b) => a.id - b.id)) {
            // Skip messages from ourselves
            if (message.actorId !== this.config.username) {
              for (const handler of this.messageHandlers) {
                try {
                  await handler(message);
                } catch (error) {
                  this.logger.error('Error in message handler:', error);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Don't log timeout or abort errors as they're expected during long polling
      if (error.code !== 'ECONNABORTED' && error.code !== 'ETIMEDOUT' && !error.message?.includes('timeout')) {
        this.logger.error('Error polling messages:', error.message);
      }
    }
  }

  startPolling(intervalMs = 5000) {
    this.logger.info('Starting message polling...');
    
    // Use recursive setTimeout to prevent overlapping requests
    const poll = async () => {
      await this.pollMessages();
      if (this.pollingInterval !== null) {
        this.pollingInterval = setTimeout(poll, intervalMs);
      }
    };
    
    // Start polling
    this.pollingInterval = setTimeout(poll, 0);
  }

  stopPolling() {
    if (this.pollingInterval) {
      this.logger.info('Stopping message polling...');
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
}

export default NextcloudClient;
