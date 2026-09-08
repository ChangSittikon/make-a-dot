export default function TrustShield({ directorName, message }: { directorName: string; message?: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-prompt border border-emerald-200">
      <svg className="w-4 h-4 text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM10 14a1 1 0 100-2 1 1 0 000 2zm1-4a1 1 0 00-2 0v-2a1 1 0 002 0v2z" clipRule="evenodd" />
      </svg>
      <span className="text-xs font-semibold">
        {message || `Endorsed by ${directorName}`}
      </span>
    </div>
  );
}
