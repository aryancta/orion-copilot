"use client"

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateItem } from '@/hooks/use-workspace'
import { useAppStore } from '@/store/app-store'
import { validateFile } from '@/lib/extract-text'
import { cn } from '@/lib/utils'

interface UploadPanelProps {
  workspaceId: string
}

export function UploadPanel({ workspaceId }: UploadPanelProps) {
  const [dragActive, setDragActive] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file')
  
  const createItem = useCreateItem(workspaceId)
  const { isUploading } = useAppStore()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    const validation = validateFile(file)
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`

      await createItem.mutateAsync({
        sourceType: 'FILE',
        filename: file.name,
        content: dataUrl,
        mimeType: file.type
      })

      alert('File uploaded and analysis started!')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }
  }

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      alert('Please enter some text content')
      return
    }

    try {
      await createItem.mutateAsync({
        sourceType: 'TEXT',
        content: textContent.trim()
      })

      setTextContent('')
      alert('Text submitted and analysis started!')
    } catch (error) {
      console.error('Text submission failed:', error)
      alert('Submission failed. Please try again.')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={uploadMode === 'file' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={uploadMode === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setUploadMode('text')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Paste Text
        </Button>
      </div>

      {uploadMode === 'file' ? (
        <Card>
          <CardContent className="p-6">
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                isUploading && "pointer-events-none opacity-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <div>
                    <p className="text-lg font-medium">Processing document...</p>
                    <p className="text-sm text-muted-foreground">Extracting text and generating analysis</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your document here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">browse to upload</label>
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Supported formats: PDF, DOCX, TXT (max 10MB)</p>
                    <p>Your document will be analyzed instantly</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="text-content" className="text-sm font-medium">
                  Paste your content
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste emails, support tickets, requests, or any text content
                </p>
              </div>
              <Textarea
                id="text-content"
                placeholder="Paste your document content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[200px] resize-none"
                disabled={isUploading}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {textContent.length} characters
                </p>
                <Button 
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim() || isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Text'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}