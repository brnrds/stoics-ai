# DevTools
URL: /docs/devtools

Inspect runtime state, context, and events in the browser.

The assistant-ui DevTools allows you to debug the assistant-ui state and context, and events without resorting to `console.log`. It's an easy way to see how data flows to the assistant-ui's runtime layer.

- alt

  Screenshot of the DevTools UI showing logs and state panels

## [Setup](#setup)

### [Install the DevTools package](#install-the-devtools-package)

- packages

  - @assistant-ui/react-devtools

### [Mount the DevTools modal](#mount-the-devtools-modal)

`import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { DevToolsModal } from "@assistant-ui/react-devtools"; export function AssistantApp() { const runtime = /* your runtime setup */; return ( <AssistantRuntimeProvider runtime={runtime}> <DevToolsModal /> {/* ...your assistant-ui... */} </AssistantRuntimeProvider> ); }`

### [Verify the DevTools overlay](#verify-the-devtools-overlay)

That's it! In development builds you should now see the DevTools in the lower-right corner of your site.

- alt

  DevTools floating modal anchored in the lower-right corner of a page