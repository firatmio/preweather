# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

### 1. GitHub Security Advisories (Preferred)

Report a vulnerability through [GitHub Security Advisories](https://github.com/firatmio/preweather/security/advisories/new).

### 2. Email

Send an email to: **your-email@example.com**

Please include:
- Type of issue (e.g., buffer overflow, SQL injection, XSS)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (Critical: 24-48h, High: 7 days, Medium: 30 days)

## Security Measures

### Current Implementation

- ✅ **HTTPS Enforcement**: All traffic encrypted
- ✅ **Security Headers**: X-Frame-Options, CSP, etc.
- ✅ **Input Validation**: All user inputs validated
- ✅ **API Rate Limiting**: Prevents abuse
- ✅ **CORS Configuration**: Properly configured
- ✅ **Dependency Scanning**: Regular updates
- ✅ **Environment Variables**: Sensitive data protected

### Best Practices

1. **API Keys**: Never commit API keys to repository
2. **Environment Variables**: Use `.env.local` for secrets
3. **HTTPS Only**: No plain HTTP in production
4. **Regular Updates**: Keep dependencies up to date
5. **Code Review**: All PRs reviewed before merge

## Vulnerability Disclosure Policy

We follow a responsible disclosure policy:

1. **Report**: Submit vulnerability through secure channel
2. **Acknowledge**: We acknowledge receipt within 48 hours
3. **Investigate**: We investigate and validate the issue
4. **Fix**: We develop and test a fix
5. **Release**: We release the fix in a new version
6. **Disclose**: After 90 days or when fixed (whichever is sooner)

## Hall of Fame

We thank the following security researchers for responsibly disclosing vulnerabilities:

<!-- This section will be updated as reports come in -->
- *No reports yet*

## Security Updates

Security updates will be announced through:

- GitHub Security Advisories
- Release notes
- CHANGELOG.md

## Contact

For any security-related questions, please contact:
- **Email**: your-email@example.com
- **GitHub**: [@firatmio](https://github.com/firatmio)

---

**Last Updated**: October 5, 2025
