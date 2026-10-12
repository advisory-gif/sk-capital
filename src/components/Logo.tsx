export default function Logo({ className = 'logo' }: { className?: string }) {
  return <img className={className} src="/logo.svg" alt="Clearfig" width={332} height={100} decoding="async" />;
}
