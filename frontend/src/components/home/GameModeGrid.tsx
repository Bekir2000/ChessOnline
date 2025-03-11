import { RiDice5Line } from "react-icons/ri";
import { FaUserFriends, FaDesktop } from "react-icons/fa";
import GameModeCard from "./GameModeCard";

export function GameModeGrid() {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Game Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GameModeCard
          href="/game"
          icon={RiDice5Line}
          title="Random Opponents"
          description="Play live chess games against opponents from around the world"
          iconColor="text-blue-500"
          hoverColor="blue-500"
        />
        <GameModeCard
          href="/game?mode=friend"
          icon={FaUserFriends}
          title="Play with Friends"
          description="Challenge your friends to a game and track your progress together"
          iconColor="text-purple-600"
          hoverColor="purple-600"
        />
        <GameModeCard
          href="/game?mode=computer"
          icon={FaDesktop}
          title="Computer Opponent"
          description="Practice and improve your skills against AI at various difficulty levels"
          iconColor="text-green-500"
          hoverColor="green-500"
        />
      </div>
    </div>
  );
}