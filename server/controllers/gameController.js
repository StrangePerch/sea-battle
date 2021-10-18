let player = undefined;

exports.Move = (req, res) => {

}

exports.FindGame = (req, res) => {
  if (!req.user) {
    res.send("Session is not valid")
  } else {
    console.log("FindGame: ", req.user);
    if (player && player != req.user) {
      console.log("Found");
      res.send({status: "Found", player: player});
    } else {
      player = req.user;
      res.send({status: "Looking for second player", player: undefined});
    }
  }
}