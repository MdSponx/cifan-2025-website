# Email Verification Troubleshooting Guide

## Issue: Emails not sending to @studiocommuan.com

### Quick Diagnosis Steps

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for email verification logs when attempting to send

2. **Firebase Console Checks**
   - Go to Firebase Console → Authentication → Settings
   - Verify `studiocommuan.com` is in Authorized domains
   - Check Authentication → Usage for quota limits
   - Review Authentication → Templates → Email address verification

### Common Solutions

#### 1. Authorized Domains Configuration
```
Firebase Console → Authentication → Settings → Authorized domains
Add: studiocommuan.com
```

#### 2. Action Code Settings
The system now uses production-ready URLs:
- Production: `https://cifan-c41c6.web.app/auth/verify-email`
- Development: `http://localhost:5173/auth/verify-email`

#### 3. Email Server Configuration
For `@studiocommuan.com` domain, check:
- SPF records allow Firebase email servers
- DMARC policy doesn't reject Firebase emails
- Email server isn't blocking automated emails

### Debugging Information

The system now logs detailed information:
```javascript
// Check browser console for these logs:
- "Attempting to send email verification to: user@studiocommuan.com"
- "Email verification sent successfully"
- "Email verification error: [error details]"
```

### Firebase Email Servers
Firebase sends emails from these IP ranges:
- `209.85.128.0/17`
- `64.233.160.0/19`
- `66.249.80.0/20`
- `72.14.192.0/18`
- `74.125.0.0/16`
- `108.177.8.0/21`
- `173.194.0.0/16`
- `209.85.128.0/17`

### Email Server Whitelist
Add these domains to your email server whitelist:
- `*.firebaseapp.com`
- `*.googleapis.com`
- `noreply@*.firebaseapp.com`

### Testing Steps

1. **Test with Gmail first**
   ```javascript
   // Try with a Gmail address to confirm Firebase is working
   ```

2. **Check spam folders**
   - Gmail: Spam folder
   - Outlook: Junk folder
   - Custom domain: Check server-side spam filters

3. **Verify domain DNS**
   ```bash
   # Check MX records
   nslookup -type=MX studiocommuan.com
   
   # Check SPF records
   nslookup -type=TXT studiocommuan.com
   ```

### Error Codes Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/quota-exceeded` | Daily email limit reached | Wait 24 hours or upgrade plan |
| `auth/invalid-email` | Email format invalid | Check email address format |
| `auth/user-disabled` | Account disabled | Contact Firebase support |
| `domain-not-authorized` | Domain not in authorized list | Add domain to Firebase settings |

### Manual Testing

1. **Browser Console Test**
   ```javascript
   // Open browser console and run:
   firebase.auth().currentUser.sendEmailVerification()
     .then(() => console.log('Email sent'))
     .catch(err => console.error('Error:', err));
   ```

2. **Network Tab Check**
   - Open Developer Tools → Network tab
   - Filter by "XHR" or "Fetch"
   - Look for Firebase API calls when sending email

### Contact Points

If issue persists:
1. **Firebase Support**: Check Firebase Console → Support
2. **Email Admin**: Contact `studiocommuan.com` email administrator
3. **DNS Provider**: Check domain DNS settings

### Production Checklist

- [ ] `studiocommuan.com` added to Firebase Authorized domains
- [ ] Email templates configured correctly
- [ ] Action code settings use production URLs
- [ ] Email server allows Firebase IP ranges
- [ ] SPF/DMARC records configured properly
- [ ] Spam filters allow Firebase emails
- [ ] Daily quota not exceeded
- [ ] User account not disabled

### Debug Mode

The system now includes debug logging. Check browser console for:
- Email sending attempts
- Success/failure messages
- Detailed error information
- Domain and user information

### Alternative Solutions

If email verification continues to fail:

1. **Use Phone Verification** (if supported)
2. **Manual Verification Process** (admin approval)
3. **Alternative Email Domain** (temporary workaround)
4. **Custom Email Service** (SendGrid, Mailgun integration)

---

**Last Updated**: January 2025
**Status**: Active troubleshooting for @studiocommuan.com domain