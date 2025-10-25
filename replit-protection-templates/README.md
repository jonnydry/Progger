# Replit Protection Templates for Chord & Scale Generator

A collection of security-focused templates and configurations to protect the Chord & Scale Generator Replit project from unauthorized access, code theft, and malicious activities.

## 📋 Project Overview

This directory contains ready-to-use templates and best practices for securing the Chord & Scale Generator Replit application. These templates help protect the project from common issues that can occur when using external development environments like Cursor.

## ✨ Key Features

- **Critical File Protection** - Prevents modification of `.replit`, `replit.nix`, and other infrastructure files
- **Package Management Safety** - Guidelines for proper npm dependency management
- **Database Schema Protection** - Prevents catastrophic database changes with Drizzle ORM
- **Port Configuration Safety** - Ensures proper Replit port binding (uses port 5000)
- **Environment Variable Security** - Guidelines for handling secrets via Replit Secrets (XAI_API_KEY, DATABASE_URL)
- **Path Alias Protection** - Prevents breaking Vite path aliases (@, @shared, @assets)
- **Build Configuration Safety** - Protects Vite and TypeScript configurations
- **Recovery Procedures** - Step-by-step recovery if external editors break the project

## 🚀 Setup Instructions

### Prerequisites

- Active Replit account with Chord & Scale Generator project
- Basic understanding of the tech stack (React, Express, Drizzle, xAI Grok API)
- Familiarity with environment variables

### Installation

1. **Templates are already in project**
   - Templates are located in `replit-protection-templates/` directory
   - No additional setup required

2. **Configure Environment Variables**
   - Navigate to the "Secrets" tab in your Replit project
   - Add required environment variables:
     - `XAI_API_KEY` - xAI Grok API key for chord generation
     - `SESSION_SECRET` - Auto-provided by Replit
     - `DATABASE_URL` - Auto-provided by Replit
   - Never commit sensitive credentials to your code

3. **Use the Templates**
   - Copy `cursor-replit-protection-template.md` content to Cursor → Settings → "Rules for AI"
   - Share `replit-production-guide.md` with team members
   - Follow the guidelines when making changes to the app

4. **Test in Replit**
   - Always test changes in Replit before committing
   - Verify the application runs correctly
   - Check for any deployment issues

## 💡 Usage Examples

### Using the Cursor Protection Template

1. **Copy the template to Cursor:**
   - Open `cursor-replit-protection-template.md`
   - Copy the entire content
   - Go to Cursor → Settings → "Rules for AI"
   - Paste the content and save

2. **Follow the guidelines:**
   - Never modify `.replit` or `replit.nix` files
   - Use `npm install` for package management
   - Modify database schema in `shared/schema.ts` only
   - Always test changes in Replit first

### Database Migration (Chord & Scale Generator)

```bash
# 1. Modify shared/schema.ts
# 2. Run migration command
npm run db:push --force
```

### Port Configuration (Chord & Scale Generator)

```javascript
// Frontend (Vite) uses port 5000
// Backend (Express) uses port 3001
const port = 3001;
server.listen(port, '0.0.0.0');
```

## 📁 Template Files

- `cursor-replit-protection-template.md` - Cursor IDE protection rules for Chord & Scale Generator
- `replit-production-guide.md` - Comprehensive guide for project protection
- `README.md` - This documentation file
- `LICENSE` - MIT license file

## 🔒 Security Best Practices

1. **Always use HTTPS** - Enable Replit's HTTPS for deployment
2. **Keep dependencies updated** - Regularly update npm packages to patch vulnerabilities
3. **Validate all inputs** - Never trust user-provided data in API endpoints
4. **Use Replit Auth** - Implement proper authentication with Replit Auth integration
5. **Protect API keys** - Store XAI_API_KEY in Replit Secrets, never in code
6. **Monitor and log** - Track access patterns and suspicious activities
7. **Protect critical files** - Never modify `.replit`, `replit.nix`, or build configs
8. **Test in Replit first** - Always verify changes work in Replit before committing

## 🤝 Contributing to Protection Templates

We welcome contributions to improve the protection templates! Here's how you can help:

- **Improve templates** - Enhance the protection rules and guidelines
- **Update documentation** - Help clarify setup instructions
- **Report issues** - Found a bug or security concern? Let us know
- **Suggest features** - Ideas for new protection patterns

### How to Contribute

1. Make your changes to the template files
2. Test the changes with the Chord & Scale Generator project
3. Commit with clear messages (`git commit -m 'Update protection template'`)
4. Push your changes (`git push origin your-branch`)
5. Create a Pull Request

Please ensure your contributions are specific to the project's tech stack and requirements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Replit community for security insights
- Contributors who help improve these templates
- Security researchers who share best practices

## 📞 Support

If you encounter issues or have questions about project protection:
- Check the `replit-production-guide.md` for detailed instructions
- Review the `cursor-replit-protection-template.md` for Cursor-specific rules
- Test changes in Replit before committing
- Follow the recovery procedures if something breaks

---

**⚠️ Disclaimer**: These templates provide baseline protection but should not be considered comprehensive security. Always conduct thorough security audits for production applications and stay informed about emerging security threats.
