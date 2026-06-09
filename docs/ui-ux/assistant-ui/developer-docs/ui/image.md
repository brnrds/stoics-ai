# Image
URL: /docs/ui/image

Display image message parts with preview, loading states, and fullscreen dialog.

## [Getting Started](#getting-started)

### [Add `image`](#add-image)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/image.json

#### Main Component

- packages

  - @assistant-ui/react
  - class-variance-authority

* code

  "use client"; import { memo, useState, useEffect, useRef, type PropsWithChildren, } from "react"; import { createPortal } from "react-dom"; import { cva, type VariantProps } from "class-variance-authority"; import { ImageIcon, ImageOffIcon } from "lucide-react"; import type { ImageMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; const imageVariants = cva( "aui-image-root relative overflow-hidden rounded-lg", { variants: { variant: { outline: "border border-border", ghost: "", muted: "bg-muted/50", }, size: { sm: "max-w-64", default: "max-w-96", lg: "max-w-\[512px]", full: "w-full", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type ImageRootProps = React.ComponentProps<"div"> & VariantProps\<typeof imageVariants>; function ImageRoot({ className, variant, size, children, ...props }: ImageRootProps) { return ( \<div data-slot="image-root" data-variant={variant} data-size={size} className={cn(imageVariants({ variant, size, className }))} {...props} > {children} \</div> ); } type ImagePreviewProps = Omit\<React.ComponentProps<"img">, "children"> & { containerClassName?: string; }; function ImagePreview({ className, containerClassName, onLoad, onError, alt = "Image content", src, ...props }: ImagePreviewProps) { const imgRef = useRef\<HTMLImageElement>(null); const \[loadedSrc, setLoadedSrc] = useState\<string | undefined>(undefined); const \[errorSrc, setErrorSrc] = useState\<string | undefined>(undefined); const loaded = loadedSrc === src; const error = errorSrc === src; useEffect(() => { if ( typeof src === "string" && imgRef.current?.complete && imgRef.current.naturalWidth > 0 ) { setLoadedSrc(src); } }, \[src]); return ( \<div data-slot="image-preview" className={cn("relative min-h-32", containerClassName)} > {!loaded && !error && ( \<div data-slot="image-preview-loading" className="absolute inset-0 flex items-center justify-center bg-muted/50" > \<ImageIcon className="size-8 animate-pulse text-muted-foreground" /> \</div> )} {error ? ( \<div data-slot="image-preview-error" className="flex min-h-32 items-center justify-center bg-muted/50 p-4" > \<ImageOffIcon className="size-8 text-muted-foreground" /> \</div> ) : ( \<img ref={imgRef} src={src} alt={alt} className={cn( "block h-auto w-full object-contain", !loaded && "invisible", className, )} onLoad={(e) => { if (typeof src === "string") setLoadedSrc(src); onLoad?.(e); }} onError={(e) => { if (typeof src === "string") setErrorSrc(src); onError?.(e); }} {...props} /> )} \</div> ); } function ImageFilename({ className, children, ...props }: React.ComponentProps<"span">) { if (!children) return null; return ( \<span data-slot="image-filename" className={cn( "block truncate px-2 py-1.5 text-muted-foreground text-xs", className, )} {...props} > {children} \</span> ); } type ImageZoomProps = PropsWithChildren<{ src: string; alt?: string; }>; function ImageZoom({ src, alt = "Image preview", children }: ImageZoomProps) { const \[isMounted, setIsMounted] = useState(false); const \[isOpen, setIsOpen] = useState(false); useEffect(() => { setIsMounted(true); }, \[]); const handleOpen = () => setIsOpen(true); const handleClose = () => setIsOpen(false); useEffect(() => { if (!isOpen) return; const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); }; document.addEventListener("keydown", handleKeyDown); return () => document.removeEventListener("keydown", handleKeyDown); }, \[isOpen]); useEffect(() => { if (!isOpen) return; const originalOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = originalOverflow; }; }, \[isOpen]); return ( <> \<div onClick={handleOpen} onKeyDown={(e) => e.key === "Enter" && handleOpen()} role="button" tabIndex={0} className="aui-image-zoom-trigger cursor-zoom-in" aria-label="Click to zoom image" > {children} \</div> {isMounted && isOpen && createPortal( \<div data-slot="image-zoom-overlay" role="button" tabIndex={0} className="aui-image-zoom-overlay fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 duration-200" onClick={handleClose} onKeyDown={(e) => e.key === "Enter" && handleClose()} aria-label="Close zoomed image" > {/\* biome-ignore lint/a11y/useKeyWithClickEvents: parent handles keyboard events \*/} \<img data-slot="image-zoom-content" src={src} alt={alt} className="aui-image-zoom-content fade-in zoom-in-95 max-h-\[90vh] max-w-\[90vw] animate-in cursor-zoom-out object-contain duration-200" onClick={(e) => { e.stopPropagation(); handleClose(); }} /> \</div>, document.body, )} \</> ); } const ImageImpl: ImageMessagePartComponent = ({ image, filename }) => { return ( \<ImageRoot> \<ImageZoom src={image} alt={filename || "Image content"}> \<ImagePreview src={image} alt={filename || "Image content"} /> \</ImageZoom> \<ImageFilename>{filename}\</ImageFilename> \</ImageRoot> ); }; const Image = memo(ImageImpl) as unknown as ImageMessagePartComponent & { Root: typeof ImageRoot; Preview: typeof ImagePreview; Filename: typeof ImageFilename; Zoom: typeof ImageZoom; }; Image.displayName = "Image"; Image.Root = ImageRoot; Image.Preview = ImagePreview; Image.Filename = ImageFilename; Image.Zoom = ImageZoom; export { Image, ImageRoot, ImagePreview, ImageFilename, ImageZoom, imageVariants, };

- lang

  tsx

- code

  "use client"; import { memo, useState, useEffect, useRef, type PropsWithChildren, } from "react"; import { createPortal } from "react-dom"; import { cva, type VariantProps } from "class-variance-authority"; import { ImageIcon, ImageOffIcon } from "lucide-react"; import type { ImageMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; const imageVariants = cva( "aui-image-root relative overflow-hidden rounded-lg", { variants: { variant: { outline: "border border-border", ghost: "", muted: "bg-muted/50", }, size: { sm: "max-w-64", default: "max-w-96", lg: "max-w-\[512px]", full: "w-full", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type ImageRootProps = React.ComponentProps<"div"> & VariantProps\<typeof imageVariants>; function ImageRoot({ className, variant, size, children, ...props }: ImageRootProps) { return ( \<div data-slot="image-root" data-variant={variant} data-size={size} className={cn(imageVariants({ variant, size, className }))} {...props} > {children} \</div> ); } type ImagePreviewProps = Omit\<React.ComponentProps<"img">, "children"> & { containerClassName?: string; }; function ImagePreview({ className, containerClassName, onLoad, onError, alt = "Image content", src, ...props }: ImagePreviewProps) { const imgRef = useRef\<HTMLImageElement>(null); const \[loadedSrc, setLoadedSrc] = useState\<string | undefined>(undefined); const \[errorSrc, setErrorSrc] = useState\<string | undefined>(undefined); const loaded = loadedSrc === src; const error = errorSrc === src; useEffect(() => { if ( typeof src === "string" && imgRef.current?.complete && imgRef.current.naturalWidth > 0 ) { setLoadedSrc(src); } }, \[src]); return ( \<div data-slot="image-preview" className={cn("relative min-h-32", containerClassName)} > {!loaded && !error && ( \<div data-slot="image-preview-loading" className="absolute inset-0 flex items-center justify-center bg-muted/50" > \<ImageIcon className="size-8 animate-pulse text-muted-foreground" /> \</div> )} {error ? ( \<div data-slot="image-preview-error" className="flex min-h-32 items-center justify-center bg-muted/50 p-4" > \<ImageOffIcon className="size-8 text-muted-foreground" /> \</div> ) : ( \<img ref={imgRef} src={src} alt={alt} className={cn( "block h-auto w-full object-contain", !loaded && "invisible", className, )} onLoad={(e) => { if (typeof src === "string") setLoadedSrc(src); onLoad?.(e); }} onError={(e) => { if (typeof src === "string") setErrorSrc(src); onError?.(e); }} {...props} /> )} \</div> ); } function ImageFilename({ className, children, ...props }: React.ComponentProps<"span">) { if (!children) return null; return ( \<span data-slot="image-filename" className={cn( "block truncate px-2 py-1.5 text-muted-foreground text-xs", className, )} {...props} > {children} \</span> ); } type ImageZoomProps = PropsWithChildren<{ src: string; alt?: string; }>; function ImageZoom({ src, alt = "Image preview", children }: ImageZoomProps) { const \[isMounted, setIsMounted] = useState(false); const \[isOpen, setIsOpen] = useState(false); useEffect(() => { setIsMounted(true); }, \[]); const handleOpen = () => setIsOpen(true); const handleClose = () => setIsOpen(false); useEffect(() => { if (!isOpen) return; const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); }; document.addEventListener("keydown", handleKeyDown); return () => document.removeEventListener("keydown", handleKeyDown); }, \[isOpen]); useEffect(() => { if (!isOpen) return; const originalOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = originalOverflow; }; }, \[isOpen]); return ( <> \<div onClick={handleOpen} onKeyDown={(e) => e.key === "Enter" && handleOpen()} role="button" tabIndex={0} className="aui-image-zoom-trigger cursor-zoom-in" aria-label="Click to zoom image" > {children} \</div> {isMounted && isOpen && createPortal( \<div data-slot="image-zoom-overlay" role="button" tabIndex={0} className="aui-image-zoom-overlay fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 duration-200" onClick={handleClose} onKeyDown={(e) => e.key === "Enter" && handleClose()} aria-label="Close zoomed image" > {/\* biome-ignore lint/a11y/useKeyWithClickEvents: parent handles keyboard events \*/} \<img data-slot="image-zoom-content" src={src} alt={alt} className="aui-image-zoom-content fade-in zoom-in-95 max-h-\[90vh] max-w-\[90vw] animate-in cursor-zoom-out object-contain duration-200" onClick={(e) => { e.stopPropagation(); handleClose(); }} /> \</div>, document.body, )} \</> ); } const ImageImpl: ImageMessagePartComponent = ({ image, filename }) => { return ( \<ImageRoot> \<ImageZoom src={image} alt={filename || "Image content"}> \<ImagePreview src={image} alt={filename || "Image content"} /> \</ImageZoom> \<ImageFilename>{filename}\</ImageFilename> \</ImageRoot> ); }; const Image = memo(ImageImpl) as unknown as ImageMessagePartComponent & { Root: typeof ImageRoot; Preview: typeof ImagePreview; Filename: typeof ImageFilename; Zoom: typeof ImageZoom; }; Image.displayName = "Image"; Image.Root = ImageRoot; Image.Preview = ImagePreview; Image.Filename = ImageFilename; Image.Zoom = ImageZoom; export { Image, ImageRoot, ImagePreview, ImageFilename, ImageZoom, imageVariants, };

### [Use in your application](#use-in-your-application)

Pass `Image` to `MessagePrimitive.Parts`:

- title

  /components/assistant-ui/thread.tsx

`import { Image } from "@/components/assistant-ui/image"; const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root className="..."> <MessagePrimitive.Parts> {({ part }) => { if (part.type === "image") return <Image {...part} />; return null; }} </MessagePrimitive.Parts> </MessagePrimitive.Root> ); };`

## [Variants](#variants)

Use the `variant` prop to change the visual style.

`<Image.Root variant="outline" /> // Border (default) <Image.Root variant="ghost" /> // No border <Image.Root variant="muted" /> // Background fill`

## [Sizes](#sizes)

Use the `size` prop to control the maximum width.

`<Image.Root size="sm" /> // max-w-64 (256px) <Image.Root size="default" /> // max-w-96 (384px) <Image.Root size="lg" /> // max-w-[512px] <Image.Root size="full" /> // w-full`

## [API Reference](#api-reference)

### [Composable API](#composable-api)

The component exports composable sub-components:

`import { Image, ImageRoot, ImagePreview, ImageFilename, ImageZoom, } from "@/components/assistant-ui/image"; <ImageRoot variant="muted" size="lg"> <ImageZoom src="https://example.com/photo.jpg" alt="Photo"> <ImagePreview src="https://example.com/photo.jpg" alt="Photo" /> </ImageZoom> <ImageFilename>photo.jpg</ImageFilename> </ImageRoot>`

| Component        | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `Image`          | Default export, renders complete image part               |
| `Image.Root`     | Container with variant and size styling                   |
| `Image.Preview`  | Image container with loading/error states                 |
| `Image.Filename` | Optional filename display below image                     |
| `Image.Zoom`     | Medium-style zoom overlay (click to expand, ESC to close) |

## [Related Components](#related-components)

- - href

    /docs/ui/attachment

  Attachment

  \- File attachments in composer and messages

- - href

    /docs/ui/file

  File

  \- Non-image file message parts