import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Package, 
  Search, 
  Filter,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { ProductForm } from '../components/ProductForm'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { 
  getAllProductsAdmin, 
  deleteProduct, 
  updateProduct, 
  Product,
  getProductCategories 
} from '../services/productService'
import { toast } from '../hooks/use-toast'

export const Admin = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showHidden, setShowHidden] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Load products and categories
  const loadData = async () => {
    setIsLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProductsAdmin(), // Gets all products including hidden ones
        getProductCategories()
      ])
      
      // For admin, we want to see all products, not just visible ones
      // We'll need to create a new function or modify the existing one
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by visibility
    if (!showHidden) {
      filtered = filtered.filter(product => product.isVisible)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, showHidden])

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const handleProductSuccess = (product: Product) => {
    setIsAddDialogOpen(false)
    setEditingProduct(null)
    loadData() // Reload products
    toast({
      title: "Success",
      description: `Product "${product.name}" has been saved successfully!`,
    })
  }

  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProduct(product.id)
      setDeletingProduct(null)
      loadData() // Reload products
      toast({
        title: "Product Deleted",
        description: `"${product.name}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleVisibility = async (product: Product) => {
    try {
      await updateProduct(product.id, { isVisible: !product.isVisible })
      loadData() // Reload products
      toast({
        title: "Visibility Updated",
        description: `"${product.name}" is now ${!product.isVisible ? 'visible' : 'hidden'}.`,
      })
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update product visibility. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { isFeatured: !product.isFeatured })
      loadData() // Reload products
      toast({
        title: "Featured Status Updated",
        description: `"${product.name}" is now ${!product.isFeatured ? 'featured' : 'not featured'}.`,
      })
    } catch (error) {
      console.error('Error updating featured status:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePriorityChange = async (product: Product, newPriority: number) => {
    try {
      await updateProduct(product.id, { priority: newPriority })
      loadData() // Reload products
      toast({
        title: "Priority Updated",
        description: `"${product.name}" priority has been updated.`,
      })
    } catch (error) {
      console.error('Error updating priority:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update priority. Please try again.",
        variant: "destructive"
      })
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className={`${!product.isVisible ? 'opacity-60 border-dashed' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {product.name}
              {product.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {!product.isVisible && (
                <Badge variant="outline" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {product.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleVisibility(product)}
            >
              {product.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleFeatured(product)}
            >
              <Star className={`h-4 w-4 ${product.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg">₹{product.price}</span>
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <span>Priority: {product.priority || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriorityChange(product, (product.priority || 0) - 1)}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriorityChange(product, (product.priority || 0) + 1)}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex-1" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingProduct(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteProduct(product)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Product Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your product catalog, visibility, and featured items
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm 
                  onSuccess={handleProductSuccess}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visible</p>
                    <p className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.isVisible).length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hidden</p>
                    <p className="text-2xl font-bold text-red-600">
                      {products.filter(p => !p.isVisible).length}
                    </p>
                  </div>
                  <EyeOff className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {products.filter(p => p.isFeatured).length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant={showHidden ? "default" : "outline"}
                  onClick={() => setShowHidden(!showHidden)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showHidden ? 'Show All' : 'Show Hidden'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct}
              onSuccess={handleProductSuccess}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
} 