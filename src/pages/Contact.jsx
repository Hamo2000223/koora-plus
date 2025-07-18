import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquare, Phone, Send, User } from 'lucide-react';
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage({ type: 'success', text: 'تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.' });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setMessage(null);
      }, 3000);
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    'استفسار عام',
    'مشكلة تقنية',
    'اقتراح تحسين',
    'شكوى',
    'طلب معلومات',
    'أخرى'
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@footballsite.com',
      description: 'راسلنا عبر البريد الإلكتروني',
      color: 'bg-blue-600'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '+966 50 123 4567',
      description: 'اتصل بنا مباشرة',
      color: 'bg-green-600'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'الرياض، السعودية',
      description: 'موقعنا الرئيسي',
      color: 'bg-red-600'
    },
    {
      icon: MessageSquare,
      title: 'ساعات العمل',
      value: '24/7',
      description: 'متاحون على مدار الساعة',
      color: 'bg-purple-600'
    }
  ];

  const faqs = [
    {
      question: 'كيف يمكنني إضافة مباراة جديدة؟',
      answer: 'يمكنك الوصول إلى لوحة التحكم وإضافة مباراة جديدة من خلال نموذج إضافة المباراة.'
    },
    {
      question: 'هل يمكنني تعديل نتائج المباريات؟',
      answer: 'نعم، يمكن للمدير تعديل نتائج المباريات من خلال نموذج النتائج.'
    },
    {
      question: 'كيف يمكنني إضافة فريق جديد؟',
      answer: 'يمكن إضافة فرق جديدة من خلال نموذج إضافة الفريق في لوحة التحكم.'
    },
    {
      question: 'هل الموقع يدعم اللغة العربية؟',
      answer: 'نعم، الموقع يدعم اللغة العربية بشكل كامل مع واجهة مستخدم محسنة.'
    }
  ];

  if (message?.type === 'success') {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="bg-[#333333] rounded-2xl p-12 text-center max-w-md w-full border border-[#0e0e0e] shadow-2xl">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">تم إرسال رسالتك بنجاح!</h2>
          <p className="text-lg text-white mb-6">
            شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
          <div className="text-4xl animate-bounce">🎉</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in bg-[#0e0e0e]">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img src="/logo.svg" alt="logo" className="h-24" />
      </div>
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-[#333333] to-[#0e0e0e] rounded-2xl p-12 text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          تواصل معنا
        </h1>
        <p className="text-xl max-w-3xl mx-auto leading-relaxed">
          نحن هنا للإجابة على استفساراتك ومساعدتك. لا تتردد في التواصل معنا
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => {
          const Icon = info.icon;
          return (
            <div key={index} className="bg-[#333333] rounded-xl shadow-lg border border-[#0e0e0e] p-6 text-center hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`inline-flex items-center justify-center w-12 h-12 ${info.color} rounded-full mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
              <p className="text-white font-medium mb-2">{info.value}</p>
              <p className="text-sm text-white">{info.description}</p>
            </div>
          );
        })}
      </div>

      {/* Contact Form and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#333333] rounded-xl shadow-lg border border-[#0e0e0e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#0e0e0e] rounded-full flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">أرسل لنا رسالة</h2>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                ? 'bg-green-900/50 border border-green-700 text-green-300'
                : 'bg-red-900/50 border border-red-700 text-red-300'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                موضوع الرسالة
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-shadow-sm"
                required
              >
                <option value="">اختر موضوع الرسالة</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                الرسالة
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="اكتب رسالتك هنا..."
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-shadow-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* FAQ */}
          <div className="bg-[#333333] rounded-xl shadow-lg border border-[#0e0e0e] p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-white" />
              أسئلة شائعة
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#0e0e0e] pb-4 last:border-b-0">
                  <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                  <p className="text-sm text-white leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-gradient-to-br from-[#333333] to-[#0e0e0e] rounded-xl p-6 text-center border border-[#0e0e0e]">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-white mb-2">موقعنا</h3>
            <p className="text-white mb-4">
              نحن موجودون في الرياض، المملكة العربية السعودية
            </p>
            <div className="bg-[#333333] rounded-lg p-4 text-right shadow-sm">
              <p className="text-sm text-white">
                <strong className="text-white">العنوان التفصيلي:</strong><br />
                طريق الملك فهد، حي العليا<br />
                الرياض، المملكة العربية السعودية 11564
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gradient-to-r from-[#333333] to-[#0e0e0e] rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-4">تابعنا على وسائل التواصل</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all flex items-center gap-2">
                <span className="text-xl">📘</span>
                <span className="text-sm">فيسبوك</span>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all flex items-center gap-2">
                <span className="text-xl">🐦</span>
                <span className="text-sm">تويتر</span>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all flex items-center gap-2">
                <span className="text-xl">📷</span>
                <span className="text-sm">إنستغرام</span>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all flex items-center gap-2">
                <span className="text-xl">📺</span>
                <span className="text-sm">يوتيوب</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 