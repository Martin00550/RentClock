# Toll-Free Verification (TFV) Resubmission Guide

This guide contains the information you need to resubmit your Toll-Free Verification application. The application code has been updated to meet carrier compliance standards.

## 1. Compliance Updates Made
- **SMS Disclosure**: The SMS connection dialog now includes the mandatory "HELP" instruction and direct links to Privacy Policy and Terms of Service.
- **Privacy Policy**: Added a specific clause stating that mobile information is not shared with third parties for marketing purposes.
- **Terms of Service**: Added "HELP" instructions to the SMS Messaging Policy section.

## 2. Resubmission Details

Use the following information when filling out the verification form:

### Opt-In Workflow Description
> "Users log in to the secure dashboard, navigate to **Settings > Integrations**, and click 'Configure' under the SMS Alerts section. A dialog appears where they enter their mobile number. The compliant opt-in disclosure text is displayed prominently below the phone input field, requiring user review before they click 'Save & Activate' to consent."

### Call-to-Action / Opt-In Image
*Take a screenshot of the **SMS Configuration** section in the Settings page (or use the link below). Ensure the RentClock logo and the full disclosure text are visible.*

### Opt-In URL (Public Preview)
`https://rentclock.online/sms-preview`

### Opt-In Message / Disclosure Text
> "By providing your phone number, you agree to receive automated transactional text messages (alerts and reminders) from RentClock. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for more information. View our Privacy Policy and Terms of Service."

### Privacy Policy URL
`https://rentclock.online/privacy`

### Terms of Service URL
`https://rentclock.online/terms`

## 3. Deployment
Before taking screenshots or submitting, deploy the latest changes to production:

```bash
git add .
git commit -m "fix: sms compliance updates for tfv"
git push origin main
```
