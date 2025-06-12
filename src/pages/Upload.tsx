import React from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, ArrowRight, FileText, Table, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import FileUpload from '../components/FileUpload'

const Upload: React.FC = () => {
  const handleUploadComplete = (files: any[]) => {
    console.log('Upload completed:', files)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
              >
                لوحة التحكم
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  رفع الملفات
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4">
            <UploadIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            رفع ملفات TXT و CSV
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ارفع ملفاتك النصية وملفات CSV بأمان. سيتم معالجتها تلقائياً عبر n8n وإشعارك عند الانتهاء.
          </p>
        </motion.div>

        {/* Upload Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <FileText className="h-5 w-5 ml-2" />
            تعليمات رفع الملفات
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">المتطلبات:</h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></span>
                  الحد الأقصى لحجم الملف: 10 ميجابايت
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></span>
                  الأنواع المدعومة: TXT و CSV فقط
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></span>
                  يمكنك رفع حتى 5 ملفات في المرة الواحدة
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">أنواع الملفات:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-blue-800 dark:text-blue-200">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span><strong>TXT:</strong> ملفات نصية عادية</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-blue-800 dark:text-blue-200">
                  <Table className="h-4 w-4 text-green-500" />
                  <span><strong>CSV:</strong> ملفات البيانات المجدولة</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* n8n Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">n8n</span>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>متصل مع n8n:</strong> ملفاتك ستتم معالجتها تلقائياً عبر workflow متقدم
              </p>
            </div>
          </div>
        </motion.div>

        {/* File Upload Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <FileUpload
            onUploadComplete={handleUploadComplete}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            acceptedTypes={['.txt', '.csv', 'text/plain', 'text/csv', 'application/csv']}
          />
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 ml-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                ملاحظات مهمة:
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• تأكد من أن ملفات CSV تحتوي على headers صحيحة</li>
                <li>• ملفات TXT يجب أن تكون بترميز UTF-8</li>
                <li>• سيتم حفظ سجل جميع العمليات في قاعدة البيانات</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            هل تحتاج مساعدة؟ تواصل معنا أو راجع الأسئلة الشائعة
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              الأسئلة الشائعة
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              تواصل معنا
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Upload
