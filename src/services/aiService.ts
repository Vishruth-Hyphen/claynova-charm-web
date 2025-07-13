import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will be disabled.')
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

export interface AIGeneratedContent {
  title: string
  description: string
  category: string
  success: boolean
  error?: string
}

// Convert image file to base64 for AI analysis
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result as string
      // Remove data URL prefix
      const base64Data = base64.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = error => reject(error)
  })
}

// Generate product content using Gemini AI
export const generateProductContent = async (
  imageFile: File,
  price: number,
  originalPrice: number
): Promise<AIGeneratedContent> => {
  if (!genAI) {
    return {
      title: '',
      description: '',
      category: 'kawaii',
      success: false,
      error: 'AI service is not configured. Please set VITE_GEMINI_API_KEY environment variable.'
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const base64Image = await fileToBase64(imageFile)
    
    const prompt = `

Analyze this product image and generate:
1. A creative, appealing product title (2-4 words, catchy and memorable) It should be a name of the character, e.g "Bubbletide Octo Buddy", "Bugs Bunny", "Squeaky Santa", etc. 
2. A warm, engaging product description (8-10 words, that says a unique story about the character/product in question), e.g "A cute octopus that loves to play in the ocean"
3. A category from these options: "kawaii", "sea", "winter"

The product is priced at ₹${price} (original price ₹${originalPrice}).

Guidelines:
- Keep the tone warm, friendly, and artisanal
- Categories: "personalized" for custom/initial items, "kawaii" for cute/adorable items, "sea" for ocean/marine themes, "winter" for cold weather/cozy themes

Return your response in this exact JSON format:
{
  "title": "Your creative title here",
  "description": "Your warm, engaging 8-10 words description here",
  "category": "one of: personalized, kawaii, sea, winter"
}
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0])
      
      // Validate response structure
      if (!parsedResponse.title || !parsedResponse.description || !parsedResponse.category) {
        throw new Error('Invalid response structure')
      }

      // Validate category
      const validCategories = ['personalized', 'kawaii', 'sea', 'winter']
      if (!validCategories.includes(parsedResponse.category)) {
        parsedResponse.category = 'kawaii' // Default fallback
      }

      return {
        title: parsedResponse.title.trim(),
        description: parsedResponse.description.trim(),
        category: parsedResponse.category,
        success: true
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return {
        title: '',
        description: '',
        category: 'kawaii',
        success: false,
        error: 'Failed to parse AI response. Please try again.'
      }
    }
  } catch (error) {
    console.error('Error generating product content:', error)
    return {
      title: '',
      description: '',
      category: 'kawaii',
      success: false,
      error: 'Failed to generate content. Please try again or enter manually.'
    }
  }
}

// Generate content with fallback prompts for better results
export const generateProductContentWithFallback = async (
  imageFile: File,
  price: number,
  originalPrice: number,
  retryCount: number = 0
): Promise<AIGeneratedContent> => {
  const result = await generateProductContent(imageFile, price, originalPrice)
  
  // If first attempt fails and we haven't retried, try with a simpler prompt
  if (!result.success && retryCount === 0) {
    console.log('First attempt failed, trying with simpler prompt...')
    
    if (!genAI) {
      return result
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const base64Image = await fileToBase64(imageFile)
      
      const simplePrompt = `

Analyze this product image and generate:
1. A creative, appealing product title (2-4 words, catchy and memorable) It should be a name of the character, e.g "Bubbletide Octo Buddy", "Bugs Bunny", "Squeaky Santa", etc. 
2. A warm, engaging product description (8-10 words, that says a unique story about the character/product in question), e.g "A cute octopus that loves to play in the ocean" DO NOT SAY "Handcrafted Clay Keychain", "Made with love", etc. The desc should purely be about the charater or product in question.
3. A category from these options: "kawaii", "sea", "winter"

The product is priced at ₹${price} (original price ₹${originalPrice}).

Guidelines:
- Keep the tone warm, friendly, and artisanal
- Categories: "personalized" for custom/initial items, "kawaii" for cute/adorable items, "sea" for ocean/marine themes, "winter" for cold weather/cozy themes

Return your response in this exact JSON format:
{
  "title": "Your creative title here",
  "description": "Your warm, engaging description here",
  "category": "one of: personalized, kawaii, sea, winter"
}
`

      const result = await model.generateContent([
        simplePrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type
          }
        }
      ])

      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0])
        return {
          title: parsedResponse.title,
          description: parsedResponse.description,
          category: parsedResponse.category,
          success: true
        }
      }
    } catch (error) {
      console.error('Fallback generation failed:', error)
    }
  }
  
  return result
}

// Check if AI service is available
export const isAIServiceAvailable = (): boolean => {
  return !!genAI
} 