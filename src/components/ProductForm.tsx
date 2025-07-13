import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Upload, Loader2, Wand2, Eye, EyeOff, Star, Package, AlertCircle, CheckCircle, X } from 'lucide-react'
import { 
  createProductWithImage, 
  updateProductWithImage, 
  CreateProductWithImageData, 
  UpdateProductWithImageData, 
  Product 
} from '../services/productService'
import { validateImageFile } from '../services/imageUploadService'
import { isAIServiceAvailable } from '../services/aiService'
import { toast } from '../hooks/use-toast'

interface ProductFormProps {
  product?: Product // If provided, this is an edit form
  onSuccess?: (product: Product) => void
  onCancel?: () => void
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    priority: product?.priority || 0,
    isVisible: product?.isVisible ?? true,
    isFeatured: product?.isFeatured ?? false,
    isCustomizable: product?.isCustomizable ?? false,
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'kawaii'
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [aiGenerated, setAiGenerated] = useState<{
    title?: boolean
    description?: boolean
    category?: boolean
  }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditMode = !!product
  const isAIAvailable = isAIServiceAvailable()

  const categories = [
    { value: 'personalized', label: 'Personalized' },
    { value: 'kawaii', label: 'Kawaii' },
    { value: 'sea', label: 'Sea' },
    { value: 'winter', label: 'Winter' }
  ]

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, image: validation.error || 'Invalid image file' }))
      return
    }

    setSelectedImage(file)
    setErrors(prev => ({ ...prev, image: '' }))

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateAI = async () => {
    if (!selectedImage && !isEditMode) {
      toast({
        title: "Image Required",
        description: "Please select an image first to generate AI content.",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingAI(true)
    setErrors(prev => ({ ...prev, ai: '' }))

    try {
      const { generateProductContentWithFallback } = await import('../services/aiService')
      
      const imageToAnalyze = selectedImage || (isEditMode ? null : null)
      if (!imageToAnalyze) {
        throw new Error('No image available for AI analysis')
      }

      const result = await generateProductContentWithFallback(
        imageToAnalyze,
        formData.price,
        formData.originalPrice
      )

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          name: result.title,
          description: result.description,
          category: result.category
        }))
        
        setAiGenerated({
          title: true,
          description: true,
          category: true
        })

        toast({
          title: "AI Content Generated",
          description: "Product title, description, and category have been generated successfully!",
        })
      } else {
        setErrors(prev => ({ ...prev, ai: result.error || 'Failed to generate AI content' }))
        toast({
          title: "AI Generation Failed",
          description: result.error || "Failed to generate content. Please try again or enter manually.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('AI generation error:', error)
      setErrors(prev => ({ ...prev, ai: 'Failed to generate AI content' }))
      toast({
        title: "AI Generation Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!isEditMode && !selectedImage) {
      newErrors.image = 'Product image is required'
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (formData.originalPrice <= 0) {
      newErrors.originalPrice = 'Original price must be greater than 0'
    }

    if (formData.price >= formData.originalPrice) {
      newErrors.price = 'Discounted price must be less than original price'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    }

    if (formData.priority < 0) {
      newErrors.priority = 'Priority must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setErrors(prev => ({ ...prev, submit: '' }))

    try {
      let result

      if (isEditMode) {
        // Update existing product
        const updateData: UpdateProductWithImageData = {
          id: product.id,
          imageFile: selectedImage || undefined,
          price: formData.price,
          originalPrice: formData.originalPrice,
          priority: formData.priority,
          isVisible: formData.isVisible,
          isFeatured: formData.isFeatured,
          isCustomizable: formData.isCustomizable,
          name: formData.name,
          description: formData.description,
          category: formData.category
        }

        result = await updateProductWithImage(updateData)
      } else {
        // Create new product
        const createData: CreateProductWithImageData = {
          imageFile: selectedImage!,
          price: formData.price,
          originalPrice: formData.originalPrice,
          priority: formData.priority,
          isVisible: formData.isVisible,
          isFeatured: formData.isFeatured,
          isCustomizable: formData.isCustomizable,
          manualTitle: formData.name,
          manualDescription: formData.description,
          manualCategory: formData.category
        }

        result = await createProductWithImage(createData)
      }

      if (result.success && result.product) {
        toast({
          title: isEditMode ? "Product Updated" : "Product Created",
          description: `${result.product.name} has been ${isEditMode ? 'updated' : 'created'} successfully!`,
        })
        onSuccess?.(result.product)
      } else {
        setErrors(prev => ({ ...prev, submit: result.error || 'Failed to save product' }))
        toast({
          title: "Save Failed",
          description: result.error || "Failed to save product. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors(prev => ({ ...prev, submit: 'An unexpected error occurred' }))
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear AI generated flag when manually editing
    if (field === 'name' && aiGenerated.title) {
      setAiGenerated(prev => ({ ...prev, title: false }))
    }
    if (field === 'description' && aiGenerated.description) {
      setAiGenerated(prev => ({ ...prev, description: false }))
    }
    if (field === 'category' && aiGenerated.category) {
      setAiGenerated(prev => ({ ...prev, category: false }))
    }
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(isEditMode ? product?.image || '' : '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update product details and manage visibility' 
            : 'Upload an image and add product details. AI will help generate content automatically.'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Product Image</Label>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Preview */}
              <div className="flex-1">
                <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-2" />
                        <p>No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Change Image' : 'Select Image'}
                  </Button>
                </div>

                {/* AI Generation Button */}
                {isAIAvailable && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI || (!selectedImage && !isEditMode)}
                    className="w-full"
                  >
                    {isGeneratingAI ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                  </Button>
                )}

                {!isAIAvailable && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      AI features are disabled. Set VITE_GEMINI_API_KEY to enable automatic content generation.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {errors.image && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.image}</AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Discounted Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="499"
                min="1"
                step="1"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹) *</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
                placeholder="599"
                min="1"
                step="1"
              />
              {errors.originalPrice && (
                <p className="text-sm text-red-600">{errors.originalPrice}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority (lower numbers appear first)</Label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', Number(e.target.value))}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.priority && (
              <p className="text-sm text-red-600">{errors.priority}</p>
            )}
          </div>

          <Separator />

          {/* Product Details Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                Product Name *
                {aiGenerated.title && (
                  <Badge variant="secondary" className="text-xs">
                    <Wand2 className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Kawaii Tea Cup"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                Description *
                {aiGenerated.description && (
                  <Badge variant="secondary" className="text-xs">
                    <Wand2 className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Adorable white tea cup keychain with green leaves and a charming kawaii face"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Category *
                {aiGenerated.category && (
                  <Badge variant="secondary" className="text-xs">
                    <Wand2 className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Settings Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Product Settings</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => handleInputChange('isVisible', checked)}
                />
                <Label htmlFor="isVisible" className="flex items-center gap-2">
                  {formData.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Visible on shop page
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured product
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCustomizable"
                  checked={formData.isCustomizable}
                  onCheckedChange={(checked) => handleInputChange('isCustomizable', checked)}
                />
                <Label htmlFor="isCustomizable">
                  Customizable product
                </Label>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {errors.ai && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.ai}</AlertDescription>
            </Alert>
          )}

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 