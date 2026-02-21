import { put, del } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  try {
    if (request.method === 'POST') {
      // Upload logo
      const formData = await request.formData()
      const file = formData.get('logo')
      
      if (!file) {
        return response.status(400).json({ error: 'No file provided' })
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return response.status(400).json({ error: 'File must be an image (PNG, JPG, SVG)' })
      }
      
      // Validate file size (max 100KB)
      const maxSize = 100 * 1024 // 100KB
      if (file.size > maxSize) {
        return response.status(400).json({ error: 'File size must be less than 100KB' })
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop() || 'png'
      const filename = `logo-${timestamp}.${extension}`
      
      // Upload to Vercel Blob
      const blob = await put(`logos/${filename}`, file, {
        access: 'public',
        contentType: file.type,
      })
      
      // Generate favicon from logo (create a small version)
      const faviconFilename = `favicon-${timestamp}.png`
      const faviconBlob = await put(`favicons/${faviconFilename}`, file, {
        access: 'public',
        contentType: file.type,
      })
      
      response.status(200).json({
        success: true,
        logoUrl: blob.url,
        faviconUrl: faviconBlob.url,
        message: 'Logo uploaded successfully'
      })
    } else if (request.method === 'DELETE') {
      // Delete logo
      const { logoUrl, faviconUrl } = request.body
      
      // Delete logo
      if (logoUrl) {
        try {
          await del(logoUrl)
        } catch (error) {
          console.log('Error deleting logo:', error)
        }
      }
      
      // Delete favicon
      if (faviconUrl) {
        try {
          await del(faviconUrl)
        } catch (error) {
          console.log('Error deleting favicon:', error)
        }
      }
      
      response.status(200).json({
        success: true,
        message: 'Logo deleted successfully'
      })
    } else {
      response.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling upload request:', error)
    response.status(500).json({ 
      error: 'Failed to handle upload', 
      details: error.message 
    })
  }
}
