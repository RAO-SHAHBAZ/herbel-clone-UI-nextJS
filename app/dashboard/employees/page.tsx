"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Shield, ShieldCheck } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for employees
const initialEmployees = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@herbalcrm.com",
    role: "Admin",
    permissions: ["dashboard", "categories", "customers", "products", "orders", "employees"],
    status: "active",
  },
  {
    id: 2,
    name: "Sales Manager",
    email: "sales@herbalcrm.com",
    role: "Manager",
    permissions: ["dashboard", "customers", "products", "orders"],
    status: "active",
  },
  {
    id: 3,
    name: "Inventory Clerk",
    email: "inventory@herbalcrm.com",
    role: "Staff",
    permissions: ["dashboard", "products"],
    status: "active",
  },
  {
    id: 4,
    name: "Customer Support",
    email: "support@herbalcrm.com",
    role: "Staff",
    permissions: ["dashboard", "customers", "orders"],
    status: "inactive",
  },
]

// Available permissions
const availablePermissions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "categories", label: "Categories" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "employees", label: "Employees" },
]

// Available roles
const roles = ["Admin", "Manager", "Staff"]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "Staff",
    permissions: ["dashboard"],
    status: "active",
  })
  const [editingEmployee, setEditingEmployee] = useState<null | (typeof initialEmployees)[0]>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    const id = Math.max(0, ...employees.map((e) => e.id)) + 1
    setEmployees([...employees, { ...newEmployee, id }])
    setNewEmployee({
      name: "",
      email: "",
      role: "Staff",
      permissions: ["dashboard"],
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditEmployee = () => {
    if (editingEmployee) {
      setEmployees(employees.map((e) => (e.id === editingEmployee.id ? editingEmployee : e)))
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id))
  }

  const handlePermissionChange = (permission: string, isChecked: boolean, isNewEmployee = true) => {
    if (isNewEmployee) {
      if (isChecked) {
        setNewEmployee({
          ...newEmployee,
          permissions: [...newEmployee.permissions, permission],
        })
      } else {
        setNewEmployee({
          ...newEmployee,
          permissions: newEmployee.permissions.filter((p) => p !== permission),
        })
      }
    } else if (editingEmployee) {
      if (isChecked) {
        setEditingEmployee({
          ...editingEmployee,
          permissions: [...editingEmployee.permissions, permission],
        })
      } else {
        setEditingEmployee({
          ...editingEmployee,
          permissions: editingEmployee.permissions.filter((p) => p !== permission),
        })
      }
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <ShieldCheck className="mr-1 h-3 w-3" /> Admin
          </Badge>
        )
      case "Manager":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="mr-1 h-3 w-3" /> Manager
          </Badge>
        )
      case "Staff":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="mr-1 h-3 w-3" /> Staff
          </Badge>
        )
      default:
        return <Badge>{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage employee accounts and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Create a new employee account with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john.smith@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={newEmployee.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal">
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(employee.role)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {employee.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {availablePermissions.find((p) => p.id === permission)?.label || permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.status === "active" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditDialogOpen && editingEmployee?.id === employee.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setEditingEmployee(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingEmployee(employee)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Employee</DialogTitle>
                          <DialogDescription>Update employee information and permissions</DialogDescription>
                        </DialogHeader>
                        {editingEmployee && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Full Name</Label>
                              <Input
                                id="edit-name"
                                value={editingEmployee.name}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editingEmployee.email}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-role">Role</Label>
                              <Select
                                value={editingEmployee.role}
                                onValueChange={(value) => setEditingEmployee({ ...editingEmployee, role: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Permissions</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {availablePermissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-permission-${permission.id}`}
                                      checked={editingEmployee.permissions.includes(permission.id)}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(permission.id, checked as boolean, false)
                                      }
                                    />
                                    <Label htmlFor={`edit-permission-${permission.id}`} className="text-sm font-normal">
                                      {permission.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={editingEmployee.status}
                                onValueChange={(value) => setEditingEmployee({ ...editingEmployee, status: value })}
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
                          <Button onClick={handleEditEmployee}>Save Changes</Button>
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
                            This will permanently delete the employee "{employee.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEmployee(employee.id)}
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

