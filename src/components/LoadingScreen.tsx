export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-navy flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-gold font-display text-2xl mb-4">SK Capital</div>
        <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gold animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
