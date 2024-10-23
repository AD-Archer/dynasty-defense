# Dynasty Defense System

## Description
The **Dynasty Defense System** is a real-time alarm monitoring solution for enclosed spaces. It allows administrators to configure fire, smoke, and security sensors, monitor real-time events, and receive instant notifications via a user-friendly interface. The system ensures swift responses to potential emergencies through secure access and easy sensor management.

## Features
- **User Authentication**: Secure access with password protection.
- **Sensor Configuration**: Set up and manage fire, smoke, and heat sensors.
- **Real-Time Monitoring**: Track sensor status and events in real-time.
- **Alarm Notifications**: Receive instant alerts when a sensor is triggered.
- **Reset & Deactivation**: Easily reset or deactivate sensors to handle false alarms.
- **Admin Log**: All actions made on site is logged to a list for admins to read.
- **Multi-Admin Support**: The default admin can create more admin accounts.

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
   - Upon signing in, the dashboard allows users to configure and monitor sensors, as well as manage system alarms.
   - Admin users have additional privileges to create new admin accounts, manage user roles, and silence active alarms.

3. **Sensor Activation**:
   - Users can activate a sensor to enable real-time monitoring. When a sensor detects an event (fire, smoke, or heat), it triggers an alarm.

4. **Handling Alarms**:
   - When an alarm is triggered, notifications appear on the dashboard, and appropriate actions can be taken to resolve the situation.
   - Admins have the capability to silence or reset alarms to manage false positives or handle emergency scenarios.

5. **Error Handling**:
 - When an error is encountered you should reset your local stroage settings and it should clear up any problems encountered

## Contributing
Feel free to submit issues or pull requests to help improve the system. All contributions are welcome!

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
Created by [@ad-archer](https://github.com/ad-archer). For questions or collaboration, feel free to reach out.

