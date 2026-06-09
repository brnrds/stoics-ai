# Accordion
URL: /docs/ui/accordion

A vertically stacked set of interactive headings that reveal or hide content sections.

This is a **standalone component** that does not depend on the assistant-ui runtime. Use it anywhere in your application.

## [Installation](#installation)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/accordion.json

#### Main Component

- packages

  - class-variance-authority
  - radix-ui

* code

  "use client"; import type { ComponentProps } from "react"; import { Accordion as AccordionPrimitive } from "radix-ui"; import { ChevronDownIcon } from "lucide-react"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const accordionVariants = cva( "aui-accordion group/accordion flex w-full flex-col", { variants: { variant: { default: "", outline: "rounded-lg border", ghost: "gap-2", }, }, defaultVariants: { variant: "default" }, }, ); function Accordion({ className, variant, ...props }: ComponentProps\<typeof AccordionPrimitive.Root> & VariantProps\<typeof accordionVariants>) { return ( \<AccordionPrimitive.Root data-slot="accordion" data-variant={variant ?? "default"} className={cn(accordionVariants({ variant }), className)} {...props} /> ); } function AccordionItem({ className, ...props }: ComponentProps\<typeof AccordionPrimitive.Item>) { return ( \<AccordionPrimitive.Item data-slot="accordion-item" className={cn( "aui-accordion-item group/accordion-item", "group-data-\[variant=default]/accordion:border-b group-data-\[variant=default]/accordion:last:border-b-0", "group-data-\[variant=outline]/accordion:border-b group-data-\[variant=outline]/accordion:last:border-b-0", "group-data-\[variant=ghost]/accordion:rounded-lg group-data-\[variant=ghost]/accordion:data-\[state=open]:bg-muted/50", className, )} {...props} /> ); } function AccordionTrigger({ className, children, ...props }: ComponentProps\<typeof AccordionPrimitive.Trigger>) { return ( \<AccordionPrimitive.Header className="flex"> \<AccordionPrimitive.Trigger data-slot="accordion-trigger" className={cn( "aui-accordion-trigger group/accordion-trigger flex w-full flex-1 items-center justify-between gap-4 text-start font-medium text-sm outline-none transition-all disabled:pointer-events-none disabled:opacity-50", "group-data-\[variant=default]/accordion:py-4 group-data-\[variant=default]/accordion:focus-visible:ring-2 group-data-\[variant=default]/accordion:focus-visible:ring-ring/50 group-data-\[variant=default]/accordion:hover:underline", "group-data-\[variant=outline]/accordion:px-4 group-data-\[variant=outline]/accordion:py-3 group-data-\[variant=outline]/accordion:focus-visible:ring-2 group-data-\[variant=outline]/accordion:focus-visible:ring-ring/50 group-data-\[variant=outline]/accordion:focus-visible:ring-inset group-data-\[variant=outline]/accordion:hover:bg-muted/50", "group-data-\[variant=ghost]/accordion:rounded-lg group-data-\[variant=ghost]/accordion:px-4 group-data-\[variant=ghost]/accordion:py-2 group-data-\[variant=ghost]/accordion:focus-visible:ring-2 group-data-\[variant=ghost]/accordion:focus-visible:ring-ring/50 group-data-\[variant=ghost]/accordion:hover:bg-muted/50", className, )} {...props} > {children} \<ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-\[state=open]/accordion-trigger:rotate-180" /> \</AccordionPrimitive.Trigger> \</AccordionPrimitive.Header> ); } function AccordionContent({ className, children, ...props }: ComponentProps\<typeof AccordionPrimitive.Content>) { return ( \<AccordionPrimitive.Content data-slot="accordion-content" className="aui-accordion-content overflow-hidden text-sm data-\[state=closed]:animate-accordion-up data-\[state=open]:animate-accordion-down" {...props} > \<div className={cn( "group-data-\[variant=default]/accordion:pb-4", "group-data-\[variant=outline]/accordion:border-t group-data-\[variant=outline]/accordion:px-4 group-data-\[variant=outline]/accordion:py-3", "group-data-\[variant=ghost]/accordion:px-4 group-data-\[variant=ghost]/accordion:py-3", className, )} > {children} \</div> \</AccordionPrimitive.Content> ); } export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, accordionVariants, };

- lang

  tsx

- code

  "use client"; import type { ComponentProps } from "react"; import { Accordion as AccordionPrimitive } from "radix-ui"; import { ChevronDownIcon } from "lucide-react"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const accordionVariants = cva( "aui-accordion group/accordion flex w-full flex-col", { variants: { variant: { default: "", outline: "rounded-lg border", ghost: "gap-2", }, }, defaultVariants: { variant: "default" }, }, ); function Accordion({ className, variant, ...props }: ComponentProps\<typeof AccordionPrimitive.Root> & VariantProps\<typeof accordionVariants>) { return ( \<AccordionPrimitive.Root data-slot="accordion" data-variant={variant ?? "default"} className={cn(accordionVariants({ variant }), className)} {...props} /> ); } function AccordionItem({ className, ...props }: ComponentProps\<typeof AccordionPrimitive.Item>) { return ( \<AccordionPrimitive.Item data-slot="accordion-item" className={cn( "aui-accordion-item group/accordion-item", "group-data-\[variant=default]/accordion:border-b group-data-\[variant=default]/accordion:last:border-b-0", "group-data-\[variant=outline]/accordion:border-b group-data-\[variant=outline]/accordion:last:border-b-0", "group-data-\[variant=ghost]/accordion:rounded-lg group-data-\[variant=ghost]/accordion:data-\[state=open]:bg-muted/50", className, )} {...props} /> ); } function AccordionTrigger({ className, children, ...props }: ComponentProps\<typeof AccordionPrimitive.Trigger>) { return ( \<AccordionPrimitive.Header className="flex"> \<AccordionPrimitive.Trigger data-slot="accordion-trigger" className={cn( "aui-accordion-trigger group/accordion-trigger flex w-full flex-1 items-center justify-between gap-4 text-start font-medium text-sm outline-none transition-all disabled:pointer-events-none disabled:opacity-50", "group-data-\[variant=default]/accordion:py-4 group-data-\[variant=default]/accordion:focus-visible:ring-2 group-data-\[variant=default]/accordion:focus-visible:ring-ring/50 group-data-\[variant=default]/accordion:hover:underline", "group-data-\[variant=outline]/accordion:px-4 group-data-\[variant=outline]/accordion:py-3 group-data-\[variant=outline]/accordion:focus-visible:ring-2 group-data-\[variant=outline]/accordion:focus-visible:ring-ring/50 group-data-\[variant=outline]/accordion:focus-visible:ring-inset group-data-\[variant=outline]/accordion:hover:bg-muted/50", "group-data-\[variant=ghost]/accordion:rounded-lg group-data-\[variant=ghost]/accordion:px-4 group-data-\[variant=ghost]/accordion:py-2 group-data-\[variant=ghost]/accordion:focus-visible:ring-2 group-data-\[variant=ghost]/accordion:focus-visible:ring-ring/50 group-data-\[variant=ghost]/accordion:hover:bg-muted/50", className, )} {...props} > {children} \<ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-\[state=open]/accordion-trigger:rotate-180" /> \</AccordionPrimitive.Trigger> \</AccordionPrimitive.Header> ); } function AccordionContent({ className, children, ...props }: ComponentProps\<typeof AccordionPrimitive.Content>) { return ( \<AccordionPrimitive.Content data-slot="accordion-content" className="aui-accordion-content overflow-hidden text-sm data-\[state=closed]:animate-accordion-up data-\[state=open]:animate-accordion-down" {...props} > \<div className={cn( "group-data-\[variant=default]/accordion:pb-4", "group-data-\[variant=outline]/accordion:border-t group-data-\[variant=outline]/accordion:px-4 group-data-\[variant=outline]/accordion:py-3", "group-data-\[variant=ghost]/accordion:px-4 group-data-\[variant=ghost]/accordion:py-3", className, )} > {children} \</div> \</AccordionPrimitive.Content> ); } export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, accordionVariants, };

## [Usage](#usage)

`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/components/assistant-ui/accordion"; export function Example() { return ( <Accordion type="single" collapsible> <AccordionItem value="item-1"> <AccordionTrigger>Section 1</AccordionTrigger> <AccordionContent>Content for section 1.</AccordionContent> </AccordionItem> <AccordionItem value="item-2"> <AccordionTrigger>Section 2</AccordionTrigger> <AccordionContent>Content for section 2.</AccordionContent> </AccordionItem> </Accordion> ); }`

## [Examples](#examples)

### [Variants](#variants)

Use the `variant` prop on `Accordion` to change the visual style. Child components inherit the variant automatically.

`// Default - border-bottom separator <Accordion type="single" collapsible variant="default"> <AccordionItem value="item-1"> <AccordionTrigger>...</AccordionTrigger> <AccordionContent>...</AccordionContent> </AccordionItem> </Accordion> // Outline - bordered container <Accordion type="single" collapsible variant="outline"> <AccordionItem value="item-1"> <AccordionTrigger>...</AccordionTrigger> <AccordionContent>...</AccordionContent> </AccordionItem> </Accordion> // Ghost - separated cards <Accordion type="single" collapsible variant="ghost"> <AccordionItem value="item-1"> <AccordionTrigger>...</AccordionTrigger> <AccordionContent>...</AccordionContent> </AccordionItem> </Accordion>`

### [Multiple Items Open](#multiple-items-open)

Use `type="multiple"` to allow multiple items to be open simultaneously.

`<Accordion type="multiple"> <AccordionItem value="item-1"> <AccordionTrigger>First Section</AccordionTrigger> <AccordionContent>Content 1</AccordionContent> </AccordionItem> <AccordionItem value="item-2"> <AccordionTrigger>Second Section</AccordionTrigger> <AccordionContent>Content 2</AccordionContent> </AccordionItem> </Accordion>`

### [With Icons](#with-icons)

Add icons or custom elements inside the trigger.

- code

  import { CreditCard, Settings, User, HelpCircle } from "lucide-react"; import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/components/ui/accordion"; function AccordionWithIconsSample() { return ( \<Accordion type="single" collapsible variant="outline" className="w-\[400px]" > \<AccordionItem value="account"> \<AccordionTrigger> \<span className="flex items-center gap-2"> \<User className="size-4" /> Account Settings \</span> \</AccordionTrigger> \<AccordionContent> Manage your account details, profile picture, and personal information. \</AccordionContent> \</AccordionItem> \<AccordionItem value="billing"> \<AccordionTrigger> \<span className="flex items-center gap-2"> \<CreditCard className="size-4" /> Billing \</span> \</AccordionTrigger> \<AccordionContent> View your billing history, manage payment methods, and update subscription. \</AccordionContent> \</AccordionItem> \<AccordionItem value="preferences"> \<AccordionTrigger> \<span className="flex items-center gap-2"> \<Settings className="size-4" /> Preferences \</span> \</AccordionTrigger> \<AccordionContent> Customize your experience with notification and display settings. \</AccordionContent> \</AccordionItem> \</Accordion> ); }

### [Controlled](#controlled)

Use `value` and `onValueChange` for controlled accordion state.

- code

  import { useState } from "react"; import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/components/ui/accordion"; function AccordionControlledSample() { const \[value, setValue] = useState("item-1"); return ( \<Accordion type="single" collapsible value={value} onValueChange={setValue} className="w-\[400px]" > \<AccordionItem value="item-1"> \<AccordionTrigger>Overview\</AccordionTrigger> \<AccordionContent> This is the overview section content. \</AccordionContent> \</AccordionItem> \<AccordionItem value="item-2"> \<AccordionTrigger>Details\</AccordionTrigger> \<AccordionContent> This is the details section content. \</AccordionContent> \</AccordionItem> \<AccordionItem value="item-3"> \<AccordionTrigger>Advanced\</AccordionTrigger> \<AccordionContent> This is the advanced section content. \</AccordionContent> \</AccordionItem> \</Accordion> \<p className="text-muted-foreground text-sm"> Current value: \<code className="font-mono">{value ?? "none"}\</code> \</p> ); }

### [FAQ Section](#faq-section)

A practical example of using accordion for a FAQ section.

- code

  import { CreditCard, Settings, User, HelpCircle } from "lucide-react"; import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/components/ui/accordion"; function AccordionFAQSample() { return ( \<div className="w-\[500px]"> \<div className="mb-4 flex items-center gap-2"> \<HelpCircle className="size-5" /> \<h3 className="font-semibold text-lg">Frequently Asked Questions\</h3> \</div> \<Accordion type="single" collapsible> \<AccordionItem value="faq-1"> \<AccordionTrigger> What payment methods do you accept? \</AccordionTrigger> \<AccordionContent> We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. \</AccordionContent> \</AccordionItem> \<AccordionItem value="faq-2"> \<AccordionTrigger> Can I cancel my subscription anytime? \</AccordionTrigger> \<AccordionContent> Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. \</AccordionContent> \</AccordionItem> \<AccordionItem value="faq-3"> \<AccordionTrigger>Do you offer refunds?\</AccordionTrigger> \<AccordionContent> We offer a 30-day money-back guarantee for all new subscriptions. Contact our support team to request a refund. \</AccordionContent> \</AccordionItem> \<AccordionItem value="faq-4"> \<AccordionTrigger>How do I contact support?\</AccordionTrigger> \<AccordionContent> You can reach our support team via email at support\@example.com or through the live chat feature in the bottom right corner. \</AccordionContent> \</AccordionItem> \</Accordion> \</div> ); }

## [API Reference](#api-reference)

### [Composable API](#composable-api)

| Component          | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `Accordion`        | The root component that manages accordion state and variant. |
| `AccordionItem`    | A single collapsible section container.                      |
| `AccordionTrigger` | The clickable header that toggles content visibility.        |
| `AccordionContent` | The collapsible content panel.                               |

### [Accordion](#accordion)

The root component that manages accordion state. Set `variant` here to style all child components.

`AccordionProps`

- `type` `: "single" | "multiple"`

  Whether only one or multiple items can be open at once.

- `collapsible` `: boolean` = false

  When type is 'single', allows closing the open item by clicking it again.

- `defaultValue` `?: string | string[]`

  The default open item(s) (uncontrolled).

- `value` `?: string | string[]`

  The controlled open item(s).

- `onValueChange` `?: (value: string | string[]) => void`

  Callback when the open item(s) change.

- `variant` `: "default" | "outline" | "ghost"` = "default"

  The visual style of the accordion. Child components inherit this automatically.

- `className` `?: string`

  Additional CSS classes.

### [AccordionItem](#accordionitem)

A single collapsible section container.

`AccordionItemProps`

- `value` `: string`

  A unique identifier for this item.

- `disabled` `?: boolean`

  Whether the item is disabled.

- `className` `?: string`

  Additional CSS classes.

### [AccordionTrigger](#accordiontrigger)

The clickable header that toggles content visibility.

`AccordionTriggerProps`

- `className` `?: string`

  Additional CSS classes.

### [AccordionContent](#accordioncontent)

The collapsible content panel.

`AccordionContentProps`

- `className` `?: string`

  Additional CSS classes.

### [Style Variants (CVA)](#style-variants-cva)

| Export              | Description                         |
| ------------------- | ----------------------------------- |
| `accordionVariants` | Styles for the accordion container. |

`import { accordionVariants } from "@/components/assistant-ui/accordion"; <div className={accordionVariants({ variant: "outline" })}> Custom Accordion Container </div>`