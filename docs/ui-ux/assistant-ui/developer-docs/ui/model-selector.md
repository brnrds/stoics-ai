# ModelSelector
URL: /docs/ui/model-selector

Model picker with unified overlay positioning and runtime integration.

A select component that lets users switch between AI models. Uses item-aligned positioning so the selected model overlays the trigger for a unified look. Integrates with assistant-ui's `ModelContext` system to automatically propagate the selected model to your backend.

## [Getting Started](#getting-started)

### [Add `model-selector`](#add-model-selector)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/model-selector.json

#### Main Component

- packages

  - @assistant-ui/react
  - class-variance-authority
  - radix-ui

* code

  "use client"; import { memo, useState, useEffect, createContext, useContext, type ComponentPropsWithoutRef, type ReactNode, } from "react"; import { Select as SelectPrimitive } from "radix-ui"; import type { VariantProps } from "class-variance-authority"; import { CheckIcon } from "lucide-react"; import { useAui } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; import { SelectRoot, SelectTrigger, SelectContent, type SelectItem, type selectTriggerVariants, } from "@/components/assistant-ui/select"; export type ModelOption = { id: string; name: string; description?: string; icon?: ReactNode; disabled?: boolean; }; type ModelSelectorContextValue = { models: ModelOption\[]; value: string | undefined; }; const ModelSelectorContext = createContext\<ModelSelectorContextValue | null>( null, ); function useModelSelectorContext() { const ctx = useContext(ModelSelectorContext); if (!ctx) { throw new Error( "ModelSelector sub-components must be used within ModelSelector.Root", ); } return ctx; } export type ModelSelectorRootProps = { models: ModelOption\[]; value?: string; onValueChange?: (value: string) => void; defaultValue?: string; open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; children: ReactNode; }; function ModelSelectorRoot({ models, defaultValue: defaultValueProp, children, value, ...selectProps }: ModelSelectorRootProps) { const defaultValue = defaultValueProp ?? models\[0]?.id; return ( \<ModelSelectorContext.Provider value={{ models, value }}> \<SelectRoot {...(defaultValue !== undefined ? { defaultValue } : undefined)} {...(value !== undefined ? { value } : undefined)} {...selectProps} > {children} \</SelectRoot> \</ModelSelectorContext.Provider> ); } export type ModelSelectorTriggerProps = ComponentPropsWithoutRef< typeof SelectTrigger >; function ModelSelectorTrigger({ className, variant, size, children, ...props }: ModelSelectorTriggerProps) { return ( \<SelectTrigger data-slot="model-selector-trigger" variant={variant} size={size} className={cn("aui-model-selector-trigger", className)} {...props} > {children ?? \<ModelSelectorValue />} \</SelectTrigger> ); } /\*\* \* Renders the selected model display in the trigger. \* \* Bypasses Radix Select.Value to avoid the empty-on-SSR issue caused by \* Select items living inside a Portal (not rendered server-side). \* Falls back to Select.Value for uncontrolled (defaultValue-only) usage. \*/ function ModelSelectorValue() { const { models, value } = useModelSelectorContext(); const selectedModel = value != null ? models.find((m) => m.id === value) : undefined; if (!selectedModel) { return \<SelectPrimitive.Value />; } return ( \<span> \<span className="flex items-center gap-2"> {selectedModel.icon && ( \<span className="flex size-4 shrink-0 items-center justify-center \[&\_svg]:size-4"> {selectedModel.icon} \</span> )} \<span className="truncate font-medium">{selectedModel.name}\</span> \</span> \</span> ); } export type ModelSelectorContentProps = ComponentPropsWithoutRef< typeof SelectContent >; function ModelSelectorContent({ className, children, ...props }: ModelSelectorContentProps) { const { models } = useModelSelectorContext(); return ( \<SelectContent data-slot="model-selector-content" className={cn("min-w-\[180px]", className)} {...props} > {children ?? models.map((model) => ( \<ModelSelectorItem key={model.id} model={model} {...(model.disabled ? { disabled: true } : undefined)} /> ))} \</SelectContent> ); } export type ModelSelectorItemProps = Omit< ComponentPropsWithoutRef\<typeof SelectItem>, "value" | "children" > & { model: ModelOption; }; function ModelSelectorItem({ model, className, ...props }: ModelSelectorItemProps) { return ( \<SelectPrimitive.Item data-slot="model-selector-item" value={model.id} textValue={model.name} className={cn( "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 ps-3 pe-9 text-sm outline-none", "focus:bg-accent focus:text-accent-foreground", "data-\[disabled]:pointer-events-none data-\[disabled]:opacity-50", className, )} {...props} > \<span className="absolute end-3 flex size-4 items-center justify-center"> \<SelectPrimitive.ItemIndicator> \<CheckIcon className="size-4" /> \</SelectPrimitive.ItemIndicator> \</span> \<SelectPrimitive.ItemText> \<span className="flex items-center gap-2"> {model.icon && ( \<span className="flex size-4 shrink-0 items-center justify-center \[&\_svg]:size-4"> {model.icon} \</span> )} \<span className="truncate font-medium">{model.name}\</span> \</span> \</SelectPrimitive.ItemText> {model.description && ( \<span className="truncate text-muted-foreground text-xs"> {model.description} \</span> )} \</SelectPrimitive.Item> ); } export type ModelSelectorProps = Omit\<ModelSelectorRootProps, "children"> & VariantProps\<typeof selectTriggerVariants> & { contentClassName?: string; }; const ModelSelectorImpl = ({ value: controlledValue, onValueChange: controlledOnValueChange, defaultValue, models, variant, size, contentClassName, ...forwardedProps }: ModelSelectorProps) => { const isControlled = controlledValue !== undefined; const \[internalValue, setInternalValue] = useState( () => defaultValue ?? models\[0]?.id ?? "", ); const value = isControlled ? controlledValue : internalValue; const onValueChange = controlledOnValueChange ?? setInternalValue; const api = useAui(); useEffect(() => { const config = { config: { modelName: value } }; return api.modelContext().register({ getModelContext: () => config, }); }, \[api, value]); return ( \<ModelSelectorRoot models={models} value={value} onValueChange={onValueChange} {...forwardedProps} > \<ModelSelectorTrigger variant={variant} size={size} /> \<ModelSelectorContent className={contentClassName} /> \</ModelSelectorRoot> ); }; type ModelSelectorComponent = typeof ModelSelectorImpl & { displayName?: string; Root: typeof ModelSelectorRoot; Trigger: typeof ModelSelectorTrigger; Content: typeof ModelSelectorContent; Item: typeof ModelSelectorItem; Value: typeof ModelSelectorValue; }; const ModelSelector = memo( ModelSelectorImpl, ) as unknown as ModelSelectorComponent; ModelSelector.displayName = "ModelSelector"; ModelSelector.Root = ModelSelectorRoot; ModelSelector.Trigger = ModelSelectorTrigger; ModelSelector.Content = ModelSelectorContent; ModelSelector.Item = ModelSelectorItem; ModelSelector.Value = ModelSelectorValue; export { ModelSelector, ModelSelectorRoot, ModelSelectorTrigger, ModelSelectorContent, ModelSelectorItem, ModelSelectorValue, };

- lang

  tsx

- code

  "use client"; import { memo, useState, useEffect, createContext, useContext, type ComponentPropsWithoutRef, type ReactNode, } from "react"; import { Select as SelectPrimitive } from "radix-ui"; import type { VariantProps } from "class-variance-authority"; import { CheckIcon } from "lucide-react"; import { useAui } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; import { SelectRoot, SelectTrigger, SelectContent, type SelectItem, type selectTriggerVariants, } from "@/components/assistant-ui/select"; export type ModelOption = { id: string; name: string; description?: string; icon?: ReactNode; disabled?: boolean; }; type ModelSelectorContextValue = { models: ModelOption\[]; value: string | undefined; }; const ModelSelectorContext = createContext\<ModelSelectorContextValue | null>( null, ); function useModelSelectorContext() { const ctx = useContext(ModelSelectorContext); if (!ctx) { throw new Error( "ModelSelector sub-components must be used within ModelSelector.Root", ); } return ctx; } export type ModelSelectorRootProps = { models: ModelOption\[]; value?: string; onValueChange?: (value: string) => void; defaultValue?: string; open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; children: ReactNode; }; function ModelSelectorRoot({ models, defaultValue: defaultValueProp, children, value, ...selectProps }: ModelSelectorRootProps) { const defaultValue = defaultValueProp ?? models\[0]?.id; return ( \<ModelSelectorContext.Provider value={{ models, value }}> \<SelectRoot {...(defaultValue !== undefined ? { defaultValue } : undefined)} {...(value !== undefined ? { value } : undefined)} {...selectProps} > {children} \</SelectRoot> \</ModelSelectorContext.Provider> ); } export type ModelSelectorTriggerProps = ComponentPropsWithoutRef< typeof SelectTrigger >; function ModelSelectorTrigger({ className, variant, size, children, ...props }: ModelSelectorTriggerProps) { return ( \<SelectTrigger data-slot="model-selector-trigger" variant={variant} size={size} className={cn("aui-model-selector-trigger", className)} {...props} > {children ?? \<ModelSelectorValue />} \</SelectTrigger> ); } /\*\* \* Renders the selected model display in the trigger. \* \* Bypasses Radix Select.Value to avoid the empty-on-SSR issue caused by \* Select items living inside a Portal (not rendered server-side). \* Falls back to Select.Value for uncontrolled (defaultValue-only) usage. \*/ function ModelSelectorValue() { const { models, value } = useModelSelectorContext(); const selectedModel = value != null ? models.find((m) => m.id === value) : undefined; if (!selectedModel) { return \<SelectPrimitive.Value />; } return ( \<span> \<span className="flex items-center gap-2"> {selectedModel.icon && ( \<span className="flex size-4 shrink-0 items-center justify-center \[&\_svg]:size-4"> {selectedModel.icon} \</span> )} \<span className="truncate font-medium">{selectedModel.name}\</span> \</span> \</span> ); } export type ModelSelectorContentProps = ComponentPropsWithoutRef< typeof SelectContent >; function ModelSelectorContent({ className, children, ...props }: ModelSelectorContentProps) { const { models } = useModelSelectorContext(); return ( \<SelectContent data-slot="model-selector-content" className={cn("min-w-\[180px]", className)} {...props} > {children ?? models.map((model) => ( \<ModelSelectorItem key={model.id} model={model} {...(model.disabled ? { disabled: true } : undefined)} /> ))} \</SelectContent> ); } export type ModelSelectorItemProps = Omit< ComponentPropsWithoutRef\<typeof SelectItem>, "value" | "children" > & { model: ModelOption; }; function ModelSelectorItem({ model, className, ...props }: ModelSelectorItemProps) { return ( \<SelectPrimitive.Item data-slot="model-selector-item" value={model.id} textValue={model.name} className={cn( "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 ps-3 pe-9 text-sm outline-none", "focus:bg-accent focus:text-accent-foreground", "data-\[disabled]:pointer-events-none data-\[disabled]:opacity-50", className, )} {...props} > \<span className="absolute end-3 flex size-4 items-center justify-center"> \<SelectPrimitive.ItemIndicator> \<CheckIcon className="size-4" /> \</SelectPrimitive.ItemIndicator> \</span> \<SelectPrimitive.ItemText> \<span className="flex items-center gap-2"> {model.icon && ( \<span className="flex size-4 shrink-0 items-center justify-center \[&\_svg]:size-4"> {model.icon} \</span> )} \<span className="truncate font-medium">{model.name}\</span> \</span> \</SelectPrimitive.ItemText> {model.description && ( \<span className="truncate text-muted-foreground text-xs"> {model.description} \</span> )} \</SelectPrimitive.Item> ); } export type ModelSelectorProps = Omit\<ModelSelectorRootProps, "children"> & VariantProps\<typeof selectTriggerVariants> & { contentClassName?: string; }; const ModelSelectorImpl = ({ value: controlledValue, onValueChange: controlledOnValueChange, defaultValue, models, variant, size, contentClassName, ...forwardedProps }: ModelSelectorProps) => { const isControlled = controlledValue !== undefined; const \[internalValue, setInternalValue] = useState( () => defaultValue ?? models\[0]?.id ?? "", ); const value = isControlled ? controlledValue : internalValue; const onValueChange = controlledOnValueChange ?? setInternalValue; const api = useAui(); useEffect(() => { const config = { config: { modelName: value } }; return api.modelContext().register({ getModelContext: () => config, }); }, \[api, value]); return ( \<ModelSelectorRoot models={models} value={value} onValueChange={onValueChange} {...forwardedProps} > \<ModelSelectorTrigger variant={variant} size={size} /> \<ModelSelectorContent className={contentClassName} /> \</ModelSelectorRoot> ); }; type ModelSelectorComponent = typeof ModelSelectorImpl & { displayName?: string; Root: typeof ModelSelectorRoot; Trigger: typeof ModelSelectorTrigger; Content: typeof ModelSelectorContent; Item: typeof ModelSelectorItem; Value: typeof ModelSelectorValue; }; const ModelSelector = memo( ModelSelectorImpl, ) as unknown as ModelSelectorComponent; ModelSelector.displayName = "ModelSelector"; ModelSelector.Root = ModelSelectorRoot; ModelSelector.Trigger = ModelSelectorTrigger; ModelSelector.Content = ModelSelectorContent; ModelSelector.Item = ModelSelectorItem; ModelSelector.Value = ModelSelectorValue; export { ModelSelector, ModelSelectorRoot, ModelSelectorTrigger, ModelSelectorContent, ModelSelectorItem, ModelSelectorValue, };

#### assistant-ui dependencies

- packages

  - class-variance-authority
  - radix-ui

* code

  "use client"; import type { ComponentPropsWithoutRef, ReactNode } from "react"; import { Select as SelectPrimitive } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"; import { cn } from "@/lib/utils"; const SelectRoot = SelectPrimitive.Root; const SelectGroup = SelectPrimitive.Group; const SelectValue = SelectPrimitive.Value; const selectTriggerVariants = cva( "flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-\[placeholder]:text-muted-foreground \[&>span]:line-clamp-1 \[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground", ghost: "hover:bg-accent hover:text-accent-foreground", muted: "bg-secondary text-secondary-foreground hover:bg-secondary/80", }, size: { default: "h-9 px-3 py-2", sm: "h-8 px-2.5 py-1.5 text-xs", lg: "h-10 px-4 py-2.5", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); const SelectTrigger = ({ className, variant, size, children, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Trigger> & VariantProps\<typeof selectTriggerVariants>) => ( \<SelectPrimitive.Trigger data-slot="select-trigger" data-variant={variant ?? "outline"} data-size={size ?? "default"} className={cn(selectTriggerVariants({ variant, size }), className)} {...props} > {children} \<SelectPrimitive.Icon asChild> \<ChevronDownIcon className="size-4 opacity-50" /> \</SelectPrimitive.Icon> \</SelectPrimitive.Trigger> ); const SelectScrollUpButton = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.ScrollUpButton>) => ( \<SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn( "flex cursor-default items-center justify-center py-1", className, )} {...props} > \<ChevronUpIcon className="size-4" /> \</SelectPrimitive.ScrollUpButton> ); const SelectScrollDownButton = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.ScrollDownButton>) => ( \<SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn( "flex cursor-default items-center justify-center py-1", className, )} {...props} > \<ChevronDownIcon className="size-4" /> \</SelectPrimitive.ScrollDownButton> ); const SelectContent = ({ className, children, position = "popper", ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Content>) => ( \<SelectPrimitive.Portal> \<SelectPrimitive.Content data-slot="select-content" position={position} sideOffset={6} className={cn( "relative z-50 max-h-96 min-w-\[8rem] overflow-hidden rounded-xl border bg-popover/95 p-1.5 text-popover-foreground shadow-lg backdrop-blur-sm", "data-\[state=open]:fade-in-0 data-\[state=open]:zoom-in-95 data-\[state=open]:animate-in", "data-\[state=closed]:fade-out-0 data-\[state=closed]:zoom-out-95 data-\[state=closed]:animate-out", "data-\[side=bottom]:slide-in-from-top-2 data-\[side=left]:slide-in-from-right-2 data-\[side=right]:slide-in-from-left-2 data-\[side=top]:slide-in-from-bottom-2", position === "popper" && "data-\[side=left]:-translate-x-1 data-\[side=right]:translate-x-1 data-\[side=bottom]:translate-y-1 data-\[side=top]:-translate-y-1 rtl:data-\[side=left]:translate-x-1 rtl:data-\[side=right]:-translate-x-1", className, )} {...props} > \<SelectScrollUpButton /> \<SelectPrimitive.Viewport className={cn( position === "popper" && "h-\[var(--radix-select-trigger-height)] w-full min-w-\[var(--radix-select-trigger-width)] scroll-my-1", )} > {children} \</SelectPrimitive.Viewport> \<SelectScrollDownButton /> \</SelectPrimitive.Content> \</SelectPrimitive.Portal> ); const SelectLabel = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Label>) => ( \<SelectPrimitive.Label data-slot="select-label" className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)} {...props} /> ); const SelectItem = ({ className, children, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Item>) => ( \<SelectPrimitive.Item data-slot="select-item" className={cn( "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 ps-3 pe-9 text-sm outline-none", "focus:bg-accent focus:text-accent-foreground", "data-\[disabled]:pointer-events-none data-\[disabled]:opacity-50", "\[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", className, )} {...props} > \<span className="absolute end-3 flex size-4 items-center justify-center"> \<SelectPrimitive.ItemIndicator> \<CheckIcon className="size-4" /> \</SelectPrimitive.ItemIndicator> \</span> \<SelectPrimitive.ItemText>{children}\</SelectPrimitive.ItemText> \</SelectPrimitive.Item> ); const SelectSeparator = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Separator>) => ( \<SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} /> ); export interface SelectOption { value: string; label: ReactNode; textValue?: string; disabled?: boolean; } export interface SelectProps extends Pick< ComponentPropsWithoutRef\<typeof SelectPrimitive.Root>, "value" | "onValueChange" | "disabled" > { value: string; onValueChange: (value: string) => void; options: readonly SelectOption\[]; placeholder?: string; className?: string; } function Select({ options, placeholder, className, ...props }: SelectProps) { const selectedOption = options.find((opt) => opt.value === props.value); return ( \<SelectRoot {...props}> \<SelectPrimitive.Trigger className={cn( "flex items-center gap-1.5 rounded-md py-1 ps-3 pe-2 text-sm outline-none transition-colors", "text-muted-foreground hover:bg-muted hover:text-foreground", "focus-visible:ring-2 focus-visible:ring-ring/50", "disabled:cursor-not-allowed disabled:opacity-50", !selectedOption && placeholder && "italic opacity-70", className, )} > \<span>{selectedOption?.label ?? placeholder}\</span> \<ChevronDownIcon className="size-3.5 opacity-50" /> \</SelectPrimitive.Trigger> \<SelectContent> {options.map(({ label, disabled, textValue, ...itemProps }) => ( \<SelectItem key={itemProps.value} {...itemProps} {...(disabled !== undefined ? { disabled } : {})} textValue={ textValue ?? (typeof label === "string" ? label : itemProps.value) } > {label} \</SelectItem> ))} \</SelectContent> \</SelectRoot> ); } export { Select, SelectRoot, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, selectTriggerVariants, };

- lang

  tsx

- code

  "use client"; import type { ComponentPropsWithoutRef, ReactNode } from "react"; import { Select as SelectPrimitive } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"; import { cn } from "@/lib/utils"; const SelectRoot = SelectPrimitive.Root; const SelectGroup = SelectPrimitive.Group; const SelectValue = SelectPrimitive.Value; const selectTriggerVariants = cva( "flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-\[placeholder]:text-muted-foreground \[&>span]:line-clamp-1 \[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground", ghost: "hover:bg-accent hover:text-accent-foreground", muted: "bg-secondary text-secondary-foreground hover:bg-secondary/80", }, size: { default: "h-9 px-3 py-2", sm: "h-8 px-2.5 py-1.5 text-xs", lg: "h-10 px-4 py-2.5", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); const SelectTrigger = ({ className, variant, size, children, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Trigger> & VariantProps\<typeof selectTriggerVariants>) => ( \<SelectPrimitive.Trigger data-slot="select-trigger" data-variant={variant ?? "outline"} data-size={size ?? "default"} className={cn(selectTriggerVariants({ variant, size }), className)} {...props} > {children} \<SelectPrimitive.Icon asChild> \<ChevronDownIcon className="size-4 opacity-50" /> \</SelectPrimitive.Icon> \</SelectPrimitive.Trigger> ); const SelectScrollUpButton = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.ScrollUpButton>) => ( \<SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn( "flex cursor-default items-center justify-center py-1", className, )} {...props} > \<ChevronUpIcon className="size-4" /> \</SelectPrimitive.ScrollUpButton> ); const SelectScrollDownButton = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.ScrollDownButton>) => ( \<SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn( "flex cursor-default items-center justify-center py-1", className, )} {...props} > \<ChevronDownIcon className="size-4" /> \</SelectPrimitive.ScrollDownButton> ); const SelectContent = ({ className, children, position = "popper", ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Content>) => ( \<SelectPrimitive.Portal> \<SelectPrimitive.Content data-slot="select-content" position={position} sideOffset={6} className={cn( "relative z-50 max-h-96 min-w-\[8rem] overflow-hidden rounded-xl border bg-popover/95 p-1.5 text-popover-foreground shadow-lg backdrop-blur-sm", "data-\[state=open]:fade-in-0 data-\[state=open]:zoom-in-95 data-\[state=open]:animate-in", "data-\[state=closed]:fade-out-0 data-\[state=closed]:zoom-out-95 data-\[state=closed]:animate-out", "data-\[side=bottom]:slide-in-from-top-2 data-\[side=left]:slide-in-from-right-2 data-\[side=right]:slide-in-from-left-2 data-\[side=top]:slide-in-from-bottom-2", position === "popper" && "data-\[side=left]:-translate-x-1 data-\[side=right]:translate-x-1 data-\[side=bottom]:translate-y-1 data-\[side=top]:-translate-y-1 rtl:data-\[side=left]:translate-x-1 rtl:data-\[side=right]:-translate-x-1", className, )} {...props} > \<SelectScrollUpButton /> \<SelectPrimitive.Viewport className={cn( position === "popper" && "h-\[var(--radix-select-trigger-height)] w-full min-w-\[var(--radix-select-trigger-width)] scroll-my-1", )} > {children} \</SelectPrimitive.Viewport> \<SelectScrollDownButton /> \</SelectPrimitive.Content> \</SelectPrimitive.Portal> ); const SelectLabel = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Label>) => ( \<SelectPrimitive.Label data-slot="select-label" className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)} {...props} /> ); const SelectItem = ({ className, children, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Item>) => ( \<SelectPrimitive.Item data-slot="select-item" className={cn( "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 ps-3 pe-9 text-sm outline-none", "focus:bg-accent focus:text-accent-foreground", "data-\[disabled]:pointer-events-none data-\[disabled]:opacity-50", "\[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", className, )} {...props} > \<span className="absolute end-3 flex size-4 items-center justify-center"> \<SelectPrimitive.ItemIndicator> \<CheckIcon className="size-4" /> \</SelectPrimitive.ItemIndicator> \</span> \<SelectPrimitive.ItemText>{children}\</SelectPrimitive.ItemText> \</SelectPrimitive.Item> ); const SelectSeparator = ({ className, ...props }: ComponentPropsWithoutRef\<typeof SelectPrimitive.Separator>) => ( \<SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} /> ); export interface SelectOption { value: string; label: ReactNode; textValue?: string; disabled?: boolean; } export interface SelectProps extends Pick< ComponentPropsWithoutRef\<typeof SelectPrimitive.Root>, "value" | "onValueChange" | "disabled" > { value: string; onValueChange: (value: string) => void; options: readonly SelectOption\[]; placeholder?: string; className?: string; } function Select({ options, placeholder, className, ...props }: SelectProps) { const selectedOption = options.find((opt) => opt.value === props.value); return ( \<SelectRoot {...props}> \<SelectPrimitive.Trigger className={cn( "flex items-center gap-1.5 rounded-md py-1 ps-3 pe-2 text-sm outline-none transition-colors", "text-muted-foreground hover:bg-muted hover:text-foreground", "focus-visible:ring-2 focus-visible:ring-ring/50", "disabled:cursor-not-allowed disabled:opacity-50", !selectedOption && placeholder && "italic opacity-70", className, )} > \<span>{selectedOption?.label ?? placeholder}\</span> \<ChevronDownIcon className="size-3.5 opacity-50" /> \</SelectPrimitive.Trigger> \<SelectContent> {options.map(({ label, disabled, textValue, ...itemProps }) => ( \<SelectItem key={itemProps.value} {...itemProps} {...(disabled !== undefined ? { disabled } : {})} textValue={ textValue ?? (typeof label === "string" ? label : itemProps.value) } > {label} \</SelectItem> ))} \</SelectContent> \</SelectRoot> ); } export { Select, SelectRoot, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, selectTriggerVariants, };

### [Use in your application](#use-in-your-application)

Place the `ModelSelector` inside your thread component, typically in the composer area:

- title

  /components/assistant-ui/thread.tsx

`import { ModelSelector } from "@/components/assistant-ui/model-selector"; const ComposerAction: FC = () => { return ( <div className="flex items-center gap-1"> <ModelSelector models={[ { id: "gpt-5.4-nano", name: "GPT-5.4 Nano", description: "Fast and efficient" }, { id: "gpt-5.4-mini", name: "GPT-5.4 Mini", description: "Balanced performance" }, { id: "gpt-5.5", name: "GPT-5.5", description: "Most capable" }, ]} defaultValue="gpt-5.4-nano" size="sm" /> </div> ); };`

### [Read the model in your API route](#read-the-model-in-your-api-route)

The selected model's `id` is sent as `config.modelName` in the request body:

- title

  app/api/chat/route.ts

`export async function POST(req: Request) { const { messages, config } = await req.json(); const result = streamText({ model: openai(config?.modelName ?? "gpt-5.4-nano"), messages: await convertToModelMessages(messages), }); return result.toUIMessageStreamResponse(); }`

## [Variants](#variants)

Use the `variant` prop to change the trigger's visual style.

`<ModelSelector variant="outline" /> // Border (default) <ModelSelector variant="ghost" /> // No background <ModelSelector variant="muted" /> // Solid background`

| Variant   | Description                                  |
| --------- | -------------------------------------------- |
| `outline` | Border with transparent background (default) |
| `ghost`   | No background, subtle hover                  |
| `muted`   | Solid secondary background                   |

## [Sizes](#sizes)

Use the `size` prop to control the trigger dimensions.

`<ModelSelector size="sm" /> // Compact (h-8, text-xs) <ModelSelector size="default" /> // Standard (h-9) <ModelSelector size="lg" /> // Large (h-10)`

## [Model Options](#model-options)

Each model in the `models` array supports:

`const models = [ { id: "gpt-5.4-nano", // Sent to backend as config.modelName name: "GPT-5.4 Nano", // Display name in trigger and items description: "Fast and efficient", // Optional subtitle in items only icon: <SparklesIcon />, // Optional icon (any ReactNode) }, ];`

## [Runtime Integration](#runtime-integration)

The default `ModelSelector` export automatically registers the selected model with assistant-ui's `ModelContext` system. When a user selects a model:

1. The component calls `aui.modelContext().register()` with `config.modelName`
2. The `AssistantChatTransport` includes `config` in the request body
3. Your API route reads `config.modelName` to determine which model to use

This works out of the box with `@assistant-ui/react-ai-sdk`.

## [API Reference](#api-reference)

### [Composable API](#composable-api)

For custom layouts, use the sub-components directly with `ModelSelector.Root`:

`import { ModelSelectorRoot, ModelSelectorTrigger, ModelSelectorContent, ModelSelectorItem, } from "@/components/assistant-ui/model-selector"; <ModelSelectorRoot models={models} value={modelId} onValueChange={setModelId}> <ModelSelectorTrigger variant="outline" /> <ModelSelectorContent /> </ModelSelectorRoot>`

| Component               | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `ModelSelector`         | Default export with runtime integration              |
| `ModelSelector.Root`    | Presentational root (no runtime, controlled state)   |
| `ModelSelector.Trigger` | CVA-styled trigger showing current model             |
| `ModelSelector.Content` | Select content with model items                      |
| `ModelSelector.Item`    | Individual model option with icon, name, description |

### [ModelSelector](#modelselector)

`ModelSelectorProps`

- `models` `: ModelOption[]`

  Array of available models to display.

- `defaultValue` `?: string`

  Initial model ID for uncontrolled usage.

- `value` `?: string`

  Controlled selected model ID.

- `onValueChange` `?: (value: string) => void`

  Callback when selected model changes.

- `variant` `: "outline" | "ghost" | "muted"` = "outline"

  Visual style of the trigger button.

- `size` `: "sm" | "default" | "lg"` = "default"

  Size of the trigger button.

- `contentClassName` `?: string`

  Additional class name for the dropdown content.

### [ModelOption](#modeloption)

`ModelOption`

- `id` `: string`

  Unique identifier sent to the backend as modelName.

- `name` `: string`

  Display name shown in trigger and dropdown.

- `description` `?: string`

  Optional subtitle shown below the model name.

- `icon` `?: React.ReactNode`

  Optional icon displayed before the model name.