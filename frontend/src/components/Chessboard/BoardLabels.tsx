interface BoardLabelsProps {
  squareSize: number;
  type: 'ranks' | 'files';
  isBlack?: boolean;
}

export default function BoardLabels({ squareSize, type, isBlack = false }: BoardLabelsProps) {
  const items = Array.from({ length: 8 }).map((_, i) => {
    if (type === 'ranks') {
      return isBlack ? i + 1 : 8 - i;
    } else {
      return String.fromCharCode(isBlack ? 104 - i : 97 + i);
    }
  });

  if (type === 'ranks') {
    return (
      <div className="flex flex-col justify-around h-full mr-2">
        {items.map((label, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-white font-semibold text-sm"
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-around w-full mt-2">
      {items.map((label, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-white font-semibold text-sm"
        >
          {label}
        </div>
      ))}
    </div>
  );
}