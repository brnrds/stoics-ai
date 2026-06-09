# Attachment
URL: /docs/ui/attachment

UI components for attaching and viewing files in messages.

**Note:** These components provide the UI for attachments, but you also need to configure attachment adapters in your runtime to handle file uploads and processing. See the

- href

  /docs/guides/attachments

Attachments Guide

for complete setup instructions.

## [Getting Started](#getting-started)

### [Add `attachment`](#add-attachment)

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

This adds a `/components/assistant-ui/attachment.tsx` file to your project, which you can adjust as needed.

### [Use in your application](#use-in-your-application)

- title

  /components/assistant-ui/thread.tsx

`import { ComposerAttachments, ComposerAddAttachment, } from "@/components/assistant-ui/attachment"; const Composer: FC = () => { return ( <ComposerPrimitive.Root className="..."> <ComposerAttachments /> <ComposerAddAttachment /> <ComposerPrimitive.Input autoFocus placeholder="Write a message..." rows={1} className="..." /> <ComposerAction /> </ComposerPrimitive.Root> ); };`

- title

  /components/assistant-ui/thread.tsx

`import { UserMessageAttachments } from "@/components/assistant-ui/attachment"; const UserMessage: FC = () => { return ( <MessagePrimitive.Root className="..."> <UserActionBar /> <UserMessageAttachments /> <div className="..."> <MessagePrimitive.Parts /> </div> <BranchPicker className="..." /> </MessagePrimitive.Root> ); };`

## [API Reference](#api-reference)

### [Composer Attachments](#composer-attachments)

#### [ComposerPrimitive.Attachments](#composerprimitiveattachments)

Renders all attachments in the composer.

`ComposerPrimitiveAttachmentsProps`

- `components` `?: AttachmentComponents`

  Components to render for different attachment types.

  - `Image` `?: ComponentType`

    Component for image attachments.

  - `Document` `?: ComponentType`

    Component for document attachments (PDF, etc.).

  - `File` `?: ComponentType`

    Component for generic file attachments.

  - `Attachment` `?: ComponentType`

    Fallback component for all attachment types.

#### [ComposerPrimitive.AddAttachment](#composerprimitiveaddattachment)

A button that opens the file picker to add attachments.

`ComposerPrimitiveAddAttachmentProps`

- `multiple` `: boolean` = true

  Allow selecting multiple files at once.

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

This primitive renders a `<button>` element unless `asChild` is set.

### [Message Attachments](#message-attachments)

#### [MessagePrimitive.Attachments](#messageprimitiveattachments)

Renders all attachments in a user message.

`MessagePrimitiveAttachmentsProps`

- `components` `?: AttachmentComponents`

  Components to render for different attachment types (same as ComposerPrimitive.Attachments).

### [Attachment Primitives](#attachment-primitives)

#### [AttachmentPrimitive.Root](#attachmentprimitiveroot)

Container for a single attachment.

`AttachmentPrimitiveRootProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

#### [AttachmentPrimitive.Name](#attachmentprimitivename)

Renders the attachment's file name.

#### [AttachmentPrimitive.Remove](#attachmentprimitiveremove)

A button to remove the attachment from the composer.

`AttachmentPrimitiveRemoveProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [Attachment Types](#attachment-types)

Attachments have the following structure:

`type Attachment = { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string; file?: File; status: | { type: "running" | "requires-action" | "incomplete"; progress?: number } | { type: "complete" }; };`

The `type` field accepts custom strings (e.g. `"data-workflow"`) beyond the built-in types. When an unknown type is encountered, the generic `Attachment` component is used as a fallback. The `contentType` field is optional — it can be omitted for non-file attachments where a MIME type is not meaningful.

## [Related Components](#related-components)

- - href

    /docs/ui/thread

  Thread

  \- Main chat interface that displays attachments

- - href

    /docs/guides/attachments

  Attachments Guide

  \- Complete setup instructions for attachment adapters