# Part 3: Approval UI
URL: /docs/runtimes/langgraph/tutorial/part-3

Add human-in-the-loop approval for tool calls.

## [Background: LangGraph implementation details](#background-langgraph-implementation-details)

- alt

  LangChain LangGraph

Our LangGraph backend interrupts the `purchase_stock` tool execution in order to ensure the user confirms the purchase. The user confirms the purchase by submitting a tool message with the `approve` field set to `true`.

- title

  assistant-ui-stockbroker/backend/src/index.ts

`const purchaseApproval = async (state: typeof GraphAnnotation.State) => { const { messages } = state; const lastMessage = messages[messages.length - 1]; if (!(lastMessage instanceof ToolMessage)) { // Interrupt the node to request permission to execute the purchase. throw new NodeInterrupt("Please confirm the purchase before executing."); } }; const shouldExecutePurchase = (state: typeof GraphAnnotation.State) => { const { messages } = state; const lastMessage = messages[messages.length - 1]; if (!(lastMessage instanceof ToolMessage)) { // Interrupt the node to request permission to execute the purchase. throw new NodeInterrupt("Please confirm the purchase before executing."); } const { approve } = JSON.parse(lastMessage.content as string); return approve ? "execute_purchase" : "agent"; }; const workflow = new StateGraph(GraphAnnotation) .addNode("agent", callModel) .addEdge(START, "agent") .addNode("tools", toolNode) .addNode("prepare_purchase_details", preparePurchaseDetails) .addNode("purchase_approval", purchaseApproval) .addNode("execute_purchase", executePurchase) .addEdge("prepare_purchase_details", "purchase_approval") .addEdge("execute_purchase", END) .addEdge("tools", "agent") .addConditionalEdges("purchase_approval", shouldExecutePurchase, [ "agent", "execute_purchase", ]) .addConditionalEdges("agent", shouldContinue, [ "tools", END, "prepare_purchase_details", ]);`

## [Add approval UI](#add-approval-ui)

We create a new file under `/components/tools/purchase-stock/PurchaseStockTool.tsx` to define the tool.

First, we define the tool arguments and result types:

- title

  @/components/tools/purchase-stock/PurchaseStockTool.tsx

`type PurchaseStockArgs = { ticker: string; companyName: string; quantity: number; maxPurchasePrice: number; }; type PurchaseStockResult = { approve?: boolean; cancelled?: boolean; error?: string; };`

Then we use `makeAssistantToolUI` to define the tool UI:

- title

  @/components/tools/purchase-stock/PurchaseStockTool.tsx

`"use client"; import { TransactionConfirmationPending } from "./transaction-confirmation-pending"; import { TransactionConfirmationFinal } from "./transaction-confirmation-final"; import { makeAssistantToolUI } from "@assistant-ui/react"; export const PurchaseStockTool = makeAssistantToolUI<PurchaseStockArgs, string>( { toolName: "purchase_stock", render: function PurchaseStockUI({ args, result, status, addResult }) { const handleReject = async () => { addResult(JSON.stringify({ approve: false })); }; const handleConfirm = async () => { addResult(JSON.stringify({ approve: true })); }; return ( <div className="mb-4 flex flex-col items-center gap-2"> <div> <pre className="whitespace-pre-wrap break-all text-center"> purchase_stock({JSON.stringify(args)}) </pre> </div> {!result && status.type !== "running" && ( <TransactionConfirmationPending {...args} onConfirm={handleConfirm} onReject={handleReject} /> )} </div> ); }, }, );`

Finally, we add a `TransactionConfirmationPending` component to ask for approval.

This requires shadcn/ui's `Card` and `Button` components. We will install them as a dependency.

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/card.json
  - https\://r.assistant-ui.com/button.json

Then create a new file under `/components/tools/purchase-stock/transaction-confirmation-pending.tsx` to define the approval UI.

- title

  @/components/tools/purchase-stock/transaction-confirmation-pending.tsx

`"use client"; import { CheckIcon, XIcon } from "lucide-react"; import { Button } from "@/components/ui/button"; import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"; type TransactionConfirmation = { ticker: string; companyName: string; quantity: number; maxPurchasePrice: number; onConfirm: () => void; onReject: () => void; }; export function TransactionConfirmationPending(props: TransactionConfirmation) { const { ticker, companyName, quantity, maxPurchasePrice, onConfirm, onReject, } = props; return ( <Card className="mx-auto w-full max-w-md"> <CardHeader> <CardTitle className="text-2xl font-bold"> Confirm Transaction </CardTitle> </CardHeader> <CardContent className="space-y-4"> <div className="grid grid-cols-2 gap-2"> <p className="text-muted-foreground text-sm font-medium">Ticker:</p> <p className="text-sm font-bold">{ticker}</p> <p className="text-muted-foreground text-sm font-medium">Company:</p> <p className="text-sm">{companyName}</p> <p className="text-muted-foreground text-sm font-medium">Quantity:</p> <p className="text-sm">{quantity} shares</p> <p className="text-muted-foreground text-sm font-medium"> Max Purchase Price: </p> <p className="text-sm">${maxPurchasePrice?.toFixed(2)}</p> </div> <div className="bg-muted rounded-md p-3"> <p className="text-sm font-medium">Total Maximum Cost:</p> <p className="text-lg font-bold"> ${(quantity * maxPurchasePrice)?.toFixed(2)} </p> </div> </CardContent> <CardFooter className="flex justify-end"> <Button variant="outline" onClick={onReject}> <XIcon className="mr-2 h-4 w-4" /> Reject </Button> <Button onClick={onConfirm}> <CheckIcon className="mr-2 h-4 w-4" /> Confirm </Button> </CardFooter> </Card> ); }`

### [Bind approval UI](#bind-approval-ui)

- title

  @/app/page.tsx

`import { PurchaseStockTool } from "@/components/tools/purchase-stock/PurchaseStockTool"; export default function Home() { return ( <div className="flex h-full flex-col"> <PriceSnapshotTool /> <PurchaseStockTool /> <Thread /> </div> ); }`

### [Try it out!](#try-it-out)

Ask the assistant to buy 5 shares of Tesla. You should see the following appear:

- alt

  Approval UI

## [Add `TransactionConfirmationFinal` to show approval result](#add-transactionconfirmationfinal-to-show-approval-result)

We will add a component to display the approval result.

- title

  @/components/tools/purchase-stock/transaction-confirmation-final.tsx

`"use client"; import { CheckCircle } from "lucide-react"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; type TransactionConfirmation = { ticker: string; companyName: string; quantity: number; maxPurchasePrice: number; }; export function TransactionConfirmationFinal(props: TransactionConfirmation) { const { ticker, companyName, quantity, maxPurchasePrice } = props; return ( <Card className="mx-auto w-full max-w-md"> <CardHeader className="text-center"> <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" /> <CardTitle className="text-2xl font-bold text-green-700"> Transaction Confirmed </CardTitle> </CardHeader> <CardContent className="space-y-4"> <div className="rounded-md border border-green-200 bg-green-50 p-4"> <h3 className="mb-2 text-lg font-semibold text-green-800"> Purchase Summary </h3> <div className="grid grid-cols-2 gap-2 text-sm"> <p className="font-medium text-green-700">Ticker:</p> <p className="font-bold text-green-900">{ticker}</p> <p className="font-medium text-green-700">Company:</p> <p className="text-green-900">{companyName}</p> <p className="font-medium text-green-700">Quantity:</p> <p className="text-green-900">{quantity} shares</p> <p className="font-medium text-green-700">Price per Share:</p> <p className="text-green-900">${maxPurchasePrice?.toFixed(2)}</p> </div> </div> <div className="rounded-md border border-green-300 bg-green-100 p-4"> <p className="text-lg font-semibold text-green-800">Total Cost:</p> <p className="text-2xl font-bold text-green-900"> ${(quantity * maxPurchasePrice)?.toFixed(2)} </p> </div> <p className="text-center text-sm text-green-600"> Your purchase of {quantity} shares of {companyName} ({ticker}) has been successfully processed. </p> </CardContent> </Card> ); }`

### [Update `PurchaseStockTool`](#update-purchasestocktool)

We will import the new `<TransactionConfirmationFinal />` component and use it in the `render` function whenever an approval result is available.

- title

  @/components/tools/purchase-stock/PurchaseStockTool.tsx

`"use client"; import { TransactionConfirmationPending } from "./transaction-confirmation-pending"; import { TransactionConfirmationFinal } from "./transaction-confirmation-final"; import { makeAssistantToolUI } from "@assistant-ui/react"; type PurchaseStockArgs = { ticker: string; companyName: string; quantity: number; maxPurchasePrice: number; }; type PurchaseStockResult = { approve?: boolean; cancelled?: boolean; error?: string; }; export const PurchaseStockTool = makeAssistantToolUI<PurchaseStockArgs, string>( { toolName: "purchase_stock", render: function PurchaseStockUI({ args, result, status, addResult }) { let resultObj: PurchaseStockResult; try { resultObj = result ? JSON.parse(result) : {}; } catch (e) { resultObj = { error: result! }; } const handleReject = () => { addResult(JSON.stringify({ approve: false })); }; const handleConfirm = async () => { addResult(JSON.stringify({ approve: true })); }; return ( <div className="mb-4 flex flex-col items-center gap-2"> <div> <pre className="whitespace-pre-wrap break-all text-center"> purchase_stock({JSON.stringify(args)}) </pre> </div> {!result && status.type !== "running" && ( <TransactionConfirmationPending {...args} onConfirm={handleConfirm} onReject={handleReject} /> )} {resultObj.approve && <TransactionConfirmationFinal {...args} />} {resultObj.approve === false && ( <pre className="font-bold text-red-600">User rejected purchase</pre> )} {resultObj.cancelled && ( <pre className="font-bold text-red-600">Cancelled</pre> )} </div> ); }, }, );`

### [Try it out!](#try-it-out-1)

Confirm the purchase of shares. You should see the approval confirmation UI appear.

- alt

  Approval result