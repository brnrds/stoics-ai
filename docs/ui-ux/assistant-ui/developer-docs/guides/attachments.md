# File Attachments
URL: /docs/guides/attachments

Let users attach images, PDFs, and other files to AI chat messages in React. Drag-drop, paste, and vision-model support, built into assistant-ui.

Enable users to attach files to their messages, enhancing conversations with images, documents, and other content.

## [Overview](#overview)

The attachment system in assistant-ui provides a flexible framework for handling file uploads in your AI chat interface. It consists of:

- **Attachment Adapters**: Backend logic for processing attachment files
- **UI Components**: Pre-built components for attachment display and interaction
- **Runtime Integration**: Seamless integration with all assistant-ui runtimes

## [Getting Started](#getting-started)

### [Install UI Components](#install-ui-components)

First, add the attachment UI components to your project:

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/attachment.json

#### Main Component

- packages

  - @assistant-ui/react
  - zustand

* code

  "use client"; import { type PropsWithChildren, useEffect, useState, type FC } from "react"; import { XIcon, PlusIcon, FileText } from "lucide-react"; import { AttachmentPrimitive, ComposerPrimitive, MessagePrimitive, useAuiState, useAui, } from "@assistant-ui/react"; import { useShallow } from "zustand/shallow"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { Dialog, DialogTitle, DialogContent, DialogTrigger, } from "@/components/ui/dialog"; import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button"; import { cn } from "@/lib/utils"; const useFileSrc = (file: File | undefined) => { const \[src, setSrc] = useState\<string | undefined>(undefined); useEffect(() => { if (!file) { setSrc(undefined); return; } const objectUrl = URL.createObjectURL(file); setSrc(objectUrl); return () => { URL.revokeObjectURL(objectUrl); }; }, \[file]); return src; }; const useAttachmentSrc = () => { const { file, src } = useAuiState( useShallow((s): { file?: File; src?: string } => { if (s.attachment.type !== "image") return {}; if (s.attachment.file) return { file: s.attachment.file }; const src = s.attachment.content?.filter((c) => c.type === "image")\[0] ?.image; if (!src) return {}; return { src }; }), ); return useFileSrc(file) ?? src; }; type AttachmentPreviewProps = { src: string; }; const AttachmentPreview: FC\<AttachmentPreviewProps> = ({ src }) => { const \[isLoaded, setIsLoaded] = useState(false); return ( \<img src={src} alt="Attachment preview" className={cn( "block h-auto max-h-\[80vh] w-auto max-w-full object-contain", isLoaded ? "aui-attachment-preview-image-loaded" : "aui-attachment-preview-image-loading invisible", )} onLoad={() => setIsLoaded(true)} /> ); }; const AttachmentPreviewDialog: FC\<PropsWithChildren> = ({ children }) => { const src = useAttachmentSrc(); if (!src) return children; return ( \<Dialog> \<DialogTrigger className="aui-attachment-preview-trigger cursor-pointer transition-colors hover:bg-accent/50" asChild > {children} \</DialogTrigger> \<DialogContent className="aui-attachment-preview-dialog-content p-2 sm:max-w-3xl \[&>button]:rounded-full \[&>button]:bg-foreground/60 \[&>button]:p-1 \[&>button]:opacity-100 \[&>button]:ring-0! \[&\_svg]:text-background \[&>button]:hover:\[&\_svg]:text-destructive"> \<DialogTitle className="aui-sr-only sr-only"> Image Attachment Preview \</DialogTitle> \<div className="aui-attachment-preview relative mx-auto flex max-h-\[80dvh] w-full items-center justify-center overflow-hidden bg-background"> \<AttachmentPreview src={src} /> \</div> \</DialogContent> \</Dialog> ); }; const AttachmentThumb: FC = () => { const src = useAttachmentSrc(); return ( \<Avatar className="aui-attachment-tile-avatar h-full w-full rounded-none"> \<AvatarImage src={src} alt="Attachment preview" className="aui-attachment-tile-image object-cover" /> \<AvatarFallback> \<FileText className="aui-attachment-tile-fallback-icon size-8 text-muted-foreground" /> \</AvatarFallback> \</Avatar> ); }; const AttachmentUI: FC = () => { const aui = useAui(); const isComposer = aui.attachment.source !== "message"; const isImage = useAuiState((s) => s.attachment.type === "image"); const typeLabel = useAuiState((s) => { const type = s.attachment.type; switch (type) { case "image": return "Image"; case "document": return "Document"; case "file": return "File"; default: return type; } }); return ( \<Tooltip> \<AttachmentPrimitive.Root className={cn( "aui-attachment-root relative", isImage && "aui-attachment-root-composer only:\*:first:size-24", )} > \<AttachmentPreviewDialog> \<TooltipTrigger asChild> \<div className="aui-attachment-tile size-14 cursor-pointer overflow-hidden rounded-\[calc(var(--composer-radius)-var(--composer-padding))] border bg-muted transition-opacity hover:opacity-75" role="button" tabIndex={0} aria-label={\`${typeLabel} attachment\`} > \<AttachmentThumb /> \</div> \</TooltipTrigger> \</AttachmentPreviewDialog> {isComposer && \<AttachmentRemove />} \</AttachmentPrimitive.Root> \<TooltipContent side="top"> \<AttachmentPrimitive.Name /> \</TooltipContent> \</Tooltip> ); }; const AttachmentRemove: FC = () => { return ( \<AttachmentPrimitive.Remove asChild> \<TooltipIconButton tooltip="Remove file" className="aui-attachment-tile-remove absolute end-1.5 top-1.5 size-3.5 rounded-full bg-white text-muted-foreground opacity-100 shadow-sm hover:bg-white! \[&\_svg]:text-black hover:\[&\_svg]:text-destructive" side="top" > \<XIcon className="aui-attachment-remove-icon size-3 dark:stroke-\[2.5px]" /> \</TooltipIconButton> \</AttachmentPrimitive.Remove> ); }; export const UserMessageAttachments: FC = () => { return ( \<div className="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2"> \<MessagePrimitive.Attachments> {() => \<AttachmentUI />} \</MessagePrimitive.Attachments> \</div> ); }; export const ComposerAttachments: FC = () => { return ( \<div className="aui-composer-attachments flex w-full flex-row items-center gap-2 overflow-x-auto empty:hidden"> \<ComposerPrimitive.Attachments> {() => \<AttachmentUI />} \</ComposerPrimitive.Attachments> \</div> ); }; export const ComposerAddAttachment: FC = () => { return ( \<ComposerPrimitive.AddAttachment asChild> \<TooltipIconButton tooltip="Add Attachment" side="bottom" variant="ghost" size="icon" className="aui-composer-add-attachment size-8 rounded-full p-1 font-semibold text-xs hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30" aria-label="Add Attachment" > \<PlusIcon className="aui-attachment-add-icon size-5 stroke-\[1.5px]" /> \</TooltipIconButton> \</ComposerPrimitive.AddAttachment> ); };

- lang

  tsx

- code

  "use client"; import { type PropsWithChildren, useEffect, useState, type FC } from "react"; import { XIcon, PlusIcon, FileText } from "lucide-react"; import { AttachmentPrimitive, ComposerPrimitive, MessagePrimitive, useAuiState, useAui, } from "@assistant-ui/react"; import { useShallow } from "zustand/shallow"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { Dialog, DialogTitle, DialogContent, DialogTrigger, } from "@/components/ui/dialog"; import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button"; import { cn } from "@/lib/utils"; const useFileSrc = (file: File | undefined) => { const \[src, setSrc] = useState\<string | undefined>(undefined); useEffect(() => { if (!file) { setSrc(undefined); return; } const objectUrl = URL.createObjectURL(file); setSrc(objectUrl); return () => { URL.revokeObjectURL(objectUrl); }; }, \[file]); return src; }; const useAttachmentSrc = () => { const { file, src } = useAuiState( useShallow((s): { file?: File; src?: string } => { if (s.attachment.type !== "image") return {}; if (s.attachment.file) return { file: s.attachment.file }; const src = s.attachment.content?.filter((c) => c.type === "image")\[0] ?.image; if (!src) return {}; return { src }; }), ); return useFileSrc(file) ?? src; }; type AttachmentPreviewProps = { src: string; }; const AttachmentPreview: FC\<AttachmentPreviewProps> = ({ src }) => { const \[isLoaded, setIsLoaded] = useState(false); return ( \<img src={src} alt="Attachment preview" className={cn( "block h-auto max-h-\[80vh] w-auto max-w-full object-contain", isLoaded ? "aui-attachment-preview-image-loaded" : "aui-attachment-preview-image-loading invisible", )} onLoad={() => setIsLoaded(true)} /> ); }; const AttachmentPreviewDialog: FC\<PropsWithChildren> = ({ children }) => { const src = useAttachmentSrc(); if (!src) return children; return ( \<Dialog> \<DialogTrigger className="aui-attachment-preview-trigger cursor-pointer transition-colors hover:bg-accent/50" asChild > {children} \</DialogTrigger> \<DialogContent className="aui-attachment-preview-dialog-content p-2 sm:max-w-3xl \[&>button]:rounded-full \[&>button]:bg-foreground/60 \[&>button]:p-1 \[&>button]:opacity-100 \[&>button]:ring-0! \[&\_svg]:text-background \[&>button]:hover:\[&\_svg]:text-destructive"> \<DialogTitle className="aui-sr-only sr-only"> Image Attachment Preview \</DialogTitle> \<div className="aui-attachment-preview relative mx-auto flex max-h-\[80dvh] w-full items-center justify-center overflow-hidden bg-background"> \<AttachmentPreview src={src} /> \</div> \</DialogContent> \</Dialog> ); }; const AttachmentThumb: FC = () => { const src = useAttachmentSrc(); return ( \<Avatar className="aui-attachment-tile-avatar h-full w-full rounded-none"> \<AvatarImage src={src} alt="Attachment preview" className="aui-attachment-tile-image object-cover" /> \<AvatarFallback> \<FileText className="aui-attachment-tile-fallback-icon size-8 text-muted-foreground" /> \</AvatarFallback> \</Avatar> ); }; const AttachmentUI: FC = () => { const aui = useAui(); const isComposer = aui.attachment.source !== "message"; const isImage = useAuiState((s) => s.attachment.type === "image"); const typeLabel = useAuiState((s) => { const type = s.attachment.type; switch (type) { case "image": return "Image"; case "document": return "Document"; case "file": return "File"; default: return type; } }); return ( \<Tooltip> \<AttachmentPrimitive.Root className={cn( "aui-attachment-root relative", isImage && "aui-attachment-root-composer only:\*:first:size-24", )} > \<AttachmentPreviewDialog> \<TooltipTrigger asChild> \<div className="aui-attachment-tile size-14 cursor-pointer overflow-hidden rounded-\[calc(var(--composer-radius)-var(--composer-padding))] border bg-muted transition-opacity hover:opacity-75" role="button" tabIndex={0} aria-label={\`${typeLabel} attachment\`} > \<AttachmentThumb /> \</div> \</TooltipTrigger> \</AttachmentPreviewDialog> {isComposer && \<AttachmentRemove />} \</AttachmentPrimitive.Root> \<TooltipContent side="top"> \<AttachmentPrimitive.Name /> \</TooltipContent> \</Tooltip> ); }; const AttachmentRemove: FC = () => { return ( \<AttachmentPrimitive.Remove asChild> \<TooltipIconButton tooltip="Remove file" className="aui-attachment-tile-remove absolute end-1.5 top-1.5 size-3.5 rounded-full bg-white text-muted-foreground opacity-100 shadow-sm hover:bg-white! \[&\_svg]:text-black hover:\[&\_svg]:text-destructive" side="top" > \<XIcon className="aui-attachment-remove-icon size-3 dark:stroke-\[2.5px]" /> \</TooltipIconButton> \</AttachmentPrimitive.Remove> ); }; export const UserMessageAttachments: FC = () => { return ( \<div className="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2"> \<MessagePrimitive.Attachments> {() => \<AttachmentUI />} \</MessagePrimitive.Attachments> \</div> ); }; export const ComposerAttachments: FC = () => { return ( \<div className="aui-composer-attachments flex w-full flex-row items-center gap-2 overflow-x-auto empty:hidden"> \<ComposerPrimitive.Attachments> {() => \<AttachmentUI />} \</ComposerPrimitive.Attachments> \</div> ); }; export const ComposerAddAttachment: FC = () => { return ( \<ComposerPrimitive.AddAttachment asChild> \<TooltipIconButton tooltip="Add Attachment" side="bottom" variant="ghost" size="icon" className="aui-composer-add-attachment size-8 rounded-full p-1 font-semibold text-xs hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30" aria-label="Add Attachment" > \<PlusIcon className="aui-attachment-add-icon size-5 stroke-\[1.5px]" /> \</TooltipIconButton> \</ComposerPrimitive.AddAttachment> ); };

#### assistant-ui dependencies

- packages

  - radix-ui

* code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

- lang

  tsx

- code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

This adds `/components/assistant-ui/attachment.tsx` to your project.

**Next steps:** Feel free to adjust these auto-generated components (styling, layout, behavior) to match your application's design system.

### [Set up Runtime (No Configuration Required)](#set-up-runtime-no-configuration-required)

For `useChatRuntime`, attachments work automatically without additional configuration:

- title

  /app/MyRuntimeProvider.tsx

`import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; const runtime = useChatRuntime();`

**Note:** The AI SDK runtime handles attachments automatically. For other runtimes like `useLocalRuntime`, you may still need to configure attachment adapters as shown in the

- href

  \#creating-custom-attachment-adapters

Creating Custom Attachment Adapters

section below.

### [Add UI Components](#add-ui-components)

Integrate the attachment components into your chat interface. See

- href

  /docs/ui/attachment

Attachment UI components

for the full install and usage guide.

## [Built-in Attachment Adapters](#built-in-attachment-adapters)

### [AI SDK Runtime (Default)](#ai-sdk-runtime-default)

When using `useChatRuntime`, the built-in adapter accepts all file types and converts them to base64 data URLs. This works well for images and small files.

Most models only support **image** attachments. Sending unsupported file types (audio, video, PDF, etc.) will result in an API error. Check your model provider's documentation for supported input types.

To restrict accepted file types, pass a custom adapter:

`const runtime = useChatRuntime({ adapters: { attachments: new SimpleImageAttachmentAdapter(), // only images }, });`

### [SimpleImageAttachmentAdapter](#simpleimageattachmentadapter)

Handles image files and converts them to data URLs for display in the chat UI.

`const imageAdapter = new SimpleImageAttachmentAdapter(); // Accepts: image/* (JPEG, PNG, GIF, etc.)`

### [SimpleTextAttachmentAdapter](#simpletextattachmentadapter)

Processes text files and wraps content in formatted tags:

`const textAdapter = new SimpleTextAttachmentAdapter(); // Accepts: text/plain, text/html, text/markdown, etc.`

### [CompositeAttachmentAdapter](#compositeattachmentadapter)

Combines multiple adapters to support various file types:

`const compositeAdapter = new CompositeAttachmentAdapter([ new SimpleImageAttachmentAdapter(), new SimpleTextAttachmentAdapter(), ]);`

## [Creating Custom Attachment Adapters](#creating-custom-attachment-adapters)

Build your own adapters for specialized file handling. Below are complete examples for common use cases. For `PendingAttachment` and `CompleteAttachment` type definitions, see

- href

  /docs/ui/attachment#attachment-types

Attachment types

.

### [Vision-Capable Image Adapter](#vision-capable-image-adapter)

Send images to vision-capable LLMs like GPT-5.4, Claude Sonnet 4.6, or Gemini Pro Vision:

`import { AttachmentAdapter, PendingAttachment, CompleteAttachment, } from "@assistant-ui/react"; class VisionImageAdapter implements AttachmentAdapter { accept = "image/jpeg,image/png,image/webp,image/gif"; async add({ file }: { file: File }): Promise<PendingAttachment> { // Validate file size (e.g., 20MB limit for most LLMs) const maxSize = 20 * 1024 * 1024; // 20MB if (file.size > maxSize) { throw new Error("Image size exceeds 20MB limit"); } // Return pending attachment while processing return { id: crypto.randomUUID(), type: "image", name: file.name, file, status: { type: "requires-action", reason: "composer-send" }, }; } async send(attachment: PendingAttachment): Promise<CompleteAttachment> { // Convert image to base64 data URL const base64 = await this.fileToBase64DataURL(attachment.file); // Return in assistant-ui format with image content return { id: attachment.id, type: "image", name: attachment.name, content: [ { type: "image", image: base64, // data:image/jpeg;base64,... format }, ], status: { type: "complete" }, }; } async remove(attachment: PendingAttachment): Promise<void> { // Cleanup if needed (e.g., revoke object URLs if you created any) } private async fileToBase64DataURL(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { // FileReader result is already a data URL resolve(reader.result as string); }; reader.onerror = reject; reader.readAsDataURL(file); }); } }`

### [PDF Document Adapter](#pdf-document-adapter)

Handle PDF files by extracting text or converting to base64 for processing:

``import { AttachmentAdapter, PendingAttachment, CompleteAttachment, } from "@assistant-ui/react"; class PDFAttachmentAdapter implements AttachmentAdapter { accept = "application/pdf"; async add({ file }: { file: File }): Promise<PendingAttachment> { // Validate file size const maxSize = 10 * 1024 * 1024; // 10MB limit if (file.size > maxSize) { throw new Error("PDF size exceeds 10MB limit"); } return { id: crypto.randomUUID(), type: "document", name: file.name, file, status: { type: "requires-action", reason: "composer-send" }, }; } async send(attachment: PendingAttachment): Promise<CompleteAttachment> { // Option 1: Extract text from PDF (requires pdf parsing library) // const text = await this.extractTextFromPDF(attachment.file); // Option 2: Convert to base64 for API processing const base64Data = await this.fileToBase64(attachment.file); return { id: attachment.id, type: "document", name: attachment.name, content: [ { type: "text", text: `[PDF Document: ${attachment.name}]\nBase64 data: ${base64Data.substring(0, 50)}...`, }, ], status: { type: "complete" }, }; } async remove(attachment: PendingAttachment): Promise<void> { // Cleanup if needed } private async fileToBase64(file: File): Promise<string> { const arrayBuffer = await file.arrayBuffer(); const bytes = new Uint8Array(arrayBuffer); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); } // Optional: Extract text from PDF using a library like pdf.js private async extractTextFromPDF(file: File): Promise<string> { // Implementation would use pdf.js or similar // This is a placeholder return "Extracted PDF text content"; } }``

## [Using Custom Adapters](#using-custom-adapters)

### [With LocalRuntime](#with-localruntime)

When using `LocalRuntime`, you need to handle images in your `ChatModelAdapter` (the adapter that connects to your AI backend):

`import { useLocalRuntime, ChatModelAdapter } from "@assistant-ui/react"; // This adapter connects LocalRuntime to your AI backend const MyModelAdapter: ChatModelAdapter = { async run({ messages, abortSignal }) { // Convert messages to format expected by your vision-capable API const formattedMessages = messages.map((msg) => { if ( msg.role === "user" && msg.content.some((part) => part.type === "image") ) { // Format for GPT-5.4 or similar vision models return { role: "user", content: msg.content.map((part) => { if (part.type === "text") { return { type: "text", text: part.text }; } if (part.type === "image") { return { type: "image_url", image_url: { url: part.image }, }; } return part; }), }; } // Regular text messages return { role: msg.role, content: msg.content .filter((c) => c.type === "text") .map((c) => c.text) .join("\n"), }; }); // Send to your vision-capable API const response = await fetch("/api/vision-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: formattedMessages }), signal: abortSignal, }); const data = await response.json(); return { content: [{ type: "text", text: data.message }], }; }, }; // Create runtime with vision image adapter const runtime = useLocalRuntime(MyModelAdapter, { adapters: { attachments: new VisionImageAdapter(), }, });`

## [Advanced Features](#advanced-features)

### [Progress Updates](#progress-updates)

Provide real-time upload progress using async generators:

`class UploadAttachmentAdapter implements AttachmentAdapter { accept = "*"; async *add({ file }: { file: File }) { const id = generateId(); // Initial pending state yield { id, type: "file", name: file.name, file, status: { type: "running", reason: "uploading", progress: 0 }, } as PendingAttachment; // Simulate upload progress for (let progress = 10; progress <= 90; progress += 10) { await new Promise((resolve) => setTimeout(resolve, 100)); yield { id, type: "file", name: file.name, file, status: { type: "running", reason: "uploading", progress }, } as PendingAttachment; } // Yield final progress so the 100% state reaches the composer yield { id, type: "file", name: file.name, file, status: { type: "running", reason: "uploading", progress: 100 }, } as PendingAttachment; } async send(attachment: PendingAttachment): Promise<CompleteAttachment> { // Upload the file and return complete attachment const url = await this.uploadFile(attachment.file); return { id: attachment.id, type: attachment.type, name: attachment.name, content: [ { type: "file", data: url, // or base64 data mimeType: attachment.file.type, }, ], status: { type: "complete" }, }; } async remove(attachment: PendingAttachment): Promise<void> { // Cleanup logic } private async uploadFile(file: File): Promise<string> { // Your upload logic here return "https://example.com/file-url"; } }`

### [Validation and Error Handling](#validation-and-error-handling)

Implement robust validation in your adapters:

`class ValidatedImageAdapter implements AttachmentAdapter { accept = "image/*"; maxSizeBytes = 5 * 1024 * 1024; // 5MB async add({ file }: { file: File }): Promise<PendingAttachment> { // Validate file size if (file.size > this.maxSizeBytes) { return { id: generateId(), type: "image", name: file.name, file, status: { type: "incomplete", reason: "error", }, }; } // Validate image dimensions try { const dimensions = await this.getImageDimensions(file); if (dimensions.width > 4096 || dimensions.height > 4096) { throw new Error("Image dimensions exceed 4096x4096"); } } catch (error) { return { id: generateId(), type: "image", name: file.name, file, status: { type: "incomplete", reason: "error", }, }; } // Return valid attachment return { id: generateId(), type: "image", name: file.name, file, status: { type: "requires-action", reason: "composer-send" }, }; } private async getImageDimensions(file: File) { // Implementation to check image dimensions } }`

To surface failures in the UI, subscribe to `composer.attachmentAddError`. It fires whenever an add operation produces a failure, in either of two ways:

1. `addAttachment()` rejects: no adapter is configured, the file type does not match `accept`, or the adapter's `add()` throws.
2. `addAttachment()` resolves but the adapter returned (or, for async-iterator adapters, yielded) an attachment whose `status.reason === "error"`. The promise resolves successfully, yet the event still fires so the UI can react.

The event payload carries a `reason` discriminator and a human-readable `message`, so you can branch UI on the failure mode:

| `reason`        | When It Fires                                                                                                                                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-adapter`    | `addAttachment(File)` was called but no `AttachmentAdapter` is configured.                                                                                                                                                                                                                |
| `not-accepted`  | The file's content type (or filename extension) did not match `adapter.accept`. External `CreateAttachment` descriptors also trigger this when their `contentType` does not match `adapter.accept`.                                                                                       |
| `adapter-error` | The adapter's `add()` threw, or returned/yielded an attachment with `status.reason === "error"`. If the adapter produced any attachment before failing, the errored attachment is also visible in `composer.attachments`; if it threw before producing one, the event is the only signal. |

`import { toast } from "sonner"; // or your toast library of choice import { useAuiEvent } from "@assistant-ui/react"; function AttachmentErrorToast() { useAuiEvent("composer.attachmentAddError", ({ reason, message, error }) => { if (reason === "not-accepted") { toast.error("This file type is not supported."); } else if (reason === "no-adapter") { toast.error("Attachments are not configured for this composer."); } else { if (error) console.error(error); // underlying Error, useful for logging toast.error(message || "Attachment failed to upload."); } }); return null; }`

`attachmentId` is included when the failure is associated with an attachment that was registered (typically `adapter-error` cases). It is `undefined` for `no-adapter` and `not-accepted` failures because those reject before any attachment is registered.

### [External Source Attachments](#external-source-attachments)

Add attachments from external sources (URLs, API data, CMS references) without needing a `File` object or an `AttachmentAdapter`:

`const aui = useAui(); // Add an attachment from an external source await aui.composer().addAttachment({ name: "report.pdf", contentType: "application/pdf", content: [{ type: "text", text: "Extracted document content..." }], }); // Optionally provide id and type await aui.composer().addAttachment({ id: "cms-doc-123", type: "document", name: "Product Spec", content: [{ type: "text", text: "Product specification content..." }], });`

External attachments are added as complete attachments directly. They bypass the `AttachmentAdapter`'s `add()` step (no upload), but `adapter.accept` is still enforced when an `AttachmentAdapter` is configured: a `CreateAttachment` whose `contentType` does not match `adapter.accept` is rejected and emits `composer.attachmentAddError`. If `contentType` is omitted, the descriptor's filename extension is matched against `adapter.accept` only when `accept` itself contains explicit extension entries (e.g. `.png,.pdf`); MIME-wildcard `accept` strings such as `image/*` always require a matching `contentType`. When no `AttachmentAdapter` is configured, external attachments are added without any content-type check, and they can be removed without an adapter.

### [Multiple File Selection](#multiple-file-selection)

Enable multi-file selection with custom limits:

`const aui = useAui(); const handleMultipleFiles = async (files: FileList) => { const maxFiles = 5; const filesToAdd = Array.from(files).slice(0, maxFiles); for (const file of filesToAdd) { await aui.composer().addAttachment(file); } };`

## [Backend Integration](#backend-integration)

### [With Vercel AI SDK](#with-vercel-ai-sdk)

Attachments are sent to the backend as file content parts.

## [Runtime Support](#runtime-support)

Attachments work with all assistant-ui runtimes:

- **AI SDK Runtime**: `useChatRuntime`
- **External Store**: `useExternalStoreRuntime`
- **LangGraph**: `useLangGraphRuntime`
- **Custom Runtimes**: Any runtime implementing the attachment interface

The attachment system is designed to be extensible. You can create adapters for any file type, integrate with cloud storage services, or implement custom processing logic to fit your specific needs.

## [Large File Uploads](#large-file-uploads)

The built-in adapters convert files to base64 data URLs in memory. For large files (long audio, video, etc.), this can cause performance issues. Instead, upload to a server and pass the URL:

`class ServerUploadAdapter implements AttachmentAdapter { accept = "*"; private urls = new Map<string, string>(); async *add({ file }: { file: File }) { const id = crypto.randomUUID(); yield { id, type: "file" as const, name: file.name, file, contentType: file.type, status: { type: "running" as const, reason: "uploading" as const, progress: 0 }, }; const form = new FormData(); form.append("file", file); const { url } = await fetch("/api/upload", { method: "POST", body: form }).then(r => r.json()); this.urls.set(id, url); yield { id, type: "file" as const, name: file.name, file, contentType: file.type, status: { type: "requires-action" as const, reason: "composer-send" as const }, }; } async send(attachment: PendingAttachment): Promise<CompleteAttachment> { const url = this.urls.get(attachment.id)!; this.urls.delete(attachment.id); return { ...attachment, status: { type: "complete" }, content: [{ type: "file", data: url, mimeType: attachment.contentType ?? "", filename: attachment.name }], }; } async remove() {} }`

- href

  /docs/cloud/ai-sdk-assistant-ui

assistant-ui Cloud

includes `CloudFileAttachmentAdapter` which handles large file uploads via presigned URLs out of the box.

## [Best Practices](#best-practices)

1. **File Size Limits**: Always validate file sizes to prevent memory issues
2. **Type Validation**: Verify file types match your `accept` pattern
3. **Error Handling**: Provide clear error messages for failed uploads
4. **Progress Feedback**: Show upload progress for better UX
5. **Security**: Validate and sanitize file content before processing
6. **Accessibility**: Ensure attachment UI is keyboard navigable

## [Resources](#resources)

- - href

    /docs/ui/attachment

  Attachment UI Components

  \- UI implementation details

- - href

    /docs/api-reference/overview

  API Reference

  \- Detailed type definitions