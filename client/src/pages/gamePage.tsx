import React, {useEffect, useState} from "react";
import {Grid, Paper} from "@mui/material";
import YourField from "../components/game/your field/your-field";
import EnemyField from "../components/game/enemy field/enemy-field";
import {Cords, TileState} from "../components/game/shared/types";
import _ from "lodash";

type Props = {
  yourField: TileState[][],
  enemyField: TileState[][],
  socket: any
}

export default function GamePage(props: Props) {
  if (!props.yourField || !props.enemyField) throw "field is undefined";
  const [active, setActive] = useState(false);
  let [yourField, setYourField] = useState(props.yourField);

  useEffect(() => {
    props.socket.on("turn", () => {
      setActive(true);
    })

    props.socket.on("shot", (cords: Cords) => {
      let temp = _.cloneDeep(yourField);
      temp[cords.y][cords.x].hit = true;
      yourField = temp;
      setYourField(temp);
    })
  }, [])

  const handleShot = (cords: Cords) => {
    if (active) {
      props.socket.emit("shot", cords);
      setActive(false);
    }
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{minHeight: '100vh', backgroundColor: "#b4d3ff"}}
    >
      <h1>{active ? "Your turn" : "Enemy turn"}</h1>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{minHeight: '100%'}}
      >
        <Paper style={{padding: '20px', backgroundColor: "#d2ffb4"}}>
          <YourField field={yourField}/>
        </Paper>
        <Paper style={{padding: '20px', backgroundColor: "#d2ffb4", marginLeft: "100px"}}>
          <EnemyField onClick={handleShot} field={props.enemyField} active={active}/>
        </Paper>
      </Grid>
    </Grid>
  )
}