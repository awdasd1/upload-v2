import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle, Download, FileText, Table } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface FileWithPreview extends File {
  preview?: string
  id?: string
  progress?: number
  status?: 'uploading' | 'processing' | 'completed' | 'error'
  downloadUrl?: string
}

interface FileUploadProps {
  onUploadComplete?: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxSize?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles)
    
    const newFiles = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: undefined,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'uploading' as const
      })
      return fileWithPreview
    })

    setFiles(prev => [...prev, ...newFiles])
    uploadFiles(newFiles)
  }, [user])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles
  })

  const uploadFiles = async (filesToUpload: FileWithPreview[]) => {
    if (!filesToUpload || filesToUpload.length === 0) return
    
    setUploading(true)

    for (const file of filesToUpload) {
      try {
        console.log('Starting upload for:', file.name)
        
        // Simulate upload progress
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ))
        }

        // Prepare form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', user?.id || 'anonymous')
        formData.append('fileName', file.name)
        formData.append('fileType', file.type || 'text/plain')
        formData.append('fileSize', file.size.toString())

        console.log('Uploading to n8n:', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          userId: user?.id
        })

        const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n.mjal.at/form/3b27dbe7-8292-4e37-9f59-3ec8ec2661f2'
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData,
        })

        console.log('n8n response status:', response.status)

        // Complete progress
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 100 } : f
        ))

        let result = {
          success: response.ok,
          message: 'تم رفع الملف بنجاح',
          downloadUrl: null
        }

        try {
          const responseText = await response.text()
          console.log('n8n response:', responseText)
          
          if (responseText) {
            try {
              result = JSON.parse(responseText)
            } catch {
              result.message = responseText
            }
          }
        } catch (error) {
          console.log('Could not read response:', error)
        }

        if (!response.ok) {
          throw new Error(result?.message || `فشل في رفع الملف (${response.status})`)
        }

        // Save to Supabase
        try {
          if (user?.id) {
            const { error } = await supabase
              .from('file_uploads')
              .insert({
                user_id: user.id,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type || 'text/plain',
                upload_status: 'completed',
                webhook_response: result
              })

            if (error) {
              console.warn('Could not save to database:', error)
            } else {
              console.log('File saved to database successfully')
            }
          }
        } catch (dbError) {
          console.warn('Database save error:', dbError)
        }

        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', downloadUrl: result?.downloadUrl }
            : f
        ))

        toast.success(`تم رفع ${file.name} بنجاح`)
        
      } catch (error: any) {
        console.error('Upload error:', error)
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error', progress: 0 } : f
        ))
        toast.error(`فشل في رفع ${file.name}: ${error.message}`)
      }
    }

    setUploading(false)
    if (onUploadComplete) {
      onUploadComplete(files)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت'
    const k = 1024
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName?: string, fileType?: string) => {
    // التحقق من وجود fileName قبل استخدام split
    if (!fileName) {
      return <File className="h-10 w-10 text-gray-400" />
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (extension === 'csv' || fileType?.includes('csv')) {
      return <Table className="h-10 w-10 text-green-500" />
    } else if (extension === 'txt' || fileType?.includes('text')) {
      return <FileText className="h-10 w-10 text-blue-500" />
    }
    
    return <File className="h-10 w-10 text-gray-400" />
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`file-upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center"
        >
          <Upload className={`h-12 w-12 mb-4 ${
            isDragActive ? 'text-primary-500' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'اسحب الملفات هنا' : 'اسحب ملفات TXT أو CSV أو انقر للاختيار'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            الحد الأقصى: {maxFiles} ملفات، {formatFileSize(maxSize)} لكل ملف
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            الأنواع المدعومة: ملفات TXT و CSV فقط
          </p>
          
          {/* File type examples */}
          <div className="flex items-center space-x-4 space-x-reverse mt-4">
            <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>TXT</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
              <Table className="h-4 w-4 text-green-500" />
              <span>CSV</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-3"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse flex-1">
                    {getFileIcon(file.name, file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name || 'ملف غير معروف'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.type || 'نص عادي'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full progress-bar"
                            style={{ width: `${file.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {file.progress || 0}%
                        </span>
                      </div>
                    )}

                    {file.status === 'completed' && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {file.downloadUrl && (
                          <button
                            onClick={() => window.open(file.downloadUrl, '_blank')}
                            className="p-1 text-primary-600 hover:text-primary-700"
                            title="تحميل الملف"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}

                    <button
                      onClick={() => removeFile(file.id!)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="حذف الملف"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload
