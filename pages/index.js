import Head from "next/head";
import Menu from "./components/menu";
import GameGrid from "./components/game-grid";
import { useState } from "react";

export default function Home() {
  const [size, setSize] = useState(8);
  const [type, setType] = useState("NUM");
  const handleSelectSize = (size) => {
    setSize(Number(size));
  };

  const handleSelectType = (type) => setType(type);

  return (
    <div>
      <Head>
        <title>Memory Game</title>
      </Head>

      <Menu
        type={type}
        size={size}
        onSelectSize={handleSelectSize}
        onSelectType={handleSelectType}
      />

      <main className="px-3 flex justify-center items-center">
        <GameGrid type={type} size={size} />
      </main>

      <footer></footer>
    </div>
  );
}
