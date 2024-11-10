# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
---

## [2.0.0] - 2024-11-10
### Added
- Custom Sensor System:
  - Create custom sensors with unique names, icons, and descriptions
  - Custom sensors appear alongside alarms in the Defense Panel
  - Full integration with existing alarm system
  - Admin-only sensor management

- Enhanced Admin Controls:
  - Create new users directly from settings
  - Set admin privileges during user creation
  - Override password requirements with confirmation
  - Improved user management interface

- Advanced Log Management:
  - Configurable maximum log entries
  - Auto-delete logs after specified retention period
  - Export logs to CSV format
  - Clear logs functionality
  - Log retention settings

### Changed
- Removed built-in sensors in favor of customizable system
- Improved mobile responsiveness across all pages
- Enhanced settings page layout and organization
- Streamlined user interface for sensor management

### Fixed
- Infinite loop issue in sensor monitoring system
- Mobile styling issues in settings page
- Alignment issues with icons and text
- Button sizing and spacing on mobile devices

---

## [1.0.2] - 2024-11-10
### Added
- Recreated the react app to allow for a proper deployment
- Minor bug fixes and changes to css
- Fixes for styling issues on mobile devices
---

## [1.0.1] - 2024-10-30
### Added
- `SECURITY.md` for security policies and responsible disclosure guidelines.
- `CHANGELOG.md` for tracking changes and improvements.

### Fixed
- Improved error handling for authentication errors by refining local storage reset functionality.

---

## [1.0.0] - 2024-10-28
### Added
- Initial release of Dynasty Defense System.
- Core features:
  - User authentication with password protection.
  - Sensor configuration for fire, smoke, and heat sensors.
  - Real-time monitoring and alarm notification for all sensors.
  - Admin functionalities for multi-user management and action logging.

---

