import Head from "next/head";
import Menu from "../components/menu";
import GameGrid from "../components/game-grid";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";
import { createPieces } from "../models/model";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [size, setSize] = useState(8);
  const [type, setType] = useState("NUM");
  const [playerId, setPlayerId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameid, setGameId] = useState(null);
  const [pieces, setPieces] = useState(null);

  const handleSelectSize = (size) => {
    setSize(Number(size));
  };

  const handleSelectType = (type) => setType(type);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    if (!socket) {
      const s = io();
      s.on("connect", () => {
        console.log("Connected");
      });

      s.on("start", (msg) => {
        const { playerId, pieces, currentTurn } = msg;
        setPlayerId(playerId);
        setPieces(pieces);
        setCurrentTurn(currentTurn);
      });

      s.on("switch", (msg) => {
        const { currentTurn, pieces } = msg;
        setCurrentTurn(currentTurn);
        setPieces(pieces);
      });

      s.on("toggle", (msg) => {
        const { pieces } = msg;
        setPieces(pieces);
      });

      setSocket(s);
    }
  };

  useEffect(() => {
    socketInitializer();
  }, [socket]);

  const createGame = () => {
    const gameid = v4();
    const pieces = createPieces(size, type);
    socket?.emit("new-game", { gameid, pieces });
    window.history.pushState(null, null, `?gameid=${gameid}`);
    setGameId(gameid);
  };

  const handleNewGame = () => createGame();

  const handleJoinGame = () => {
    const search = new URLSearchParams(window.location.search);
    const gameid = search.get("gameid");
    if (!gameid) {
      createGame();
    } else {
      socket?.emit("join-game", { gameid });
      setGameId(gameid);
    }
  };

  const handleSwitchTurn = (pieces) => {
    socket?.emit("play", { playerId, gameid, pieces });
  };

  const handleToggle = (pieces) => {
    socket?.emit("toggle", { playerId, gameid, pieces });
  };

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
        onNewGame={handleNewGame}
        onJoinGame={handleJoinGame}
      />
      {playerId && (
        <main className="px-3 flex justify-center items-center">
          <GameGrid
            canPlay={currentTurn === playerId}
            pieces={pieces}
            onSwitchTurn={handleSwitchTurn}
            onToggle={handleToggle}
          />
        </main>
      )}
      <footer></footer>
    </div>
  );
}
