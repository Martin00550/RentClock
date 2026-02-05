# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - heading "Check your email" [level=1] [ref=e8]
        - paragraph [ref=e9]: to continue to RentClock
        - paragraph [ref=e11]: support@rentclock.online
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e15]:
            - generic:
              - group
              - textbox "Enter verification code" [active] [ref=e16]
          - button "Didn't receive a code? Resend (6)" [disabled]
        - paragraph [ref=e19]: You're signing in from a new device. We're asking for verification to keep your account secure.
        - generic [ref=e20]:
          - button "Continue" [ref=e21] [cursor=pointer]:
            - generic [ref=e22]:
              - text: Continue
              - img [ref=e23]
          - link "Use another method" [ref=e26] [cursor=pointer]:
            - /url: https://rentclock.online/sign-in/factor-two
    - generic [ref=e31]:
      - paragraph [ref=e32]: Secured by
      - link "Clerk logo" [ref=e33] [cursor=pointer]:
        - /url: https://go.clerk.com/components
        - img [ref=e34]
  - region "Notifications alt+T"
  - alert [ref=e39]
```