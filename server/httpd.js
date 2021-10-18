﻿const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors")

const router = require("./routes");

const app = express();

const mongoUri =
  "mongodb+srv://StrangePerch:Vn5vAyfilAljxFLq@cluster0.pmjjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// noinspection JSCheckFunctionSignatures
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true
}))

app.use(cookieParser("secretcode"))
app.use(passport.initialize());
app.use(passport.session())
require("./passportConfig")(passport);
app.use(router);

let port = 3001;

// noinspection JSCheckFunctionSignatures
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true},
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    app.listen(port, () => {
      console.log("Server started");
      console.log("http://localhost:" + port);
    });
  }
);

const Server = require("socket.io")
const io = Server(2999,
  {
    cors: {
      origin: "*"
    }
  });

let queue = []
let games = []

io.on("connection", (socket) => {
  let client;
  console.log("Got connection!");
  socket.on("looking-for-game", (username) => {
    if (!client) {
      console.log("looking-for-game: ", username);
      client = {username, socket};
      while (true) {
        if (queue.length === 0) {
          console.log("pushed to the queue: ", client.username)
          queue.push(client);
          break;
        }
        if (queue.length > 0) {
          let player = queue.pop();
          if (player.socket.connected) {
            socket.emit("player-found", player.username)
            player.socket.emit("player-found", client.username)
            console.log("game found: ", client.username, " - ", player.username)
            games.push({player1: player, player2: client})
            break;
          } else {
            console.log("Got disconnected inside queue: ", player.username)
            handleDisconnect(player?.socket)
          }
        }
      }
    }
  })
  socket.on('disconnect', function () {
    console.log('Got disconnect! ', client?.username);
    let i = queue.indexOf(client);
    queue.splice(i, 1);
    handleDisconnect(client?.socket)
  });
  socket.on('shot', (cords) => {
    for (const game of games) {
      if (game.player2.field && game.player2.field) {
        if (game.player1.socket == client.socket) {
          console.log("player1 shot at: ", cords)
          game.player2.socket.emit("shot", cords);
          if (game.player2.field[cords.y][cords.x].type)
            game.player1.socket.emit("turn");
          else
            game.player2.socket.emit("turn");
        }
        if (game.player2.socket == client.socket) {
          console.log("player2 shot at: ", cords)
          game.player1.socket.emit("shot", cords);
          if (game.player1.field[cords.y][cords.x].type)
            game.player2.socket.emit("turn");
          else
            game.player1.socket.emit("turn");
        }
      }
    }
  })
  socket.on('field', (field) => {
    for (const game of games) {
      if (game.player1.field && game.player2.field) {
        continue;
      }
      if (game.player1.socket == client.socket) {
        game.player1.field = field;
        if (game.player1.field && game.player2.field) {
          console.log("Got field from both players")
          game.player1.socket.emit("field", game.player2.field)
          game.player2.socket.emit("field", game.player1.field)
          giveFirstTurn(game.player1.socket, game.player2.socket);
        }
      }
      if (game.player2.socket == client.socket) {
        game.player2.field = field;
        if (game.player1.field && game.player2.field) {
          console.log("Got field from both players")
          game.player2.socket.emit("field", game.player1.field)
          game.player1.socket.emit("field", game.player2.field)
          giveFirstTurn(game.player1.socket, game.player2.socket);
        }
      }
    }
  })
})

function handleDisconnect(socket) {
  let to_del;
  for (const game of games) {
    if (game.player1.socket == socket) {
      console.log("Player1 disconnected from game in process")
      game.player1.socket.emit("enemy-disconnected")
      to_del = game;
    }
    if (game.player2.socket == socket) {
      console.log("Player2 disconnected from game in process")
      game.player2.socket.emit("enemy-disconnected")
      to_del = game;
    }
  }
  if (to_del) {
    games.splice(games.indexOf(to_del), 1)
    console.log("Game deleted")
  }
}

function giveFirstTurn(socket1, socket2) {
  let rand = Math.random();
  if (rand < 0.5) {
    socket1.emit("turn");
    console.log("Player1 got first turn")
  } else {
    socket2.emit("turn");
    console.log("Player2 got first turn")
  }
}