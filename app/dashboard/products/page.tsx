"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
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

// Mock data for products
const initialProducts = [
  {
    id: "PRD001",
    name: "Chamomile Tea",
    category: "Herbal Teas",
    costPrice: 8.5,
    sellingPrice: 15.99,
    stock: 120,
    status: "In Stock",
  },
  {
    id: "PRD002",
    name: "Lavender Essential Oil",
    category: "Essential Oils",
    costPrice: 12.75,
    sellingPrice: 24.99,
    stock: 45,
    status: "In Stock",
  },
  {
    id: "PRD003",
    name: "Echinacea Supplement",
    category: "Supplements",
    costPrice: 9.25,
    sellingPrice: 18.5,
    stock: 8,
    status: "Low Stock",
  },
  {
    id: "PRD004",
    name: "Aloe Vera Gel",
    category: "Skincare",
    costPrice: 6.5,
    sellingPrice: 12.99,
    stock: 65,
    status: "In Stock",
  },
  {
    id: "PRD005",
    name: "Diffuser Set",
    category: "Aromatherapy",
    costPrice: 15.0,
    sellingPrice: 29.99,
    stock: 0,
    status: "Out of Stock",
  },
]

// Mock categories
const categories = ["Herbal Teas", "Essential Oils", "Supplements", "Skincare", "Aromatherapy"]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    status: "In Stock",
  })
  const [editingProduct, setEditingProduct] = useState<null | (typeof initialProducts)[0]>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    // Generate a product ID if not provided
    const id = newProduct.id || `PRD${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Determine status based on stock
    let status = "In Stock"
    if (newProduct.stock === 0) {
      status = "Out of Stock"
    } else if (newProduct.stock <= 10) {
      status = "Low Stock"
    }

    setProducts([
      ...products,
      {
        ...newProduct,
        id,
        status,
      },
    ])
    setNewProduct({
      id: "",
      name: "",
      category: "",
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      status: "In Stock",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (editingProduct) {
      // Update status based on stock
      let status = "In Stock"
      if (editingProduct.stock === 0) {
        status = "Out of Stock"
      } else if (editingProduct.stock <= 10) {
        status = "Low Stock"
      }

      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...editingProduct, status } : p)))
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> In Stock
          </Badge>
        )
      case "Low Stock":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Low Stock
          </Badge>
        )
      case "Out of Stock":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Out of Stock
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
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
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a new product to your inventory</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="id">Product ID (optional)</Label>
                  <Input
                    id="id"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                    placeholder="PRD001"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Chamomile Tea"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price ($)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={newProduct.costPrice.toString()}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, costPrice: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="8.50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={newProduct.sellingPrice.toString()}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sellingPrice: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="15.99"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock.toString()}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Create</Button>
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
            placeholder="Search products..."
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
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>In Stock</DropdownMenuItem>
            <DropdownMenuItem>Low Stock</DropdownMenuItem>
            <DropdownMenuItem>Out of Stock</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Herbal Teas</DropdownMenuItem>
            <DropdownMenuItem>Essential Oils</DropdownMenuItem>
            <DropdownMenuItem>Supplements</DropdownMenuItem>
            <DropdownMenuItem>Skincare</DropdownMenuItem>
            <DropdownMenuItem>Aromatherapy</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.costPrice.toFixed(2)}</TableCell>
                  <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStockStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditDialogOpen && editingProduct?.id === product.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setEditingProduct(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>Make changes to product information</DialogDescription>
                        </DialogHeader>
                        {editingProduct && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-id">Product ID</Label>
                              <Input id="edit-id" value={editingProduct.id} disabled />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Product Name</Label>
                              <Input
                                id="edit-name"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Select
                                value={editingProduct.category}
                                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-costPrice">Cost Price ($)</Label>
                                <Input
                                  id="edit-costPrice"
                                  type="number"
                                  value={editingProduct.costPrice.toString()}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      costPrice: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-sellingPrice">Selling Price ($)</Label>
                                <Input
                                  id="edit-sellingPrice"
                                  type="number"
                                  value={editingProduct.sellingPrice.toString()}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      sellingPrice: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-stock">Stock Quantity</Label>
                              <Input
                                id="edit-stock"
                                type="number"
                                value={editingProduct.stock.toString()}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) || 0 })
                                }
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditProduct}>Save Changes</Button>
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
                            This will permanently delete the product "{product.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product.id)}
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

