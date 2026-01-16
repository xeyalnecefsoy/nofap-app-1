# Lessons Learned & Troubleshooting Guide

This document tracks common issues encountered during development and their proven solutions. Reference this before implementing similar features to avoid regression.

## PWA & Mobile Experience

### 1. PWA Not Opening in Standalone Mode (Android/Samsung)
**Problem:** App opens in a browser tab with URL bar instead of as a standalone app, even with `"display": "standalone"` in manifest.
**Solution:**
- Ensure `manifest.json` is explicitly linked in `src/app/layout.tsx`: `manifest: "/manifest.json"`.
- Add `appleWebApp` configuration in metadata.
- **Critical:** Configure viewport to look like an app: `userScalable: false`.
```typescript
// src/app/layout.tsx
export const viewport: Viewport = {
  themeColor: "#0f172a",
  userScalable: false, // Essential for native feel
  // ...
};
```

### 2. App Icon Not Appearing or Incorrect on Mobile
**Problem:** "Add to Home Screen" uses a default favicon or fails to find the correct icon.
**Solution:**
- Do not rely solely on `manifest.json`. Explicitly add `icons` to `metadata` in `layout.tsx`.
- In `manifest.json`, define icons **twice** if needed: one entry for `purpose: "any"` and another for `purpose: "maskable"`. Do not just combine them into `"any maskable"` string if compatibility is an issue.

## Media Session & Background Audio

### 3. Background Audio/Notification Disappearing
**Problem:** Browser kills the background media session notification after a few seconds or when the screen locks.
**Solution:**
- **Action Handlers:** Browsers check if the "player" supports standard controls. You **MUST** register dummy handlers for `seekto`, `previoustrack`, and `nexttrack` even if you don't use them.
- **Playback State:** Explicitly set `navigator.mediaSession.playbackState = "playing"`.
- **Handling Pause:** When pausing from notification, ensure it updates your app's internal state.

```typescript
// Required for persistent notification on Android/Chrome
const noop = () => {};
navigator.mediaSession.setActionHandler('seekto', noop);
navigator.mediaSession.setActionHandler('previoustrack', noop); 
navigator.mediaSession.setActionHandler('nexttrack', noop);
```

## Next.js & Build

### 4. Next.js 16 Turbopack Warnings
**Problem:** Warnings about webpack config when using Turbopack (default in v16).
**Solution:**
- Explicitly pass the flag in `package.json` scripts: `"dev": "next dev --turbopack"`.

## Internationalization (i18n)

### 5. Missing Translations in Interactive Elements
**Problem:** Buttons or dynamic UI elements show hardcoded English text.
**Solution:**
- Always add new text keys to `LanguageContext.tsx` definitions first.
- Update both dictionaries (`en` and `az`).
- Use the context variable (e.g., `{t.resetOrSlip}`) immediately in the component.
- **Validation:** Check the UI in valid language modes after adding new UI elements.
