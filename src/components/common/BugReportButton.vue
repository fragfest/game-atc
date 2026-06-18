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
