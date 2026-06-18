# Bug Report Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bug report icon link to the HomeLanding page header.

**Architecture:** Create a new `BugReportButton` component with an inline SVG bug icon and a placeholder URL, then integrate it into the existing header layout in `HomeLanding.vue` by wrapping it alongside `SignInButton` in a header-actions container.

**Tech Stack:** Vue 3 SFC, SCSS

---

### Task 1: Create BugReportButton component

**Files:**
- Create: `src/components/common/BugReportButton.vue`

- [ ] **Step 1: Create the component file**

```vue
<template>
  <a
    href="/bug-report"
    title="report bug"
    target="_blank"
    rel="noopener noreferrer"
    class="bug-report-btn"
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 6v2a4 4 0 0 1-8 0V6" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="M7 12a5 5 0 0 0 10 0" />
      <path d="M7 12a3 3 0 0 1-3-3" />
      <path d="M17 12a3 3 0 0 0 3-3" />
    </svg>
  </a>
</template>

<script>
export default {
  name: 'BugReportButton',
};
</script>

<style lang="scss" scoped>
.bug-report-btn {
  display: flex;
  align-items: center;
  color: #b0c4de;
  text-decoration: none;
  padding: 4px 8px;
  transition: color 0.15s ease;

  &:hover {
    color: white;
  }

  &:focus-visible {
    outline: 1px solid limegreen;
    outline-offset: 2px;
    border-radius: 2px;
  }
}
</style>
```

- [ ] **Step 2: Run lint to verify**

Run: `npm run lint`
Expected: No errors

---

### Task 2: Integrate BugReportButton into HomeLanding header

**Files:**
- Modify: `src/components/homeLanding/HomeLanding.vue`

- [ ] **Step 1: Import BugReportButton**

Add import after the existing `SignInButton` import on line 187:

```js
import BugReportButton from '../common/BugReportButton.vue';
```

- [ ] **Step 2: Register the component**

Add `BugReportButton` to the `components` object (after `SignInButton`):

```js
export default {
  components: {
    SpinnerDots,
    SplashLogo,
    HeaderTitle,
    SignInButton,
    BugReportButton,
    LoginModal,
    HistoryAirports,
    BadgesDisplay,
    CyberBox,
  },
```

- [ ] **Step 3: Add BugReportButton to the header template**

Replace the existing header (lines 35-42):

```html
          <div class="header">
            <HeaderTitle />
            <div class="header-actions">
              <BugReportButton />
              <SignInButton
                :isLoggedIn="isLoggedIn"
                :username="username"
                @update="signInUpdate"
              ></SignInButton>
            </div>
          </div>
```

- [ ] **Step 4: Add header-actions styles**

Add before `.home section .content .header` (line 604):

```scss
.home section .content .header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

- [ ] **Step 5: Run lint to verify**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 6: Run tests**

Run: `npx vitest run`
Expected: No new failures (pre-existing failures are expected)

- [ ] **Step 7: Commit**

```bash
git add src/components/common/BugReportButton.vue src/components/homeLanding/HomeLanding.vue
git commit -m "feat: add bug report icon link to home landing page"
```
