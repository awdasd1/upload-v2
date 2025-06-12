import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Shield, 
  Zap, 
  Users, 
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home: React.FC = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: Upload,
      title: 'رفع سهل وسريع',
      description: 'اسحب وأسقط ملفاتك أو انقر للاختيار. واجهة بسيطة وسهلة الاستخدام.'
    },
    {
      icon: Shield,
      title: 'أمان عالي',
      description: 'حماية متقدمة لملفاتك مع تشفير من الطراز الأول وحماية البيانات.'
    },
    {
      icon: Zap,
      title: 'معالجة فورية',
      description: 'معالجة سريعة للملفات باستخدام تقنيات متطورة وخوادم عالية الأداء.'
    },
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'نظام إدارة متكامل مع تتبع الملفات وسجل العمليات.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'ملف تم رفعه' },
    { number: '500+', label: 'مستخدم نشط' },
    { number: '99.9%', label: 'وقت التشغيل' },
    { number: '24/7', label: 'دعم فني' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              رفع ومعالجة الملفات
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                {' '}بأمان وسرعة
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              منصة متطورة لرفع ومعالجة الملفات مع أعلى معايير الأمان والسرعة. 
              ابدأ رحلتك الآن واستمتع بتجربة فريدة.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Upload className="ml-2 h-5 w-5" />
                  ابدأ رفع الملفات
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    إنشاء حساب مجاني
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نوفر لك أفضل الأدوات والتقنيات لضمان تجربة مثالية في رفع ومعالجة ملفاتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              انضم إلى آلاف المستخدمين الذين يثقون بمنصتنا لرفع ومعالجة ملفاتهم
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
              >
                ابدأ مجاناً الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
