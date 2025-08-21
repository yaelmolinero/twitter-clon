interface Props { 
  value: number;
  max: number;
  className?: string;
}

function CircularProgress({ value, max, className }: Props) {
  const radius = 18; // Radio del círculo
  const circumference = 2 * Math.PI * radius; // Perímetro del círculo
  const progress = Math.min(value / max, 1) * circumference; // Progreso calculado

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className={className}>
      {/* Fondo del círculo */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        strokeWidth="4"
        stroke="currentColor"
        fill="transparent"
      />
      {/* Progreso */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        strokeWidth="4"
        stroke="#1d9bf0"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CircularProgress;
