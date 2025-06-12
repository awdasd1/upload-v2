import React from 'react'
import { Heart } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 space-x-reverse text-gray-600 dark:text-gray-400">
            <span>صُنع بـ</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>في عام 2024</span>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
            جميع الحقوق محفوظة © تطبيق رفع الملفات
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
