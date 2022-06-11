// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from "socket.io";
import { v4 } from "uuid";
const games = {};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    res.socket.server.io.on("connection", (socket) => {
      socket.on("new-game", (msg) => {
        const { gameid, pieces } = msg;
        const playerId = v4();
        games[gameid] = { players: [playerId], turn: playerId, pieces };

        socket?.emit("start", { playerId, pieces, currentTurn: playerId });
      });

      socket.on("join-game", (msg) => {
        const { gameid } = msg;
        const playerId = v4();
        games[gameid].players.push(playerId);

        socket?.emit("start", {
          playerId,
          pieces: games[gameid].pieces,
          currentTurn: games[gameid].turn,
        });
      });

      socket.on("play", (msg) => {
        const { gameid, playerId, pieces } = msg;
        const index = games[gameid].players.indexOf(playerId);
        const currentTurn =
          index === games[gameid].players.length - 1
            ? games[gameid].players[0]
            : games[gameid].players[index + 1];
        games[gameid].turn = currentTurn;
        games[gameid].pieces = pieces;
        socket?.broadcast.emit("switch", { currentTurn, pieces });
      });

      socket.on("toggle", (msg) => {
        const { gameid, pieces } = msg;
        games[gameid].pieces = pieces;
        socket?.broadcast.emit("toggle", { pieces });
      });
    });
  }
  res.end();
}
