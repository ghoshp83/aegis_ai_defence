# Contributing to AEGIS

Thank you for your interest in contributing to AEGIS! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/aegis-ai-defence/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it would be valuable

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Ensure all tests pass: `npm test`
6. Commit with clear messages: `git commit -m 'Add amazing feature'`
7. Push to your fork: `git push origin feature/amazing-feature`
8. Open a Pull Request

## Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-ai-defence.git
cd aegis-ai-defence

# 3. Install dependencies
npm install

# 4. Set up environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 5. Run development server
npm run dev

# 6. Run tests
npm test
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Write meaningful variable names

## Testing

- Write unit tests for new features
- Ensure existing tests pass
- Aim for >80% code coverage

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

Example: `feat: add Go CLI auditor`

## Questions?

Feel free to open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
