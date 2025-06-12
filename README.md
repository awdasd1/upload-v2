# تطبيق رفع الملفات الحديث

تطبيق ويب حديث لرفع ومعالجة الملفات مع واجهة عربية RTL وتكامل مع Supabase و n8n.

## المميزات

- 🚀 واجهة حديثة وسريعة مع React و TypeScript
- 🎨 تصميم متجاوب مع دعم الوضع المظلم
- 🔐 نظام مصادقة آمن مع Supabase
- 📁 رفع الملفات بالسحب والإفلات
- ⚡ معالجة الملفات عبر n8n webhooks
- 🌙 دعم الوضع المظلم والفاتح
- 📱 تصميم متجاوب لجميع الأجهزة
- 🔄 تتبع حالة رفع الملفات في الوقت الفعلي
- 📊 لوحة تحكم شاملة لإدارة الملفات

## التقنيات المستخدمة

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI/UX**: Framer Motion, Lucide Icons
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **File Processing**: n8n Webhooks
- **Styling**: Cairo Font, RTL Support
- **Build Tool**: Vite

## التثبيت والتشغيل

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd file-upload-app
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

أضف قيم Supabase و n8n في ملف `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

4. **إعداد قاعدة البيانات**

أنشئ جدول `file_uploads` في Supabase:
```sql
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
  webhook_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_status ON file_uploads(upload_status);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at DESC);

-- تمكين RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- سياسة الأمان
CREATE POLICY "Users can view own files" ON file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files" ON file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON file_uploads
  FOR DELETE USING (auth.uid() = user_id);
```

5. **تشغيل التطبيق**
```bash
npm run dev
```

## إعداد n8n Webhook

1. أنشئ workflow جديد في n8n
2. أضف Webhook node كنقطة البداية
3. قم بمعالجة الملف حسب احتياجاتك
4. أرجع response يحتوي على:
```json
{
  "success": true,
  "downloadUrl": "https://example.com/processed-file.pdf",
  "message": "تم معالجة الملف بنجاح"
}
```

## البنية

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
├── contexts/           # React Contexts
├── lib/               # المكتبات والإعدادات
├── pages/             # صفحات التطبيق
├── utils/             # الوظائف المساعدة
└── types/             # تعريفات TypeScript
```

## المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push إلى Branch
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم

للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل معنا.
