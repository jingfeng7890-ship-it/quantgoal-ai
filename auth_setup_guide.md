# Social Authentication Setup Guide

This guide details how to obtain the necessary API keys from Google and Apple to enable One-Click Login for QuantGoal AI.

## 1. Google OAuth Setup (Easier)

**Goal**: Get `Client ID` and `Client Secret`.

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project** (e.g., "QuantGoal Auth").
3.  Navigate to **APIs & Services** > **OAuth consent screen**.
    *   **User Type**: Select **External**.
    *   **App Name**: "QuantGoal AI".
    *   **Support Email**: Your email.
    *   **Authorized domains**: Add `quantgoal.ai`.
    *   Click Save/Continue (skip scopes for now).
4.  Navigate to **Credentials** > **Create Credentials** > **OAuth client ID**.
    *   **Application type**: Web application.
    *   **Name**: "QuantGoal Web".
    *   **Authorized JavaScript origins**: `https://quantgoal.ai`
    *   **Authorized redirect URIs**:
        *   `https://bafpkbghewcrgyagtsly.supabase.co/auth/v1/callback`
        *   *(You can find this exact URL in Supabase > Authentication > Providers > Google > Callback URL)*
5.  **Copy the Keys**: Google will show you a `Client ID` and `Client Secret`.
6.  **Paste into Supabase**:
    *   Go to Supabase Dashboard > Authentication > Providers > Google.
    *   Paste the keys and enable the provider.

---

## 2. Apple Login Setup (Strict Requirements)

**Goal**: Get `Service ID`, `Team ID`, `Key ID`, and `Secret Key`.
**Requirement**: You must have an Apple Developer Account ($99/year).

1.  Go to [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list).
2.  **Identifiers (App ID)**: Create an App ID (e.g., `com.quantgoal.platform`).
3.  **Identifiers (Service ID)**:
    *   Create a "Services ID".
    *   Identifier: `com.quantgoal.platform.service` (example).
    *   Enable "Sign In with Apple" on this ID and click "Configure".
    *   **Domains and Subdomains**: `quantgoal.ai`
    *   **Return URLs**: `https://bafpkbghewcrgyagtsly.supabase.co/auth/v1/callback` (Same Supabase URL as above).
4.  **Keys**:
    *   Go to "Keys", create a new Key, enable "Sign In with Apple".
    *   Download the `.p8` file (Save this securely!).
    *   Note the **Key ID**.
5.  **Supabase Configuration**:
    *   Go to Supabase > Authentication > Providers > Apple.
    *   **Client ID**: Your Service ID (`com.quantgoal.platform.service`).
    *   **Team ID**: Your Apple Team ID (top right of developer console).
    *   **Key ID**: From step 4.
    *   **Private Key**: Open the `.p8` file with a text editor and copy the whole content.
    *   Click Save.

## 3. Verification

Once configured:
1.  Go to `https://quantgoal.ai/login`.
2.  Click "Google".
3.  You should be redirected to Google's permission page, and then back to your Dashboard.
