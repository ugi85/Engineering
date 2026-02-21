import { get, put } from '@vercel/blob'

// Default configuration
const DEFAULT_CONFIG = {
  systemName: 'AGIS QMS',
  systemVersion: '2.1.0',
  companyName: 'PT. AGIS INSTRUMENT SERVICES',
  addressLine1: 'Jl. Raya Industri No. 123',
  addressLine2: 'Kawasan Industri MM2100',
  city: 'Cikarang Barat',
  postalCode: '17520',
  province: 'Bekasi',
  country: 'Indonesia',
  phone: '(021) 897-1234',
  email: 'info@agis.co.id',
  documentRefEquipment: 'AGIS-WI-ENG-001-LD1_v5.0',
  documentRefCalibration: 'AGIS-WI-ENG-016-LD1_v5.0',
  logoUrl: null,
  faviconUrl: null,
  logoDataUrl: null,
  faviconDataUrl: null,
  print: {
    orientation: 'landscape',
    margin: '10mm',
    headerHeight: '30mm',
    showLogo: true,
    showAddress: true,
    showDocumentRef: true,
    fontFamily: 'Arial, sans-serif'
  },
  lastUpdated: null
}

const CONFIG_BLOB_PATH = 'config/config.json'

export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  try {
    if (request.method === 'GET') {
      // Read configuration
      let config = DEFAULT_CONFIG

      try {
        const blob = await get(CONFIG_BLOB_PATH)
        const text = await blob.text()
        config = { ...DEFAULT_CONFIG, ...JSON.parse(text) }
      } catch (error) {
        console.log('Config not found, using default config')
      }

      response.status(200).json(config)
    } else if (request.method === 'POST') {
      // Save configuration
      const config = request.body
      
      // Add timestamp
      config.lastUpdated = new Date().toISOString()
      
      // Save to Vercel Blob
      await put(CONFIG_BLOB_PATH, JSON.stringify(config, null, 2), {
        access: 'public',
        contentType: 'application/json'
      })
      
      response.status(200).json({ 
        success: true, 
        message: 'Configuration saved successfully',
        lastUpdated: config.lastUpdated
      })
    } else {
      response.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling config request:', error)
    response.status(500).json({ 
      error: 'Failed to handle configuration', 
      details: error.message 
    })
  }
}
