import Link from "next/link";
import { IconType } from "react-icons";
import clsx from "clsx";
import { getTailwindColor, TailwindColorKey } from "@/utils/colors";

interface GameModeCardProps {
  href: string;
  icon: IconType;
  title: string;
  description: string;
  iconColor: string;
  hoverColor: TailwindColorKey;
}

export default function GameModeCard({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  iconColor,
  hoverColor 
}: GameModeCardProps) {
  return (
    <Link href={href} className="group">
      <div 
        className={clsx(
          "h-full p-6 rounded-lg bg-gray-800 border-2 border-gray-700",
          "transition-all duration-300 hover:transform hover:scale-105",
          "group-hover:border-[var(--hover-color)]"
        )}
        style={{ '--hover-color': getTailwindColor(hoverColor) } as React.CSSProperties}
      >
        <div className="flex items-center justify-center mb-4">
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-center text-gray-200 group-hover:text-[var(--hover-color)]">
          {title}
        </h3>
        <p className="text-gray-400 text-center group-hover:text-[var(--hover-color)]">
          {description}
        </p>
      </div>
    </Link>
  );
}