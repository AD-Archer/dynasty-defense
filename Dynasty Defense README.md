# Dynasty Defense System
[![Netlify Status](https://api.netlify.com/api/v1/badges/f552b9c8-ebd7-4a39-90dd-03a631d2253e/deploy-status)](https://app.netlify.com/sites/dynastydefense/deploys)
## Description
The **Dynasty Defense System** is a real-time alarm monitoring solution for enclosed spaces. It allows administrators to configure fire, smoke, and security sensors, monitor real-time events, and receive instant notifications via a user-friendly interface. The system ensures swift responses to potential emergencies through secure access and easy sensor management.

## Features
- **User Authentication**: Secure access with password protection.
- **Sensor Configuration**: Set up and manage fire, smoke, and heat sensors.
- **Real-Time Monitoring**: Track sensor status and events in real-time.
- **Alarm Notifications**: Receive instant alerts when a sensor is triggered.
- **Reset & Deactivation**: Easily reset or deactivate sensors to handle false alarms.
- **Admin Log**: All actions on site are logged for admins to review.
- **Multi-Admin Support**: The default admin can create additional admin accounts.

## Legal and Compliance Considerations
While the Dynasty Defense System prioritizes security and monitoring, users are responsible for complying with local laws regarding alarm systems, data privacy, and usage of security sensors. For example, privacy laws like GDPR may affect systems monitoring personal data, requiring adherence to regulations on data collection, storage, and user consent. 

Ensure your use of sensors and user data complies with local, state, and federal regulations.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ad-archer/defense-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd defense-system-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. **Register and Sign In**:
   - New users can register an account via the registration form. Once registered, sign in using the created credentials.
   - An admin account is created by default with the following credentials:
     - **Username**: `admin` (all lowercase)
     - **Password**: `password` (all lowercase)

2. **Admin Dashboard**:
   - Upon signing in, the dashboard allows users to configure and monitor sensors and manage system alarms.
   - Admin users have additional privileges to create new admin accounts, manage user roles, and silence active alarms.

3. **Sensor Activation**:
   - Users can activate a sensor to enable real-time monitoring. When a sensor detects an event (fire, smoke, or heat), it triggers an alarm.

4. **Handling Alarms**:
   - When an alarm is triggered, notifications appear on the dashboard, and admins can take action to resolve the situation.
   - Admins can silence or reset alarms to handle false positives or emergency scenarios.

5. **Error Handling**:
   - If an error is encountered, reset the local storage settings, which should resolve most issues.

## Changelog
All changes made to the system are logged in the `CHANGELOG.md` file, available in the repository. This document provides a record of updates, improvements, and bug fixes made throughout the project’s development.

## Security Documentation
For security practices, please refer to the `SECURITY.md` file in the repository. This document outlines the system's security protocols, including secure user authentication, access control, and steps to handle security vulnerabilities.

## Contributing
Feel free to submit issues or pull requests to help improve the system. All contributions are welcome!

## Additional Resources
For further insights on alarm systems and security best practices:
- [National Fire Protection Association (NFPA) Guidelines](https://www.nfpa.org)
- [General Data Protection Regulation (GDPR) Compliance](https://gdpr.eu)
- [MITRE ATT&CK Framework for Cybersecurity](https://attack.mitre.org/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
Created by [@ad-archer](https://github.com/ad-archer). For questions or collaboration, feel free to reach out.

--- 
