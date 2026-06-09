# Agent Skills
URL: /docs/llm

Use AI tools to build with assistant-ui faster. AI-accessible documentation, Claude Code skills, and MCP integration.

Build faster with AI assistants that understand assistant-ui. This page covers all the ways to give your AI tools access to assistant-ui documentation and context.

## [AI Accessible Documentation](#ai-accessible-documentation)

Our docs are designed to be easily accessible to AI assistants:

[/llms.txt](/llms.txt)

[Structured index of all documentation pages. Point your AI here for a quick overview.](/llms.txt)

[/llms-full.txt](/llms-full.txt)

[Complete documentation in a single file. Use this for full context.](/llms-full.txt)

.mdx suffix

Add `.mdx` to any page's URL to get raw markdown content (e.g., `/docs/installation.mdx`).

### [Context Files](#context-files)

Add assistant-ui context to your project's `CLAUDE.md` or `.cursorrules`:

`## assistant-ui This project uses assistant-ui for chat interfaces. Documentation: https://www.assistant-ui.com/llms-full.txt Key patterns: - Use AssistantRuntimeProvider at the app root - Thread component for full chat interface - AssistantModal for floating chat widget - useChatRuntime hook with AI SDK transport`

## [Skills](#skills)

Install assistant-ui skills for AI Tools:

`npx skills add assistant-ui/skills`

| Skill           | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| `/assistant-ui` | General architecture and overview guide                              |
| `/setup`        | Project setup and configuration (AI SDK, LangGraph, custom backends) |
| `/primitives`   | UI component primitives (Thread, Composer, Message, etc.)            |
| `/runtime`      | Runtime system and state management                                  |
| `/tools`        | Tool registration and tool UI                                        |
| `/streaming`    | Streaming protocol with assistant-stream                             |
| `/cloud`        | Cloud persistence and authorization                                  |
| `/thread-list`  | Multi-thread management                                              |
| `/update`       | Update assistant-ui and AI SDK to latest versions                    |

Use by typing the command in Claude Code, e.g., `/assistant-ui` for the main guide or `/setup` when setting up a project.

## [MCP](#mcp)

`@assistant-ui/mcp-docs-server` provides direct access to assistant-ui documentation and examples in your IDE via the Model Context Protocol.

Once installed, your AI assistant will understand everything about assistant-ui - just ask naturally:

- "Add a chat interface with streaming support to my app"
- "How do I integrate assistant-ui with the Vercel AI SDK?"
- "My Thread component isn't updating, what could be wrong?"

### [Quick Install (CLI)](#quick-install-cli)

`npx add-mcp @assistant-ui/mcp-docs-server`

Or specify your IDE directly:

`npx add-mcp @assistant-ui/mcp-docs-server -a claude-code npx add-mcp @assistant-ui/mcp-docs-server -a claude-desktop npx add-mcp @assistant-ui/mcp-docs-server -a codex npx add-mcp @assistant-ui/mcp-docs-server -a cursor npx add-mcp @assistant-ui/mcp-docs-server -a gemini-cli npx add-mcp @assistant-ui/mcp-docs-server -a opencode npx add-mcp @assistant-ui/mcp-docs-server -a vscode npx add-mcp @assistant-ui/mcp-docs-server -a zed`

### [Manual Installation](#manual-installation)

- items

  - Cursor
  - Windsurf
  - VSCode
  - Zed
  - Claude Code
  - Claude Desktop

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=assistant-ui\&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBhc3Npc3RhbnQtdWkvbWNwLWRvY3Mtc2VydmVyIl19)

Or add to `.cursor/mcp.json`:

`{ "mcpServers": { "assistant-ui": { "command": "npx", "args": ["-y", "@assistant-ui/mcp-docs-server"] } } }`

After adding, open Cursor Settings → MCP → find "assistant-ui" and click enable.

Add to `~/.codeium/windsurf/mcp_config.json`:

`{ "mcpServers": { "assistant-ui": { "command": "npx", "args": ["-y", "@assistant-ui/mcp-docs-server"] } } }`

After adding, fully quit and re-open Windsurf.

Add to `.vscode/mcp.json` in your project:

`{ "servers": { "assistant-ui": { "command": "npx", "args": ["-y", "@assistant-ui/mcp-docs-server"], "type": "stdio" } } }`

Enable MCP in Settings → search "MCP" → enable "Chat > MCP". Use GitHub Copilot Chat in Agent mode.

Add to your Zed settings file:

- macOS: `~/.zed/settings.json`
- Linux: `~/.config/zed/settings.json`
- Windows: `%APPDATA%\Zed\settings.json`

Or open via `Cmd/Ctrl + ,` → "Open JSON Settings"

`{ "context_servers": { "assistant-ui": { "command": { "path": "npx", "args": ["-y", "@assistant-ui/mcp-docs-server"] } } } }`

The server starts automatically with the Assistant Panel.

`claude mcp add assistant-ui -- npx -y @assistant-ui/mcp-docs-server`

The server starts automatically once added.

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

`{ "mcpServers": { "assistant-ui": { "command": "npx", "args": ["-y", "@assistant-ui/mcp-docs-server"] } } }`

Restart Claude Desktop after updating the configuration.

### [Available Tools](#available-tools)

| Tool                  | Description                                                                             |
| --------------------- | --------------------------------------------------------------------------------------- |
| `assistantUIDocs`     | Access documentation: getting started, component APIs, runtime docs, integration guides |
| `assistantUIExamples` | Browse code examples: AI SDK, LangGraph, OpenAI Assistants, tool UI patterns            |

### [Troubleshooting](#troubleshooting)

- **Server not starting**: Ensure `npx` is installed and working. Check configuration file syntax.
- **Tool calls failing**: Restart the MCP server and/or your IDE. Update to latest IDE version.