export default function Logo({ className = 'logo' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 164 36" role="img" aria-label="Clearfig">
      <path fill="currentColor" className="text-fig" d="M15.2 11.4c.2-4.4 4.4-6.8 8-5.2-2.4 1.3-4.1 3.4-4.7 5.6-1.1 0-2.3-.1-3.3-.4z" />
      <path d="M16.1 10.6c1.6.5 3 .9 4.1.7" fill="none" stroke="#F6F3EE" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M15.4 11.2c.2 1.1.5 2 .8 2.8" fill="none" className="text-fig" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path fill="currentColor" className="text-fig" d="M16.2 13.6c-4.1.7-6.6 4.1-6.4 7.8.2 3.9 3.1 6.8 6.6 6.9 3.6.1 6.6-2.8 6.8-6.6.3-3.9-2.4-7.4-7-8.1z" />
      <ellipse cx="16.4" cy="25.8" rx="1.05" ry="0.72" fill="#F6F3EE" />
      <text x="36" y="25" fill="currentColor" fontFamily="Figtree, system-ui, sans-serif" fontSize="22" fontWeight="600" letterSpacing="-0.04em">Clearfig</text>
    </svg>
  );
}
