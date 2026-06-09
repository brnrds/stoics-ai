# Architecture
URL: /docs/architecture

How components, runtimes, and cloud services fit together.

## [assistant-ui is built on these main pillars:](#assistant-ui-is-built-on-these-main-pillars)

1\. Frontend components

Shadcn UI chat components with built-in state management

2\. Runtime

State management layer connecting UI to LLMs and backend services

3\. Assistant Cloud

Hosted service for thread persistence, history, and user management

### [1. Frontend components](#1-frontend-components)

Stylized and functional chat components built on top of Shadcn components that have context state management provided by the assistantUI runtime provider. These pre-built React components come with intelligent state management.

- href

  /docs/ui/thread

View our components

### [2. Runtime](#2-runtime)

A React state management context for assistant chat. The runtime handles data conversions between the local state and calls to backends and LLMs. We offer different runtime solutions that work with various frameworks like Vercel AI SDK, LangGraph, LangChain, Helicone, local runtime, and an ExternalStore when you need full control of the frontend message state.

- href

  /docs/runtimes/pick-a-runtime

You can view the runtimes we support

### [3. Assistant Cloud](#3-assistant-cloud)

A hosted service that enhances your assistant experience with comprehensive thread management and message history. Assistant Cloud stores complete message history, automatically persists threads, supports human-in-the-loop workflows, and integrates with common auth providers to seamlessly allow users to resume conversations at any point.

- href

  /docs/cloud

Cloud Docs

### [There are three common ways to architect your assistant-ui application:](#there-are-three-common-ways-to-architect-your-assistant-ui-application)

#### [**1. Direct Integration with External Providers**](#1-direct-integration-with-external-providers)

- chart

  graph TD\n A\[Frontend Components] --> B\[Runtime]\n B --> D\[External Providers or LLM APIs]\n \n \n classDef default color:#f8fafc,text-align:center\n \n style A fill:#e879f9,stroke:#2e1065,stroke-width:2px,color:#2e1065,font-weight:bold\n style B fill:#93c5fd,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a,font-weight:bold\n style D fill:#fca5a5,stroke:#7f1d1d,stroke-width:2px,color:#7f1d1d,font-weight:bold\n \n class A,B,C,D,E default

#### [**2. Using your own API endpoint**](#2-using-your-own-api-endpoint)

- chart

  graph TD\n A\[Frontend Components] --> B\[Runtime]\n B --> E\[Your API Backend]\n E --> D\[External Providers or LLM APIs]\n \n \n classDef default color:#f8fafc,text-align:center\n \n style A fill:#e879f9,stroke:#2e1065,stroke-width:2px,color:#2e1065,font-weight:bold\n style B fill:#93c5fd,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a,font-weight:bold\n style D fill:#fca5a5,stroke:#7f1d1d,stroke-width:2px,color:#7f1d1d,font-weight:bold\n style E fill:#fca5a5,stroke:#7f1d1d,stroke-width:2px,color:#7f1d1d,font-weight:bold\n \n class A,B,C,D,E default

#### [**3. With Assistant Cloud**](#3-with-assistant-cloud)

- chart

  graph TD\n A\[Frontend Components] --> B\[Runtime]\n B --> C\[Cloud]\n E --> C\n C --> D\[External Providers or LLM APIs]\n B --> E\[Your API Backend]\n \n classDef default color:#f8fafc,text-align:center\n \n style A fill:#e879f9,stroke:#2e1065,stroke-width:2px,color:#2e1065,font-weight:bold\n style B fill:#93c5fd,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a,font-weight:bold\n style C fill:#86efac,stroke:#064e3b,stroke-width:2px,color:#064e3b,font-weight:bold\n style D fill:#fca5a5,stroke:#7f1d1d,stroke-width:2px,color:#7f1d1d,font-weight:bold\n style E fill:#fca5a5,stroke:#7f1d1d,stroke-width:2px,color:#7f1d1d,font-weight:bold\n \n class A,B,C,D,E default