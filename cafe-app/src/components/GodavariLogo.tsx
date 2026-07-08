export default function GodavariLogo({ size = 64, className = "" }: { size?: number, className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="Godavari Logo" 
      width={size} 
      height={size} 
      className={`object-contain mix-blend-multiply contrast-125 brightness-110 ${className}`}
    />
  );
}
