# Replit Protection Templates for PROGGER

This folder contains guidance documents to help you safely develop and deploy the PROGGER project on Replit.

## 📁 Files

### `replit-ai-rules.md`
**For AI Assistants (Cursor, Copilot, etc.)**

Copy this file's content into your AI coding assistant's "Rules for AI" settings. It provides:
- Concise DO/DON'T lists
- Critical file protection rules
- Quick reference checklists
- Project-specific configurations

**How to use:**
1. Open `replit-ai-rules.md`
2. Copy the entire content
3. Paste into Cursor → Settings → "Rules for AI" (or equivalent for your editor)

### `replit-developer-guide.md`
**For Human Developers**

A comprehensive guide explaining:
- Why rules exist and how they protect your deployment
- Detailed troubleshooting procedures
- Authentication setup and debugging
- Recovery procedures if something breaks
- Architecture details and best practices

**How to use:**
Read this guide before making infrastructure changes or when troubleshooting deployment issues.

## 🎯 Quick Start

1. **For AI-assisted development:** Copy `replit-ai-rules.md` into your AI assistant
2. **For reference:** Keep `replit-developer-guide.md` open when working on config files
3. **Before committing:** Check the Quick Reference Card in the developer guide

## 🚨 Most Important Rules

1. **Never modify:** `.replit`, `replit.nix`, or workflow configurations
2. **Never change:** Database primary key ID types
3. **Use commands, not manual edits:** `npm install` for packages, `npm run db:push --force` for migrations
4. **Test in Replit first:** Always verify changes work in Replit before committing

## 📞 If Something Breaks

See the **Recovery Procedures** section in `replit-developer-guide.md` for step-by-step instructions.

---

**Project:** PROGGER - AI-Powered Chord Progression Generator for Guitarists  
**Last Updated:** October 30, 2025
