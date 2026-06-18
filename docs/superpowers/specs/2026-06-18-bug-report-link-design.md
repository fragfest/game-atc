# Bug Report Link on HomeLanding Page

## Summary

Add a bug report icon link on the HomeLanding page that points to a separate bug reporting app (placeholder URL for now). The link is an icon-only element positioned in the header area.

## Layout

The `div.content > div.header` currently contains:
- `HeaderTitle` (left-aligned)
- `SignInButton` (right-aligned)

Add a wrapper `div.header-actions` around BugReportButton + SignInButton:

```html
<div class="header">
  <HeaderTitle />
  <div class="header-actions">
    <BugReportButton />
    <SignInButton />
  </div>
</div>
```

## Component: BugReportButton

- New file: `src/components/common/BugReportButton.vue`
- Inline SVG bug icon (~24x24px, plain outline style)
- Anchor tag: `<a href="/bug-report" title="report bug" target="_blank" rel="noopener noreferrer">`
- No background/border — plain icon that subtly highlights on hover
- Placeholder URL `/bug-report` — replaceable when the bug app is built

## Styling

- Icon color: light grey/white to match the header aesthetic
- Hover: slight opacity change or color shift
- Fits vertically within the header bar
- No background container — distinct from the styled SignInButton box

## Future

Replace `/bug-report` with the real URL when the bug reporting app is created.
