/**
 * Text extraction utilities for various file formats
 * Supports PDF, DOCX, and TXT files with fallback handling
 */

export interface ExtractionResult {
  text: string
  metadata: {
    pageCount?: number
    wordCount: number
    confidence: number
    extractedAt: Date
  }
  warnings: string[]
}

/**
 * Extract text from uploaded file based on MIME type
 */
export async function extractTextFromFile(
  file: File
): Promise<ExtractionResult> {
  const { type: mimeType, size } = file

  // Size validation (max 10MB)
  if (size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit')
  }

  try {
    switch (mimeType) {
      case 'application/pdf':
        return await extractFromPDF(file)
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return await extractFromDOCX(file)
      
      case 'text/plain':
        return await extractFromTXT(file)
      
      default:
        // Try to read as text if mime type detection failed
        const textResult = await tryExtractAsText(file)
        if (textResult.text.trim().length > 0) {
          return textResult
        }
        throw new Error(`Unsupported file type: ${mimeType}`)
    }
  } catch (error) {
    throw new Error(`Text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract text from plain text content
 */
export function extractTextFromContent(content: string): ExtractionResult {
  const text = content.trim()
  const wordCount = text.split(/\s+/).filter(Boolean).length

  return {
    text,
    metadata: {
      wordCount,
      confidence: 1.0,
      extractedAt: new Date()
    },
    warnings: []
  }
}

/**
 * Extract text from PDF file
 * Note: This is a simplified version for demo purposes
 * In production, you'd use a library like pdf-parse or pdf2pic
 */
async function extractFromPDF(file: File): Promise<ExtractionResult> {
  // For demo purposes, we'll simulate PDF text extraction
  // In a real implementation, you'd use pdf-parse or similar
  
  const warnings: string[] = []
  
  // Simulate PDF processing
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  
  // Check if it looks like a PDF (starts with %PDF)
  const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4))
  if (pdfHeader !== '%PDF') {
    throw new Error('Invalid PDF file format')
  }

  // Mock extracted text for demo
  const mockText = `[EXTRACTED PDF CONTENT]\n\nThis is a demonstration of PDF text extraction. In a production environment, this would contain the actual text content extracted from the PDF file using libraries like pdf-parse or pdfplumber.\n\nThe extracted content would preserve formatting where possible and include all readable text from the document.`
  
  warnings.push('PDF text extraction is simulated for demo purposes')
  
  const wordCount = mockText.split(/\s+/).filter(Boolean).length

  return {
    text: mockText,
    metadata: {
      pageCount: 1,
      wordCount,
      confidence: 0.8,
      extractedAt: new Date()
    },
    warnings
  }
}

/**
 * Extract text from DOCX file
 * Note: This is a simplified version for demo purposes
 * In production, you'd use mammoth.js or similar
 */
async function extractFromDOCX(file: File): Promise<ExtractionResult> {
  // For demo purposes, we'll simulate DOCX text extraction
  // In a real implementation, you'd use mammoth.js
  
  const warnings: string[] = []
  
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Check if it's a valid ZIP file (DOCX is a ZIP archive)
    const uint8Array = new Uint8Array(arrayBuffer)
    const zipHeader = String.fromCharCode(...uint8Array.slice(0, 2))
    
    if (zipHeader !== 'PK') {
      throw new Error('Invalid DOCX file format')
    }

    // Mock extracted text for demo
    const mockText = `[EXTRACTED DOCX CONTENT]\n\nThis is a demonstration of DOCX text extraction. In a production environment, this would contain the actual text content extracted from the Word document using libraries like mammoth.js.\n\nThe extraction would preserve paragraph structure and basic formatting while removing styles and metadata.`
    
    warnings.push('DOCX text extraction is simulated for demo purposes')
    
    const wordCount = mockText.split(/\s+/).filter(Boolean).length

    return {
      text: mockText,
      metadata: {
        wordCount,
        confidence: 0.85,
        extractedAt: new Date()
      },
      warnings
    }
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract text from plain text file
 */
async function extractFromTXT(file: File): Promise<ExtractionResult> {
  try {
    const text = await file.text()
    const wordCount = text.split(/\s+/).filter(Boolean).length

    return {
      text,
      metadata: {
        wordCount,
        confidence: 1.0,
        extractedAt: new Date()
      },
      warnings: []
    }
  } catch (error) {
    throw new Error(`TXT extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Try to extract text assuming the file is plain text
 */
async function tryExtractAsText(file: File): Promise<ExtractionResult> {
  try {
    const text = await file.text()
    const wordCount = text.split(/\s+/).filter(Boolean).length
    
    // Check if the content looks like readable text
    const printableChars = text.match(/[\x20-\x7E\s]/g)?.length || 0
    const confidence = printableChars / text.length
    
    if (confidence < 0.7) {
      throw new Error('Content does not appear to be readable text')
    }

    return {
      text,
      metadata: {
        wordCount,
        confidence,
        extractedAt: new Date()
      },
      warnings: ['File type not recognized, extracted as plain text']
    }
  } catch (error) {
    throw new Error(`Text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate file before processing
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' }
  }

  if (!supportedTypes.includes(file.type) && !file.type.startsWith('text/')) {
    return { isValid: false, error: `Unsupported file type: ${file.type}` }
  }

  return { isValid: true }
}