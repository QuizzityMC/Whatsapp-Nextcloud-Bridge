# Troubleshooting Guide

This guide helps you solve common issues with the WhatsApp-Nextcloud Bridge.

## Installation Issues

### "npm install" fails with Chromium download error

**Problem:** Chromium download is blocked or fails.

**Solution:** Use the skip flag:
```bash
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

**Note:** The bridge will use the system's Chromium in production (Docker/systemd).

### Missing dependencies error

**Problem:** Error about missing node modules.

**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Authentication Issues

### QR code not appearing

**Problem:** No QR code shown in the terminal.

**Solutions:**
1. Make sure you're running in a terminal that supports QR codes
2. Check logs: `docker logs -f container-name` (for Docker)
3. Check logs: `sudo journalctl -u whatsapp-nextcloud-bridge -f` (for systemd)

### "WhatsApp client initialization timeout"

**Problem:** Client fails to initialize within 60 seconds.

**Solutions:**
1. Check your internet connection
2. Remove session data and try again:
   ```bash
   rm -rf session/
   npm start
   ```
3. Check if WhatsApp Web is accessible from your server

### Session expired or logged out

**Problem:** Bridge stops working and requires re-authentication.

**Solution:** Remove session and re-authenticate:
```bash
# Stop the bridge
rm -rf session/
npm start
# Scan the QR code again
```

## Message Forwarding Issues

### Messages not being forwarded from Nextcloud

**Problem:** Nextcloud messages don't appear in WhatsApp.

**Checklist:**
- [ ] Verify NEXTCLOUD_TALK_TOKEN is correct
- [ ] Check Nextcloud user has access to the conversation
- [ ] Ensure WHATSAPP_CHAT_ID is correct
- [ ] Check logs for errors
- [ ] Verify Nextcloud instance is accessible from the server

**Test connection:**
```bash
curl -u USERNAME:PASSWORD https://your-nextcloud.com/ocs/v2.php/apps/spreed/api/v1/room
```

### Messages not being forwarded from WhatsApp

**Problem:** WhatsApp messages don't appear in Nextcloud.

**Checklist:**
- [ ] Verify WhatsApp is authenticated (check logs)
- [ ] Ensure WHATSAPP_CHAT_ID matches the chat sending messages
- [ ] Check that messages are coming from the correct chat
- [ ] Verify internet connection

**Get chat ID:**
Enable debug logging:
```bash
LOG_LEVEL=DEBUG npm start
```
Send a message in any WhatsApp chat and check the logs for the chat ID.

### Getting chat IDs

**Individual chat:**
Format: `[country_code][phone_number]@c.us`
Example: `1234567890@c.us`

**Group chat:**
1. Start the bridge with DEBUG logging:
   ```bash
   LOG_LEVEL=DEBUG npm start
   ```
2. Send a message in the group
3. Check logs for the chat ID (format: `XXXXX@g.us`)

## Connection Issues

### "Failed to connect to Nextcloud"

**Problem:** Cannot connect to Nextcloud instance.

**Solutions:**
1. Verify NEXTCLOUD_URL is correct (include https://)
2. Check if Nextcloud is accessible:
   ```bash
   curl https://your-nextcloud.com
   ```
3. Verify credentials are correct
4. Check firewall rules
5. Try using an app password instead of main password

### Network timeouts

**Problem:** Frequent timeout errors in logs.

**Solutions:**
1. Check network stability
2. Increase timeout in `src/nextcloud-client.js` if needed
3. Verify server has stable internet connection

## Docker Issues

### Container keeps restarting

**Problem:** Docker container restarts repeatedly.

**Check logs:**
```bash
docker logs whatsapp-nextcloud-bridge
```

**Common causes:**
- Missing or incorrect .env file
- Permission issues with session directory
- Node.js errors (check logs)

### Volume permission issues

**Problem:** Cannot write to session directory.

**Solution:**
```bash
# Fix permissions
sudo chown -R 1000:1000 ./session
```

Or in docker-compose.yml, add:
```yaml
user: "1000:1000"
```

## Systemd Issues

### Service fails to start

**Check status:**
```bash
sudo systemctl status whatsapp-nextcloud-bridge
```

**Check logs:**
```bash
sudo journalctl -u whatsapp-nextcloud-bridge -n 50
```

**Common issues:**
- Incorrect file paths in service file
- Permission issues
- Missing .env file

### Permission denied errors

**Solution:**
```bash
sudo chown -R whatsapp-bridge:whatsapp-bridge /opt/whatsapp-nextcloud-bridge
sudo chmod 600 /opt/whatsapp-nextcloud-bridge/.env
```

## Performance Issues

### High CPU usage

**Possible causes:**
1. Too frequent polling (default is 5 seconds)
2. Large number of messages

**Solution:** Increase polling interval in `src/index.js`:
```javascript
// Change from 5000 to 10000 (10 seconds)
nextcloudClient.startPolling(10000);
```

### High memory usage

**Normal:** WhatsApp client (Puppeteer) uses 100-300MB RAM
**High:** Above 500MB might indicate a memory leak

**Solution:**
1. Restart the bridge
2. Update to latest version
3. Report the issue on GitHub

## Debug Mode

Enable detailed logging:

```bash
LOG_LEVEL=DEBUG npm start
```

This shows:
- All message processing
- API calls
- Connection details
- Errors with full stack traces

## Getting Help

If none of these solutions work:

1. Check the [GitHub Issues](https://github.com/QuizzityMC/Whatsapp-Nextcloud-Bridge/issues)
2. Enable DEBUG logging and capture the output
3. Open a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Debug logs (remove sensitive info)
   - Your environment (OS, Node version, etc.)

## Useful Commands

**Check Node.js version:**
```bash
node -v
```

**Check npm version:**
```bash
npm -v
```

**Test Nextcloud API:**
```bash
curl -u USERNAME:PASSWORD \
  -H "OCS-APIRequest: true" \
  "https://your-nextcloud.com/ocs/v2.php/apps/spreed/api/v1/room"
```

**View logs in real-time (systemd):**
```bash
sudo journalctl -u whatsapp-nextcloud-bridge -f
```

**View logs in real-time (Docker):**
```bash
docker logs -f whatsapp-nextcloud-bridge
```
