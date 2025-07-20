const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-2xl">⚽</span>
        </div>
      </div>
      <p className="text-gray-400 text-lg">جاري تحميل البيانات الحقيقية...</p>
      <p className="text-gray-500 text-sm">يرجى الانتظار قليلاً</p>
    </div>
  </div>
);

export default LoadingComponent; 