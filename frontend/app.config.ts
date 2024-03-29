export default defineAppConfig({
  ui: {
    primary: 'spring-green',
    card: {
      background: 'bg-slate-200 dark:bg-neutral-900',
    },
    modal: {
      background: 'bg-slate-200 dark:bg-neutral-900',
      ring: 'ring-1 ring-slate-300 dark:ring-neutral-800',
      overlay: {
        background: 'bg-slate-200/75 dark:bg-neutral-900/75',
      },
    },
    notifications: {
      position: 'top-0 bottom-auto',
    },
    notification: {
      background: 'bg-slate-200 dark:bg-neutral-900',
      ring: 'ring-1 ring-slate-300 dark:ring-neutral-800',
    },
  },
});
