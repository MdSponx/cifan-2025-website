# Email Verification System Documentation

## Overview

The CIFAN 2025 platform includes a comprehensive email verification system built with Firebase Authentication. This system ensures that users verify their email addresses before accessing protected features of the application.

## System Architecture

### Core Components

1. **Firebase Configuration** (`src/firebase.ts`)
   - Firebase Auth initialization
   - Project configuration with proper domain settings

2. **Authentication Service** (`src/services/authService.ts`)
   - Centralized authentication logic
   - Email verification methods
   - User profile management

3. **Email Verification Configuration** (`src/config/emailVerification.ts`)
   - Centralized configuration for email verification settings
   - Localized error messages (Thai/English)
   - Cooldown and rate limiting settings

4. **Email Verification Hook** (`src/hooks/useEmailVerification.ts`)
   - React hook for managing email verification state
   - Automatic cooldown management
   - Rate limiting and attempt tracking

5. **UI Components**
   - `VerifyEmailPage.tsx` - Main verification interface
   - `SignUpPage.tsx` - Registration with automatic verification
   - `ProtectedRoute.tsx` - Route protection based on verification status

6. **Authentication Context** (`src/components/auth/AuthContext.tsx`)
   - Global authentication state management
   - Automatic profile synchronization

## Features

### ✅ Implemented Features

1. **Automatic Email Verification**
   - Verification email sent immediately upon registration
   - Custom action code settings for better user experience

2. **Bilingual Support**
   - Full Thai and English language support
   - Localized error messages and UI text

3. **Rate Limiting & Cooldown**
   - 1-minute cooldown between resend attempts
   - Maximum 5 resend attempts per session
   - Visual countdown timer

4. **User-Friendly Interface**
   - Clear instructions and visual feedback
   - Success/error message handling
   - Responsive design for mobile and desktop

5. **Real-time Status Checking**
   - Manual verification status checking
   - Automatic profile updates upon verification

6. **Route Protection**
   - Flexible route protection with email verification requirements
   - Automatic redirects based on verification status

7. **Profile Integration**
   - Email verification status stored in user profiles
   - Automatic profile completion flow

## Configuration

### Firebase Settings

The system uses the following Firebase configuration:

```typescript
// Action code settings for email verification
actionCodeSettings: {
  url: `${window.location.origin}/#auth/verify-email`,
  handleCodeInApp: true,
}
```

### Rate Limiting Settings

```typescript
settings: {
  resendCooldown: 60000,        // 1 minute
  maxResendAttempts: 5,         // 5 attempts per session
  autoCheckInterval: 30000,     // 30 seconds
  verificationTimeout: 300000,  // 5 minutes
}
```

## Usage Examples

### Basic Email Verification

```typescript
import { useEmailVerification } from '../hooks/useEmailVerification';

const MyComponent = () => {
  const { user } = useAuth();
  const {
    isVerified,
    isResending,
    sendVerificationEmail,
    checkVerificationStatus,
    error,
    success
  } = useEmailVerification(user, 'en');

  return (
    <div>
      {!isVerified && (
        <button 
          onClick={sendVerificationEmail}
          disabled={isResending}
        >
          {isResending ? 'Sending...' : 'Send Verification Email'}
        </button>
      )}
    </div>
  );
};
```

### Protected Route with Email Verification

```typescript
<ProtectedRoute requireEmailVerification={true}>
  <YourProtectedComponent />
</ProtectedRoute>
```

### Manual Verification Check

```typescript
const handleCheckVerification = async () => {
  const isVerified = await checkVerificationStatus();
  if (isVerified) {
    // Redirect to next step
    window.location.hash = '#profile/setup';
  }
};
```

## Error Handling

The system includes comprehensive error handling with localized messages:

### Common Error Codes

- `auth/invalid-action-code` - Invalid or expired verification link
- `auth/expired-action-code` - Verification link has expired
- `auth/too-many-requests` - Too many verification attempts
- `auth/network-request-failed` - Network connectivity issues
- `max-attempts-reached` - Maximum resend attempts exceeded
- `cooldown-active` - Resend cooldown period active

### Error Message Localization

```typescript
const errorMessage = getLocalizedErrorMessage(error.code, 'th');
```

## Security Features

1. **Rate Limiting**
   - Prevents spam and abuse
   - Configurable cooldown periods

2. **Attempt Tracking**
   - Limits verification attempts per session
   - Automatic reset on successful verification

3. **Secure Action Codes**
   - Firebase-generated secure verification links
   - Automatic expiration handling

4. **Profile Synchronization**
   - Verification status synced across user profile
   - Automatic updates on status changes

## Testing

### Manual Testing Checklist

1. **Registration Flow**
   - [ ] User receives verification email upon registration
   - [ ] Email contains correct verification link
   - [ ] Link redirects to verification page

2. **Verification Page**
   - [ ] Shows correct user email address
   - [ ] Resend button works with cooldown
   - [ ] Status check button updates verification state
   - [ ] Error messages display correctly

3. **Route Protection**
   - [ ] Unverified users redirected to verification page
   - [ ] Verified users can access protected routes
   - [ ] Proper fallback messages shown

4. **Localization**
   - [ ] Thai language support works correctly
   - [ ] English language support works correctly
   - [ ] Error messages localized properly

### Automated Testing

```bash
# Run tests (when implemented)
npm test -- --testPathPattern=emailVerification
```

## Troubleshooting

### Common Issues

1. **Verification emails not received**
   - Check spam/junk folders
   - Verify Firebase project email settings
   - Check domain authentication

2. **Verification links not working**
   - Ensure correct domain configuration in Firebase
   - Check action code settings
   - Verify URL routing

3. **Rate limiting too aggressive**
   - Adjust cooldown settings in configuration
   - Modify maximum attempt limits

### Debug Mode

Enable debug logging by setting:

```typescript
// In development
console.log('Email verification debug:', {
  user: user?.email,
  verified: user?.emailVerified,
  attempts: resendAttempts,
  cooldown: cooldownRemaining
});
```

## Future Enhancements

### Planned Features

1. **Email Template Customization**
   - Custom HTML email templates
   - Branded verification emails

2. **Advanced Analytics**
   - Verification completion rates
   - User behavior tracking

3. **Alternative Verification Methods**
   - SMS verification backup
   - Social media verification

4. **Admin Dashboard**
   - User verification status management
   - Bulk verification operations

## Support

For issues related to email verification:

1. Check this documentation first
2. Review Firebase console for authentication logs
3. Test with different email providers
4. Contact development team with specific error codes

## Changelog

### Version 1.0.0 (Current)
- Initial email verification system implementation
- Bilingual support (Thai/English)
- Rate limiting and cooldown features
- Comprehensive error handling
- Profile integration
- Route protection
