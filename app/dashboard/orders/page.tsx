"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Download,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for orders
const initialOrders = [
  {
    id: "ORD001",
    customer: "John Smith",
    date: "2023-06-15",
    total: 45.98,
    status: "Completed",
    items: [
      { id: "PRD001", name: "Chamomile Tea", quantity: 2, price: 15.99 },
      { id: "PRD004", name: "Aloe Vera Gel", quantity: 1, price: 12.99 },
    ],
  },
  {
    id: "ORD002",
    customer: "Sarah Johnson",
    date: "2023-06-18",
    total: 24.99,
    status: "Processing",
    items: [{ id: "PRD002", name: "Lavender Essential Oil", quantity: 1, price: 24.99 }],
  },
  {
    id: "ORD003",
    customer: "Michael Brown",
    date: "2023-06-20",
    total: 18.5,
    status: "Pending",
    items: [{ id: "PRD003", name: "Echinacea Supplement", quantity: 1, price: 18.5 }],
  },
  {
    id: "ORD004",
    customer: "Emily Davis",
    date: "2023-06-22",
    total: 42.98,
    status: "Returned",
    items: [
      { id: "PRD005", name: "Diffuser Set", quantity: 1, price: 29.99 },
      { id: "PRD004", name: "Aloe Vera Gel", quantity: 1, price: 12.99 },
    ],
  },
  {
    id: "ORD005",
    customer: "David Wilson",
    date: "2023-06-25",
    total: 31.98,
    status: "Completed",
    items: [{ id: "PRD001", name: "Chamomile Tea", quantity: 2, price: 15.99 }],
  },
]

// Mock data for products
const products = [
  { id: "PRD001", name: "Chamomile Tea", price: 15.99 },
  { id: "PRD002", name: "Lavender Essential Oil", price: 24.99 },
  { id: "PRD003", name: "Echinacea Supplement", price: 18.5 },
  { id: "PRD004", name: "Aloe Vera Gel", price: 12.99 },
  { id: "PRD005", name: "Diffuser Set", price: 29.99 },
]

// Mock data for customers
const customers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "David Wilson" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<null | (typeof initialOrders)[0]>(null)

  // New order state
  const [newOrder, setNewOrder] = useState({
    customer: "",
    status: "Pending",
    items: [{ productId: "", quantity: 1 }],
  })

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 1 }],
    })
  }

  const handleRemoveItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...newOrder.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewOrder({ ...newOrder, items: updatedItems })
  }

  const handleAddOrder = () => {
    // Calculate total
    const orderItems = newOrder.items
      .filter((item) => item.productId) // Only include items with a selected product
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          id: item.productId,
          name: product?.name || "",
          quantity: item.quantity,
          price: product?.price || 0,
        }
      })

    // Don't create order if no items or customer selected
    if (orderItems.length === 0 || !newOrder.customer) {
      alert("Please select at least one product and a customer")
      return
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Generate order ID
    const id = `ORD${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Get customer name
    const customer = customers.find((c) => c.id.toString() === newOrder.customer)?.name || "Unknown"

    // Get current date
    const date = new Date().toISOString().split("T")[0]

    setOrders([
      ...orders,
      {
        id,
        customer,
        date,
        total,
        status: newOrder.status,
        items: orderItems,
      },
    ])

    // Reset form
    setNewOrder({
      customer: "",
      status: "Pending",
      items: [{ productId: "", quantity: 1 }],
    })

    setIsAddDialogOpen(false)
  }

  const handleEditOrder = () => {
    if (selectedOrder) {
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? selectedOrder : o)))
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "Processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <RefreshCw className="mr-1 h-3 w-3" /> Processing
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "Returned":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Returned
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Create a new order for a customer</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={newOrder.customer}
                    onValueChange={(value) => setNewOrder({ ...newOrder, customer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    value={newOrder.status}
                    onValueChange={(value) => setNewOrder({ ...newOrder, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Order Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="mr-2 h-3 w-3" />
                      Add Item
                    </Button>
                  </div>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <div className="grid gap-2 flex-1">
                        <Label htmlFor={`product-${index}`}>Product</Label>
                        <Select
                          value={item.productId}
                          onValueChange={(value) => handleItemChange(index, "productId", value)}
                        >
                          <SelectTrigger id={`product-${index}`}>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - ${product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2 w-24">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 mb-0.5"
                        onClick={() => handleRemoveItem(index)}
                        disabled={newOrder.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrder}>Create Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>All Orders</DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Processing</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            <DropdownMenuItem>Returned</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(order.customer)}</AvatarFallback>
                      </Avatar>
                      {order.customer}
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditDialogOpen && selectedOrder?.id === order.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedOrder(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Order</DialogTitle>
                          <DialogDescription>Update order status</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-id">Order ID</Label>
                              <Input id="edit-id" value={selectedOrder.id} disabled />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-customer">Customer</Label>
                              <Input id="edit-customer" value={selectedOrder.customer} disabled />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-status">Order Status</Label>
                              <Select
                                value={selectedOrder.status}
                                onValueChange={(value) => setSelectedOrder({ ...selectedOrder, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Processing">Processing</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Returned">Returned</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="border rounded-md p-4">
                              <h3 className="font-medium mb-2">Order Items</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedOrder.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditOrder}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isInvoiceDialogOpen && selectedOrder?.id === order.id}
                      onOpenChange={(open) => {
                        setIsInvoiceDialogOpen(open)
                        if (!open) setSelectedOrder(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Invoice</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Invoice</DialogTitle>
                          <DialogDescription>Order invoice details</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-2xl font-bold">INVOICE</h2>
                                <p className="text-muted-foreground">Herbal CRM System</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Invoice #: {selectedOrder.id}</p>
                                <p className="text-muted-foreground">Date: {selectedOrder.date}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2">Bill To:</h3>
                                <p>{selectedOrder.customer}</p>
                                <p className="text-muted-foreground">123 Customer Street</p>
                                <p className="text-muted-foreground">City, State 12345</p>
                                <p className="text-muted-foreground">customer@example.com</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Ship To:</h3>
                                <p>{selectedOrder.customer}</p>
                                <p className="text-muted-foreground">123 Customer Street</p>
                                <p className="text-muted-foreground">City, State 12345</p>
                              </div>
                            </div>

                            <div className="border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedOrder.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <div>
                                          <div className="font-medium">{item.name}</div>
                                          <div className="text-sm text-muted-foreground">{item.id}</div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">{item.quantity}</TableCell>
                                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">
                                        ${(item.quantity * item.price).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="flex justify-end">
                              <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax (8%):</span>
                                  <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                  <span>Total:</span>
                                  <span>${(selectedOrder.total * 1.08).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h3 className="font-semibold mb-2">Notes:</h3>
                              <p className="text-muted-foreground">
                                Thank you for your business! Payment is due within 30 days.
                              </p>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                            Close
                          </Button>
                          <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the order "{order.id}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

