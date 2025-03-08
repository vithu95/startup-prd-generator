# Setting Up Google OAuth for PRD Generator

This guide will help you set up Google OAuth authentication for your PRD Generator application.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set up the consent screen if prompted
   - Choose "External" as the user type
   - Fill in the required information (app name, user support email, etc.)
   - Add the following scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`
   - Add your domains to the authorized domains list
6. For application type, select "Web application"
7. Add your app's domain to "Authorized JavaScript origins"
   - For local development: `http://localhost:3000`
   - For production: Your production domain
8. Add your redirect URL to "Authorized redirect URIs"
   - This will be your Supabase Auth callback URL: `https://rmejrbqbkobynfljdgnv.supabase.co/auth/v1/callback`
9. Click "Create" to get your Client ID and Client Secret

## Step 2: Configure Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to "Authentication" > "Providers" in the left sidebar
4. Find "Google" in the list of providers
5. Toggle it to enable it
6. Enter the Client ID and Client Secret you obtained from Google Cloud Console
7. Save the changes

## Step 3: Test the Integration

1. Log out of your application
2. Try to generate a PRD
3. You should be redirected to the Google sign-in page
4. After signing in, you should be redirected back to your application

## Troubleshooting

If you encounter the "Unsupported provider: provider is not enabled" error:

1. Make sure you've enabled the Google provider in Supabase
2. Check that you've correctly entered the Client ID and Client Secret
3. Verify that your redirect URI in Google Cloud Console matches the Supabase callback URL
4. Visit `/admin/auth-check` in your application to run diagnostics
5. Check browser developer console for detailed error messages

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2) 