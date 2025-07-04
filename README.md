# YubiGuard - Security Key Management System

> **⚠️ Important Disclaimer**: YubiGuard is an independent security key management system and is not affiliated with, endorsed by, or connected to Yubico in any way. This project uses generic "Security Key" terminology to avoid trademark issues and works with any hardware security key vendor.

## Overview

YubiGuard is a modern, enterprise-grade Security Key management system built with Angular and designed for organizations that need to manage hardware security keys across their user base. The system provides a clean, intuitive interface for managing users, assigning Security Keys, and tracking key usage.

## Features

### 🔐 Security Key Management
- **Add Security Keys**: Easily add new Security Keys to users with UUID validation
- **Key Assignment**: Assign multiple Security Keys to individual users
- **Key Search**: Find any Security Key in the system and see its owner
- **Key Status Tracking**: Monitor key status and last activity

### 👥 User Management
- **User Creation**: Add new users to the system with full profile information
- **User Profiles**: View detailed user information including assigned keys
- **User Search**: Search users by name, email, or other criteria
- **Profile Pictures**: Automatic avatar generation using UI Avatars

### 🔍 Advanced Features
- **Real-time Search**: Instant search across users and Security Keys
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Smooth loading indicators for better UX

## Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **HTTP Client**: Angular HttpClient
- **Forms**: Angular Reactive Forms & Template-driven Forms
- **Routing**: Angular Router

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd YubiGuard/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend connection**
   
   Update the `apiUrl` in `src/user.service.ts` to point to your backend server:
   ```typescript
   private apiUrl = "http://localhost:8080"; // Change to your backend URL
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:4200` to access the application.

## Usage

### Managing Users

1. **View Users**: Navigate to the "Users" page to see all users in the system
2. **Add User**: Click "Add User" to create a new user account
3. **User Details**: Click on any user to view their profile and assigned Security Keys
4. **Add Keys**: Use the "Add New Key" button to assign Security Keys to users

### Managing Security Keys

1. **View All Keys**: Navigate to "Manage Security Keys" to see all keys in the system
2. **Search Keys**: Use the search functionality to find specific keys
3. **Key Details**: View detailed information about each key including owner and status

### Finding Security Keys

1. **Search by ID**: Use the "Find Key" feature to locate any Security Key by its UUID
2. **Owner Information**: View the user assigned to the key and their contact details
3. **Key Status**: Check the current status and last activity of the key

## API Integration

The application expects a backend API with the following endpoints:

- `GET /users` - Retrieve all users
- `POST /users` - Create a new user
- `POST /users/{userId}/keys` - Add a Security Key to a user
- `DELETE /users/{userId}/keys/{keyId}` - Remove a Security Key from a user

## Security Considerations

- **CORS Configuration**: Ensure your backend allows requests from `http://localhost:4200` during development
- **Input Validation**: All user inputs are validated both client-side and should be validated server-side
- **UUID Format**: Security Key UUIDs are validated using standard UUID format
- **Error Handling**: Sensitive error information is not exposed to users

## Development

### Project Structure
```
src/
├── app/
│   ├── pages/
│   │   ├── home/           # Landing page
│   │   ├── users/          # User management
│   │   ├── add-user/       # User creation
│   │   ├── add/            # Key assignment
│   │   ├── manage-keys/    # Key management
│   │   └── find-key/       # Key search
│   ├── app.component.html  # Main navigation
│   └── app.routes.ts       # Routing configuration
├── user.service.ts         # API service
└── user.model.ts          # User data model
```

### Building for Production

```bash
ng build --configuration production
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## Acknowledgments

- **Yubico**: For pioneering hardware security key technology (though this project is not affiliated)
- **Angular Team**: For the excellent framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Heroicons**: For the beautiful icon set

---

**Note**: This project uses "Security Key" terminology instead of specific brand names to maintain vendor neutrality and avoid trademark issues. It works with any hardware security key that provides a UUID identifier.
