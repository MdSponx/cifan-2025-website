# CIFAN 2025 Film Festival Website

A React TypeScript application for the CIFAN 2025 Film Festival, featuring film submission forms, event information, and multilingual support.

## 🚀 Live Site

The website is deployed and live at: **https://cifan-c41c6.web.app**

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Internationalization**: i18next
- **Backend Services**: Firebase (Firestore, Storage, Analytics)
- **Hosting**: Firebase Hosting

## 📁 Project Structure

```
├── public/
│   └── locales/          # Translation files
│       ├── en/
│       └── th/
├── src/
│   ├── components/       # React components
│   │   ├── forms/       # Form components
│   │   ├── layout/      # Layout components
│   │   ├── pages/       # Page components
│   │   ├── sections/    # Section components
│   │   └── ui/          # UI components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── firebase.json        # Firebase configuration
├── .firebaserc         # Firebase project settings
└── deploy.sh           # Deployment script
```

## 🔧 Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-zphayr12-wdsmjz8q
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Automatic Deployment (Recommended)

Use the provided deployment script:

```bash
./deploy.sh
```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

## 🔥 Firebase Configuration

The project is configured to use Firebase project `cifan-c41c6` with the following services:

- **Hosting**: Static website hosting
- **Firestore**: Database for form submissions
- **Storage**: File uploads (documents, videos)
- **Analytics**: Website analytics

### Firebase Setup Files

- `.firebaserc` - Project configuration
- `firebase.json` - Hosting configuration
- `src/firebase.ts` - Firebase SDK initialization

## 🌐 Features

- **Multilingual Support**: English and Thai translations
- **Film Submission Forms**: Multiple competition categories
- **File Upload**: Support for documents and video files
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Client-side validation with error handling
- **Progress Tracking**: Multi-step form with progress indicators

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## 🚨 Security Notes

- Firebase configuration is public (client-side)
- Security rules should be configured in Firebase Console
- Sensitive operations should use Firebase Security Rules

## 📊 Performance Optimization

The build process includes:
- Code splitting and tree shaking
- Asset optimization
- Gzip compression
- Bundle size analysis

## 🐛 Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed
- Check for TypeScript errors: `npm run lint`

### Deployment Issues
- Verify Firebase CLI is installed and logged in
- Check Firebase project permissions
- Ensure build completed successfully before deploying

## 📞 Support

For technical issues or questions about the deployment, please check:
- Firebase Console: https://console.firebase.google.com/project/cifan-c41c6/overview
- Build logs for error details
- Network connectivity for deployment issues
