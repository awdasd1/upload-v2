import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, FileUpload } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0
  })

  useEffect(() => {
    fetchFiles()
  }, [user])

  const fetchFiles = async () => {
    if (!user) return

    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Demo data
        const demoFiles: FileUpload[] = [
          {
            id: '1',
            user_id: user.id,
            file_name: 'مستند-تجريبي.pdf',
            file_size: 1024000,
            file_type: 'application/pdf',
            upload_status: 'completed',
            webhook_response: { downloadUrl: 'https://demo.com/file1.pdf' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: user.id,
            file_name: 'صورة-تجريبية.jpg',
            file_size: 2048000,
            file_type: 'image/jpeg',
            upload_status: 'processing',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            user_id: user.id,
            file_name: 'ملف-نصي.txt',
            file_size: 512000,
            file_type: 'text/plain',
            upload_status: 'failed',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString()
          }
        ]

        setFiles(demoFiles)
        setStats({
          total: 3,
          completed: 1,
          processing: 1,
          failed: 1
        })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFiles(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const completed = data?.filter(f => f.upload_status === 'completed').length || 0
      const processing = data?.filter(f => f.upload_status === 'processing').length || 0
      const failed = data?.filter(f => f.upload_status === 'failed').length || 0

      setStats({ total, completed, processing, failed })
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('حدث خطأ في تحميل الملفات')
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Demo mode - just remove from state
        setFiles(prev => prev.filter(f => f.id !== fileId))
        toast.success('تم حذف الملف بنجاح (وضع تجريبي)')
        return
      }

      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId)

      if (error) throw error

      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast.success('تم حذف الملف بنجاح')
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('حدث خطأ في حذف الملف')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت'
    const k = 1024
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'processing':
        return 'قيد المعالجة'
      case 'failed':
        return 'فشل'
      default:
        return 'في الانتظار'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل لوحة التحكم..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Configuration Warning */}
        {(!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your-project')) && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 ml-2" />
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>وضع تجريبي:</strong> البيانات المعروضة تجريبية. يرجى تكوين Supabase للاستخدام الكامل.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            مرحباً، {user?.user_metadata?.full_name || user?.email}
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة ملفاتك ومتابعة حالة المعالجة
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'إجمالي الملفات', value: stats.total, icon: FileText, color: 'blue' },
            { label: 'مكتملة', value: stats.completed, icon: CheckCircle, color: 'green' },
            { label: 'قيد المعالجة', value: stats.processing, icon: Clock, color: 'yellow' },
            { label: 'فاشلة', value: stats.failed, icon: AlertCircle, color: 'red' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mb-8">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="ml-2 h-5 w-5" />
            رفع ملف جديد
          </Link>
        </div>

        {/* Files Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              ملفاتي ({files.length})
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                لا توجد ملفات
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                ابدأ برفع ملفك الأول
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Upload className="ml-2 h-4 w-4" />
                رفع ملف
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      اسم الملف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحجم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      تاريخ الرفع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 ml-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.file_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.file_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(file.upload_status)}
                          <span className="mr-2 text-sm text-gray-900 dark:text-white">
                            {getStatusText(file.upload_status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {file.webhook_response?.downloadUrl && (
                            <button
                              onClick={() => window.open(file.webhook_response.downloadUrl, '_blank')}
                              className="text-primary-600 hover:text-primary-900 p-1"
                              title="تحميل"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
