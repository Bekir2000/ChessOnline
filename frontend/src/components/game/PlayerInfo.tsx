import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

interface PlayerInfoProps {
  name: string;
  imageUrl?: string;
  isActive?: boolean;
  color: 'white' | 'black';
}

export default function PlayerInfo({ name, imageUrl, isActive = false, color }: PlayerInfoProps) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg bg-gray-800 border-2 ${isActive ? 'border-yellow-400' : 'border-gray-700'}`}>
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name}'s profile`}
            fill
            className="object-cover"
          />
        ) : (
          <FaUser className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-200">{name}</h3>
        <p className="text-sm text-gray-400 capitalize">{color}</p>
      </div>
    </div>
  );
}