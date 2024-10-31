# Security Policy

## Supported Versions
The following versions of Dynasty Defense System are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability
If you discover a security vulnerability, please report it responsibly. Do not publicly disclose the vulnerability until it has been addressed. To report an issue:

1. **Email**: Reach out at [aarch0004@launchpadphilly.org](mailto:aarch0004@launchpadphilly.org) with details of the vulnerability.
2. **Include**: 
   - A detailed description of the vulnerability
   - Steps to reproduce the issue
   - Any potential patches or recommendations

You will receive a response within 72 hours.

## Security Protocols
The following security measures have been implemented to protect Dynasty Defense System:

1. **User Authentication**: 
   - Enforced password complexity for all user accounts.
   - Session tokens are used for authenticated interactions, minimizing unauthorized access.

2. **Data Encryption**:
   - Passwords are hashed using bcrypt to ensure they are stored securely.
   - Sensitive data transmitted over the network uses HTTPS to prevent interception.

3. **Access Control**:
   - Role-based access control ensures that only admins have access to critical functions like user management and alarm silencing.
   - Default admin credentials are encrypted and can be reset in the `config` file for extra security.

4. **Error Handling**:
   - Sensitive error messages are not exposed to end-users, preventing potential attackers from gathering system details.
   - All detected errors are logged for admin review and troubleshooting.

5. **Security Audits**:
   - Regular security audits are conducted to identify and address vulnerabilities in the system.
   - Documentation on fixes and improvements from these audits is available in the changelog.

## Resources
For further information on best practices for securing similar applications:
- [OWASP Security Best Practices](https://owasp.org)
- [NIST Guidelines for Application Security](https://www.nist.gov)

---

Thank you for helping us keep Dynasty Defense System secure.
