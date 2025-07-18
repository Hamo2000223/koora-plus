import { Award, Globe, Heart, Shield, Target, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Globe,
      title: 'تغطية عالمية',
      description: 'نغطي أكثر من 100 دوري ومسابقة حول العالم'
    },
    {
      icon: Zap,
      title: 'تحديثات فورية',
      description: 'نتائج مباشرة وإحصائيات محدثة لحظة بلحظة'
    },
    {
      icon: Shield,
      title: 'مصادر موثوقة',
      description: 'معلومات دقيقة من مصادر رسمية معتمدة'
    },
    {
      icon: Heart,
      title: 'شغف كروي',
      description: 'فريق من عشاق كرة القدم يعمل بحب واهتمام'
    }
  ];

  const stats = [
    { number: '100+', label: 'دوري ومسابقة' },
    { number: '1000+', label: 'فريق مسجل' },
    { number: '50K+', label: 'مباراة مؤرشفة' },
    { number: '24/7', label: 'تحديث مستمر' }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img src="/logo.svg" alt="logo" className="h-24" />
      </div>
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          من نحن
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          نحن منصة رياضية متخصصة في تقديم أشمل تغطية لعالم كرة القدم،
          من النتائج المباشرة إلى التحليلات المعمقة والإحصائيات الدقيقة
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-gray-400" />
              <h2 className="text-3xl font-bold text-white">رسالتنا</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              نهدف إلى أن نكون المصدر الأول والأكثر موثوقية لمحبي كرة القدم في العالم العربي،
              من خلال تقديم محتوى عالي الجودة وتجربة مستخدم استثنائية.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">رؤيتنا</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              نسعى لتكون منصتنا الوجهة الرئيسية لكل ما يتعلق بكرة القدم،
              حيث يجد المستخدم كل ما يحتاجه من معلومات وإحصائيات وأخبار في مكان واحد.
            </p>
          </div>
          <div className="text-center">
            <div className="text-8xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">التميز في الخدمة</h3>
            <p className="text-gray-300">نلتزم بتقديم أفضل تجربة ممكنة لمستخدمينا</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-12">ما يميزنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 lg:p-12 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">أرقامنا تتحدث</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white text-center mb-12">قيمنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">الدقة</h3>
            <p className="text-gray-300">نلتزم بتقديم معلومات دقيقة وموثوقة من مصادر معتمدة</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-3">السرعة</h3>
            <p className="text-gray-300">نحرص على تقديم الأخبار والنتائج بأسرع وقت ممكن</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-white mb-3">الشفافية</h3>
            <p className="text-gray-300">نؤمن بالشفافية الكاملة في جميع تعاملاتنا مع المستخدمين</p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">تواصل معنا</h2>
        <p className="text-gray-300 mb-6">
          هل لديك اقتراح أو استفسار؟ نحن نحب أن نسمع منك
        </p>
        <button
          onClick={() => navigate('/contact')}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
        >
          اتصل بنا الآن
        </button>
      </div>
    </div>
  );
};

export default About; 