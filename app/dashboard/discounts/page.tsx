"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Tag, Package, Calendar, Percent, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data for categories
const categories = [
  { id: 1, name: "Herbal Teas" },
  { id: 2, name: "Essential Oils" },
  { id: 3, name: "Supplements" },
  { id: 4, name: "Skincare" },
  { id: 5, name: "Aromatherapy" },
]

// Mock data for products
const products = [
  { id: "PRD001", name: "Chamomile Tea", category: "Herbal Teas", price: 15.99 },
  { id: "PRD002", name: "Lavender Essential Oil", category: "Essential Oils", price: 24.99 },
  { id: "PRD003", name: "Echinacea Supplement", category: "Supplements", price: 18.5 },
  { id: "PRD004", name: "Aloe Vera Gel", category: "Skincare", price: 12.99 },
  { id: "PRD005", name: "Diffuser Set", category: "Aromatherapy", price: 29.99 },
  { id: "PRD006", name: "Peppermint Tea", category: "Herbal Teas", price: 14.99 },
  { id: "PRD007", name: "Tea Tree Oil", category: "Essential Oils", price: 19.99 },
  { id: "PRD008", name: "Vitamin C Tablets", category: "Supplements", price: 22.5 },
  { id: "PRD009", name: "Facial Cleanser", category: "Skincare", price: 16.99 },
  { id: "PRD010", name: "Aromatherapy Candle", category: "Aromatherapy", price: 18.99 },
]

// Mock data for discounts
const initialDiscounts = [
  {
    id: 1,
    name: "Summer Sale",
    type: "category",
    target: "Herbal Teas",
    value: 15,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "active",
  },
  {
    id: 2,
    name: "Essential Oils Promo",
    type: "category",
    target: "Essential Oils",
    value: 10,
    startDate: "2023-07-15",
    endDate: "2023-09-15",
    status: "active",
  },
  {
    id: 3,
    name: "Aloe Vera Special",
    type: "product",
    target: "Aloe Vera Gel",
    value: 20,
    startDate: "2023-06-15",
    endDate: "2023-07-15",
    status: "expired",
  },
  {
    id: 4,
    name: "Diffuser Discount",
    type: "product",
    target: "Diffuser Set",
    value: 25,
    startDate: "2023-08-01",
    endDate: "2023-10-31",
    status: "active",
  },
]

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("category")

  // New discount state
  const [newDiscount, setNewDiscount] = useState({
    name: "",
    type: "category",
    target: "",
    value: 10,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "active",
    selectedProducts: [] as string[],
  })

  const [editingDiscount, setEditingDiscount] = useState<null | (typeof initialDiscounts)[0]>(null)

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDiscount = () => {
    const id = Math.max(0, ...discounts.map((d) => d.id)) + 1

    // For product-specific discounts with multiple products
    if (newDiscount.type === "product" && newDiscount.selectedProducts.length > 0) {
      // Create a discount for each selected product
      const newDiscounts = newDiscount.selectedProducts.map((productId, index) => {
        const product = products.find((p) => p.id === productId)
        return {
          id: id + index,
          name: newDiscount.name,
          type: "product",
          target: product?.name || "",
          value: newDiscount.value,
          startDate: newDiscount.startDate,
          endDate: newDiscount.endDate,
          status: newDiscount.status,
        }
      })

      setDiscounts([...discounts, ...newDiscounts])
    } else {
      // For category discounts or single product discount
      setDiscounts([
        ...discounts,
        {
          id,
          name: newDiscount.name,
          type: newDiscount.type,
          target:
            newDiscount.type === "category"
              ? newDiscount.target
              : products.find((p) => p.id === newDiscount.target)?.name || "",
          value: newDiscount.value,
          startDate: newDiscount.startDate,
          endDate: newDiscount.endDate,
          status: newDiscount.status,
        },
      ])
    }

    // Reset form
    setNewDiscount({
      name: "",
      type: "category",
      target: "",
      value: 10,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "active",
      selectedProducts: [],
    })

    setIsAddDialogOpen(false)
  }

  const handleEditDiscount = () => {
    if (editingDiscount) {
      setDiscounts(discounts.map((d) => (d.id === editingDiscount.id ? editingDiscount : d)))
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteDiscount = (id: number) => {
    setDiscounts(discounts.filter((d) => d.id !== id))
  }

  const handleProductSelection = (productId: string, isChecked: boolean) => {
    if (isChecked) {
      setNewDiscount({
        ...newDiscount,
        selectedProducts: [...newDiscount.selectedProducts, productId],
      })
    } else {
      setNewDiscount({
        ...newDiscount,
        selectedProducts: newDiscount.selectedProducts.filter((id) => id !== productId),
      })
    }
  }

  const getStatusBadge = (status: string, endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)

    // Check if discount has expired based on end date
    if (end < today) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" /> Expired
        </Badge>
      )
    }

    // Otherwise show the actual status
    if (status === "active") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Active
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Inactive
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
          <p className="text-muted-foreground">Manage discounts for categories and products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Discount</DialogTitle>
              <DialogDescription>Add a new discount for categories or specific products</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Discount Name</Label>
                <Input
                  id="name"
                  value={newDiscount.name}
                  onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })}
                  placeholder="Summer Sale"
                />
              </div>

              <Tabs
                defaultValue="category"
                onValueChange={(value) => {
                  setActiveTab(value)
                  setNewDiscount({ ...newDiscount, type: value, target: "" })
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="category">Category Discount</TabsTrigger>
                  <TabsTrigger value="product">Product Discount</TabsTrigger>
                </TabsList>
                <TabsContent value="category" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newDiscount.target}
                      onValueChange={(value) => setNewDiscount({ ...newDiscount, target: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="product" className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Select Products</Label>
                    <div className="border rounded-md p-4 h-60 overflow-y-auto">
                      <div className="grid gap-2">
                        {products.map((product) => (
                          <div key={product.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={newDiscount.selectedProducts.includes(product.id)}
                              onCheckedChange={(checked) => handleProductSelection(product.id, checked as boolean)}
                            />
                            <Label htmlFor={`product-${product.id}`} className="text-sm font-normal cursor-pointer">
                              {product.name} - {product.category} (${product.price.toFixed(2)})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {newDiscount.selectedProducts.length} products selected
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-2">
                <Label htmlFor="value">Discount Percentage (%)</Label>
                <Input
                  id="value"
                  type="number"
                  min="1"
                  max="100"
                  value={newDiscount.value}
                  onChange={(e) => setNewDiscount({ ...newDiscount, value: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newDiscount.startDate}
                    onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newDiscount.endDate}
                    onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDiscount}>Create Discount</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search discounts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDiscounts.map((discount) => (
          <Card key={discount.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>{discount.name}</CardTitle>
                {getStatusBadge(discount.status, discount.endDate)}
              </div>
              <CardDescription>
                {discount.type === "category" ? (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {discount.target} Category
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {discount.target} Product
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-2xl font-bold">
                  <Percent className="h-5 w-5 mr-1 text-primary" />
                  {discount.value}% OFF
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(discount.startDate).toLocaleDateString()} -{" "}
                  {new Date(discount.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3 flex justify-between">
              <Dialog
                open={isEditDialogOpen && editingDiscount?.id === discount.id}
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open)
                  if (!open) setEditingDiscount(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setEditingDiscount(discount)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Discount</DialogTitle>
                    <DialogDescription>Update discount information</DialogDescription>
                  </DialogHeader>
                  {editingDiscount && (
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Discount Name</Label>
                        <Input
                          id="edit-name"
                          value={editingDiscount.name}
                          onChange={(e) => setEditingDiscount({ ...editingDiscount, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="edit-value">Discount Percentage (%)</Label>
                        <Input
                          id="edit-value"
                          type="number"
                          min="1"
                          max="100"
                          value={editingDiscount.value}
                          onChange={(e) =>
                            setEditingDiscount({ ...editingDiscount, value: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-startDate">Start Date</Label>
                          <Input
                            id="edit-startDate"
                            type="date"
                            value={editingDiscount.startDate}
                            onChange={(e) => setEditingDiscount({ ...editingDiscount, startDate: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-endDate">End Date</Label>
                          <Input
                            id="edit-endDate"
                            type="date"
                            value={editingDiscount.endDate}
                            onChange={(e) => setEditingDiscount({ ...editingDiscount, endDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                          value={editingDiscount.status}
                          onValueChange={(value) => setEditingDiscount({ ...editingDiscount, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditDiscount}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the discount "{discount.name}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

