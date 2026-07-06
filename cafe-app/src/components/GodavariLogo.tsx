export default function GodavariLogo({ size = 64, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 120" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. Bold serif capital 'G' at the top */}
      <text x="50" y="45" fontFamily="serif" fontWeight="bold" fontSize="48" textAnchor="middle" fill="currentColor">
        G
      </text>

      {/* 2. Symmetrical lotus/palash leaf motif below the G */}
      <path 
        d="M50 55 
           C40 65, 30 75, 50 85 
           C70 75, 60 65, 50 55 Z" 
        fill="currentColor" 
      />
      <path 
        d="M45 65 
           C30 70, 20 80, 48 83 
           C48 83, 35 75, 45 65 Z" 
        fill="currentColor" 
      />
      <path 
        d="M55 65 
           C70 70, 80 80, 52 83 
           C52 83, 65 75, 55 65 Z" 
        fill="currentColor" 
      />

      {/* 3. Two thin wavy horizontal lines beneath the leaf */}
      <path d="M25 95 Q 37.5 90, 50 95 T 75 95" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M25 105 Q 37.5 100, 50 105 T 75 105" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
