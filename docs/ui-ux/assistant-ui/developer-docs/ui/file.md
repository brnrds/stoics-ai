# File
URL: /docs/ui/file

Display file message parts with icon, name, size, and download button.

## [Getting Started](#getting-started)

### [Add `file`](#add-file)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/file.json

#### Main Component

- packages

  - @assistant-ui/react
  - class-variance-authority

* code

  "use client"; import { memo, type FC } from "react"; import { cva, type VariantProps } from "class-variance-authority"; import { FileIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon, BracesIcon, DownloadIcon, } from "lucide-react"; import type { FileMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; const fileVariants = cva( "aui-file-root inline-flex items-center gap-3 rounded-lg transition-colors", { variants: { variant: { outline: "border border-border hover:bg-muted/50", ghost: "hover:bg-muted/50", muted: "bg-muted/50 hover:bg-muted/70", }, size: { sm: "px-2.5 py-1.5 text-xs", default: "px-3 py-2 text-sm", lg: "px-4 py-3 text-base", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); function getMimeTypeIcon(mimeType: string): FC<{ className?: string }> { if (mimeType.startsWith("image/")) { return ImageIcon; } if (mimeType === "application/pdf") { return FileTextIcon; } if (mimeType === "application/json") { return BracesIcon; } if (mimeType.startsWith("text/")) { return FileTextIcon; } if (mimeType.startsWith("audio/")) { return MusicIcon; } if (mimeType.startsWith("video/")) { return VideoIcon; } return FileIcon; } function getBase64Size(base64: string): number { const commaIndex = base64.indexOf(","); const base64Data = commaIndex >= 0 ? base64.slice(commaIndex + 1) : base64; const padding = (base64Data.match(/=/g) || \[]).length; return Math.floor((base64Data.length \* 3) / 4) - padding; } function formatFileSize(bytes: number): string { if (bytes < 1024) { return \`${bytes} B\`; } if (bytes < 1024 \* 1024) { return \`${(bytes / 1024).toFixed(1)} KB\`; } return \`${(bytes / (1024 \* 1024)).toFixed(1)} MB\`; } export type FileRootProps = React.ComponentProps<"div"> & VariantProps\<typeof fileVariants>; function FileRoot({ className, variant, size, children, ...props }: FileRootProps) { return ( \<div data-slot="file-root" data-variant={variant} data-size={size} className={cn(fileVariants({ variant, size, className }))} {...props} > {children} \</div> ); } type FileIconDisplayProps = React.ComponentProps<"span"> & { mimeType?: string; }; function FileIconDisplay({ mimeType, className, children, ...props }: FileIconDisplayProps) { const IconComponent = mimeType ? getMimeTypeIcon(mimeType) : FileIcon; return ( \<span data-slot="file-icon" className={cn("shrink-0 text-muted-foreground", className)} {...props} > {children ?? \<IconComponent className="size-5" />} \</span> ); } function FileName({ className, children, ...props }: React.ComponentProps<"span">) { return ( \<span data-slot="file-name" className={cn("min-w-0 flex-1 truncate font-medium", className)} {...props} > {children || "Unnamed file"} \</span> ); } type FileSizeProps = React.ComponentProps<"span"> & { bytes: number; }; function FileSize({ bytes, className, ...props }: FileSizeProps) { return ( \<span data-slot="file-size" className={cn("shrink-0 text-muted-foreground", className)} {...props} > {formatFileSize(bytes)} \</span> ); } type FileDownloadProps = Omit\<React.ComponentProps<"a">, "href"> & { data: string; mimeType: string; filename?: string; }; function FileDownload({ data, mimeType, filename, className, children, ...props }: FileDownloadProps) { const href = data.startsWith("data:") ? data : \`data:${mimeType};base64,${data}\`; return ( \<a data-slot="file-download" href={href} download={filename || "download"} className={cn( "shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", className, )} {...props} > {children || \<DownloadIcon className="size-4" />} \</a> ); } const FileImpl: FileMessagePartComponent = ({ filename, data, mimeType }) => { const bytes = getBase64Size(data); return ( \<FileRoot> \<FileIconDisplay mimeType={mimeType} /> \<div className="flex min-w-0 flex-1 flex-col gap-0.5"> \<FileName>{filename}\</FileName> \<FileSize bytes={bytes} className="text-xs" /> \</div> \<FileDownload data={data} mimeType={mimeType} {...(filename !== undefined && { filename })} /> \</FileRoot> ); }; const File = memo(FileImpl) as unknown as FileMessagePartComponent & { Root: typeof FileRoot; Icon: typeof FileIconDisplay; Name: typeof FileName; Size: typeof FileSize; Download: typeof FileDownload; }; File.displayName = "File"; File.Root = FileRoot; File.Icon = FileIconDisplay; File.Name = FileName; File.Size = FileSize; File.Download = FileDownload; export { File, FileRoot, FileIconDisplay, FileName, FileSize, FileDownload, fileVariants, getMimeTypeIcon, getBase64Size, formatFileSize, };

- lang

  tsx

- code

  "use client"; import { memo, type FC } from "react"; import { cva, type VariantProps } from "class-variance-authority"; import { FileIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon, BracesIcon, DownloadIcon, } from "lucide-react"; import type { FileMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; const fileVariants = cva( "aui-file-root inline-flex items-center gap-3 rounded-lg transition-colors", { variants: { variant: { outline: "border border-border hover:bg-muted/50", ghost: "hover:bg-muted/50", muted: "bg-muted/50 hover:bg-muted/70", }, size: { sm: "px-2.5 py-1.5 text-xs", default: "px-3 py-2 text-sm", lg: "px-4 py-3 text-base", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); function getMimeTypeIcon(mimeType: string): FC<{ className?: string }> { if (mimeType.startsWith("image/")) { return ImageIcon; } if (mimeType === "application/pdf") { return FileTextIcon; } if (mimeType === "application/json") { return BracesIcon; } if (mimeType.startsWith("text/")) { return FileTextIcon; } if (mimeType.startsWith("audio/")) { return MusicIcon; } if (mimeType.startsWith("video/")) { return VideoIcon; } return FileIcon; } function getBase64Size(base64: string): number { const commaIndex = base64.indexOf(","); const base64Data = commaIndex >= 0 ? base64.slice(commaIndex + 1) : base64; const padding = (base64Data.match(/=/g) || \[]).length; return Math.floor((base64Data.length \* 3) / 4) - padding; } function formatFileSize(bytes: number): string { if (bytes < 1024) { return \`${bytes} B\`; } if (bytes < 1024 \* 1024) { return \`${(bytes / 1024).toFixed(1)} KB\`; } return \`${(bytes / (1024 \* 1024)).toFixed(1)} MB\`; } export type FileRootProps = React.ComponentProps<"div"> & VariantProps\<typeof fileVariants>; function FileRoot({ className, variant, size, children, ...props }: FileRootProps) { return ( \<div data-slot="file-root" data-variant={variant} data-size={size} className={cn(fileVariants({ variant, size, className }))} {...props} > {children} \</div> ); } type FileIconDisplayProps = React.ComponentProps<"span"> & { mimeType?: string; }; function FileIconDisplay({ mimeType, className, children, ...props }: FileIconDisplayProps) { const IconComponent = mimeType ? getMimeTypeIcon(mimeType) : FileIcon; return ( \<span data-slot="file-icon" className={cn("shrink-0 text-muted-foreground", className)} {...props} > {children ?? \<IconComponent className="size-5" />} \</span> ); } function FileName({ className, children, ...props }: React.ComponentProps<"span">) { return ( \<span data-slot="file-name" className={cn("min-w-0 flex-1 truncate font-medium", className)} {...props} > {children || "Unnamed file"} \</span> ); } type FileSizeProps = React.ComponentProps<"span"> & { bytes: number; }; function FileSize({ bytes, className, ...props }: FileSizeProps) { return ( \<span data-slot="file-size" className={cn("shrink-0 text-muted-foreground", className)} {...props} > {formatFileSize(bytes)} \</span> ); } type FileDownloadProps = Omit\<React.ComponentProps<"a">, "href"> & { data: string; mimeType: string; filename?: string; }; function FileDownload({ data, mimeType, filename, className, children, ...props }: FileDownloadProps) { const href = data.startsWith("data:") ? data : \`data:${mimeType};base64,${data}\`; return ( \<a data-slot="file-download" href={href} download={filename || "download"} className={cn( "shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", className, )} {...props} > {children || \<DownloadIcon className="size-4" />} \</a> ); } const FileImpl: FileMessagePartComponent = ({ filename, data, mimeType }) => { const bytes = getBase64Size(data); return ( \<FileRoot> \<FileIconDisplay mimeType={mimeType} /> \<div className="flex min-w-0 flex-1 flex-col gap-0.5"> \<FileName>{filename}\</FileName> \<FileSize bytes={bytes} className="text-xs" /> \</div> \<FileDownload data={data} mimeType={mimeType} {...(filename !== undefined && { filename })} /> \</FileRoot> ); }; const File = memo(FileImpl) as unknown as FileMessagePartComponent & { Root: typeof FileRoot; Icon: typeof FileIconDisplay; Name: typeof FileName; Size: typeof FileSize; Download: typeof FileDownload; }; File.displayName = "File"; File.Root = FileRoot; File.Icon = FileIconDisplay; File.Name = FileName; File.Size = FileSize; File.Download = FileDownload; export { File, FileRoot, FileIconDisplay, FileName, FileSize, FileDownload, fileVariants, getMimeTypeIcon, getBase64Size, formatFileSize, };

### [Use in your application](#use-in-your-application)

Pass `File` to `MessagePrimitive.Parts`:

- title

  /components/assistant-ui/thread.tsx

`import { File } from "@/components/assistant-ui/file"; const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root className="..."> <MessagePrimitive.Parts> {({ part }) => { if (part.type === "file") return <File {...part} />; return null; }} </MessagePrimitive.Parts> </MessagePrimitive.Root> ); };`

## [Variants](#variants)

Use the `variant` prop to change the visual style.

`<File.Root variant="outline" /> // Border (default) <File.Root variant="ghost" /> // No border <File.Root variant="muted" /> // Background fill`

## [Sizes](#sizes)

Use the `size` prop to change padding and font size.

`<File.Root size="sm" /> // Compact <File.Root size="default" /> // Default <File.Root size="lg" /> // Larger`

## [MimeType Icons](#mimetype-icons)

The component automatically selects an appropriate icon based on the file's MIME type:

| MIME Type          | Icon         |
| ------------------ | ------------ |
| `image/*`          | ImageIcon    |
| `application/pdf`  | FileTextIcon |
| `application/json` | BracesIcon   |
| `text/*`           | FileTextIcon |
| `audio/*`          | MusicIcon    |
| `video/*`          | VideoIcon    |
| fallback           | FileIcon     |

## [API Reference](#api-reference)

### [Composable API](#composable-api)

The component exports composable sub-components:

`import { File, FileRoot, FileIconDisplay, FileName, FileSize, FileDownload, } from "@/components/assistant-ui/file"; <FileRoot variant="muted" size="lg"> <FileIconDisplay mimeType="application/pdf" /> <div className="flex flex-col gap-0.5"> <FileName>report.pdf</FileName> <FileSize bytes={2048} className="text-xs" /> </div> <FileDownload data="SGVsbG8gV29ybGQh" mimeType="application/pdf" filename="report.pdf" /> </FileRoot>`

| Component       | Description                                     |
| --------------- | ----------------------------------------------- |
| `File`          | Default export, renders complete file part      |
| `File.Root`     | Container with variant and size styling         |
| `File.Icon`     | MIME type-aware icon, or pass custom `children` |
| `File.Name`     | Truncated filename                              |
| `File.Size`     | Human-readable file size                        |
| `File.Download` | Download link button                            |

### [Custom Icon](#custom-icon)

Pass `children` to `File.Icon` to override the default MIME type icon:

`<File.Icon> <MyCustomIcon className="size-5" /> </File.Icon>`

## [Utilities](#utilities)

The component also exports utility functions:

`import { getMimeTypeIcon, getBase64Size, formatFileSize, } from "@/components/assistant-ui/file"; // Get icon component for a MIME type const Icon = getMimeTypeIcon("application/pdf"); // FileTextIcon // Calculate size from base64 string const bytes = getBase64Size("SGVsbG8gV29ybGQh"); // 12 // Format bytes to human-readable const size = formatFileSize(2048); // "2.0 KB"`

## [Related Components](#related-components)

- - href

    /docs/ui/image

  Image

  \- Image message parts

- - href

    /docs/ui/attachment

  Attachment

  \- File attachments in composer and messages