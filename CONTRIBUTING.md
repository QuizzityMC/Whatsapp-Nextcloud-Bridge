# Contributing to WhatsApp-Nextcloud Bridge

Thank you for your interest in contributing to the WhatsApp-Nextcloud Bridge project! This document provides guidelines for contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)
- Relevant logs (remove sensitive information)

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork
7. Open a pull request

### Code Style

- Use ES6+ features and modules
- Follow existing code formatting
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Testing

Before submitting a PR:
- Test your changes locally
- Ensure no syntax errors (`node --check <file>`)
- Verify the application runs without errors
- Test with actual WhatsApp and Nextcloud instances if possible

### Security

- Never commit credentials or sensitive data
- Use environment variables for configuration
- Report security vulnerabilities privately
- Follow secure coding practices

## Development Setup

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run `npm start` to start the bridge

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

Feel free to open an issue for questions or clarifications.

Thank you for contributing!
