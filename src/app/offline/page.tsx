export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-5xl mb-4">📡</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">オフラインです</h1>
      <p className="text-gray-500 mb-6">
        インターネット接続を確認してから、もう一度お試しください。
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        再読み込み
      </button>
    </div>
  )
}
