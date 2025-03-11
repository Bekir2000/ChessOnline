import { RiDice5Line } from "react-icons/ri";
import { FaUserFriends, FaDesktop } from "react-icons/fa";
import GameModeCard from "@/components/home/GameModeCard";
import { GameModeGrid } from "@/components/home/GameModeGrid";

export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] text-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Chess Online
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Play chess with players from around the world. Challenge friends, improve your skills, and have fun!
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <GameModeGrid />
          </div>
        </div>
      </div>
    </main>
  );
}