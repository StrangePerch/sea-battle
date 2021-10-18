import {useEffect, useState} from "react";
import {compareCords, Cords, Direction, TileState, TileType} from "../shared/types";
import EnemyFieldTile from "./enemy-field-tile";

type States =
  | "WaitingForEnemyToMove"
  | "WaitingForYouToMove";

type Props = {
  onClick: any,
  field: TileState[][]
  active: boolean
}

type FieldState = {
  state: States,
  field: TileState[][]
}

export default function EnemyField(props: Props) {
  const [fieldState, setFieldState] = useState<FieldState>(
    {state: "WaitingForYouToMove", field: props.field});
  const [size, setSize] = useState(500);

  const handleClick = (cords: Cords) => {
    props.onClick(cords)
    let tile = fieldState.field[cords.y][cords.x];
    tile.hit = true;
    if (tile.type == TileType.Ship)
      checkShip(cords);
  }

  function checkShip(cords: Cords, prev?: Cords) {
    let tile = fieldState.field[cords.y][cords.x];
    if (tile.direction === undefined) return false;
    switch (tile.direction) {
      case Direction.Up:
        return (CheckDir(
          {y: cords.y - 1, x: cords.x},
          {y: cords.y + 1, x: cords.x},
          cords,
          prev))
        break;
      case Direction.Right:
        return (CheckDir(
          {y: cords.y, x: cords.x + 1},
          {y: cords.y, x: cords.x - 1},
          cords,
          prev))
        break;
    }
    return false;
  }

  function CheckDir(a: Cords, b: Cords, cords: Cords, prev?: Cords) {
    let isA, isB;
    if (prev) {
      if (a === prev) {
        isA = CheckTile(b, cords);
        isB = true;
      } else {
        isA = true;
        isB = CheckTile(a, cords);
      }
    } else {
      isA = CheckTile(b, cords);
      isB = CheckTile(a, cords);
      if (isA && isB) Destroyed(cords);
    }
    if (isA && isB) {
      return true;
    } else return false
  }

  function Destroyed(cords: Cords, prev?: Cords) {
    console.log("Destroyed! ", cords)
    console.log("Prev! ", prev)
    if (prev == undefined) prev = cords;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (cords.x + i > 9 || cords.y + j > 9 || cords.x + i < 0 || cords.y + j < 0) continue;
        let tile = fieldState.field[cords.y + j][cords.x + i];
        let target = {y: cords.y + j, x: cords.x + i};
        if (tile.hit
          && tile.type === TileType.Ship
          && !compareCords(target, cords)
          && !compareCords(target, prev)) Destroyed(target, cords)
        else tile.hit = true;
      }
    }
    setFieldState(fieldState)
  }

  function CheckTile(check: Cords, cords: Cords) {
    if (check.x > 9 || check.y > 9 || check.x < 0 || check.y < 0) return true;
    let tile = fieldState.field[check.y][check.x];
    if (tile.type === TileType.Ship) {
      if (tile.hit) {
        return checkShip({y: check.y, x: check.x}, cords);
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (props.active) {
      setFieldState({...fieldState, state: "WaitingForYouToMove"});
    } else {
      setFieldState({...fieldState, state: "WaitingForEnemyToMove"});
    }
  }, [props.active])

  return (
    <>
      <h1 style={{marginTop: "0px", textAlign: "center"}}>Enemy field</h1>
      <div style={{width: size, height: size}}>
        <div className={"field"} style={{width: size, height: size}}>
          {
            fieldState.field.map((row, y) =>
              row.map((state, x) =>
                <EnemyFieldTile key={y + "-" + x}
                                size={(size / 10)}
                                cords={{x, y}}
                                active={fieldState.state === "WaitingForYouToMove"}
                                onClick={handleClick}
                                state={state}/>
              ))
          }
        </div>
      </div>
    </>
  );
}