import {useState} from "react";
import BuilderFieldTile, {States} from "./builder-field-tile";
import {Button} from "@mui/material";
import _ from "lodash";
import {Cords, Direction, TileState, TileType} from "../shared/types";


let initialField: TileState[][]

initialField = [];

for (let i: number = 0; i < 10; i++) {
  initialField[i] = [];
  for (let j: number = 0; j < 10; j++) {
    initialField[i][j] = {type: TileType.Empty, hit: false};
  }
}

const initialState: Builder = {
  count: 1,
  size: 4,
  hovered: {
    x: 0, y: 0
  },
  field: initialField,
  direction: Direction.Up
}

type Builder = {
  count: number;
  size: number;
  hovered: Cords;
  field: TileState[][],
  direction: Direction
}

type Props = {
  finished: any
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default function BuilderField(props: Props) {
  const [size, setSize] = useState(500);
  const [builderState, setBuilderState] = useState<Builder>(initialState)

  const Test = (hovered: Cords) => {
    for (let i = 0; i < builderState.size; i++) {
      if (builderState.direction === Direction.Right) {
        if (!isEmpty({y: hovered.y, x: hovered.x + i})) return false;
      } else {
        if (!isEmpty({y: hovered.y + i, x: hovered.x})) return false;
      }
    }
    return true;
  }

  const IsGreaterWithinRange = (smaller: number, bigger: number, range: number) => {
    let diff = bigger - smaller;
    return diff >= 0 && diff < range;
  }

  const isEmpty = (tile: Cords): boolean => {
    for (let y = -1; y <= 1; y++) {
      let pointer_y = tile.y + y;
      if (pointer_y >= 10) break;
      if (pointer_y < 0) continue;
      for (let x = -1; x <= 1; x++) {
        let pointer_x = tile.x + x;
        if (pointer_x >= 10) break;
        if (pointer_x < 0) continue;
        if (builderState.field[pointer_y][pointer_x].type == TileType.Ship) return false;
      }
    }
    return true;
  }

  const Compare = (tile: Cords): States => {
    if (builderState.field[tile.y][tile.x].type == TileType.Ship)
      return States.Placed;

    if (builderState.size > 0) {
      if (!isEmpty(tile))
        return States.PlacementBlocked;
      if (builderState.direction === Direction.Right) {
        if (IsGreaterWithinRange(builderState.hovered.x, tile.x, builderState.size)
          && builderState.hovered.y === tile.y) return States.PlacementInProgress;
      } else {
        if (IsGreaterWithinRange(builderState.hovered.y, tile.y, builderState.size)
          && builderState.hovered.x === tile.x) return States.PlacementInProgress;
      }
    }
    return States.Empty;
  }


  const handleHover = (cords: Cords) => {
    if (builderState.size > 0) {
      if (builderState.direction === Direction.Right) {
        if (cords.x > 10 - builderState.size)
          cords.x = 10 - builderState.size;
      } else {
        if (cords.y > 10 - builderState.size)
          cords.y = 10 - builderState.size;
      }
      if (Test(cords))
        setBuilderState({...builderState, hovered: cords})
    }
  }

  const clearField = () => {
    setBuilderState(initialState)
  }

  const rotate = () => {
    setBuilderState({
      ...builderState,
      direction: (builderState.direction === Direction.Right ? Direction.Up : Direction.Right)
    })
  }

  const autoPlacement = () => {
    let interval = setInterval(() => {
      let dir;
      let rand = Math.random();
      if (rand < 0.5) {
        dir = Direction.Up;
      } else {
        dir = Direction.Right;
      }
      let x = getRandomInt(0, 9);
      let y = getRandomInt(0, 9);
      builderState.hovered = {x: x, y: y};
      builderState.direction = dir;
      // setBuilderState({...builderState, hovered: {x: x, y: y}, direction: dir})
      if (!Test(builderState.hovered)) return;
      let arr = _.cloneDeep(builderState.field)
      for (let i = 0; i < builderState.size; i++) {
        if (builderState.direction === Direction.Right) {
          if (builderState.hovered.x + i >= 10) return;
          arr[builderState.hovered.y][builderState.hovered.x + i].type = TileType.Ship;
          arr[builderState.hovered.y][builderState.hovered.x + i].direction = builderState.direction;
        } else {
          if (builderState.hovered.y + i >= 10) return;
          arr[builderState.hovered.y + i][builderState.hovered.x].type = TileType.Ship;
          arr[builderState.hovered.y + i][builderState.hovered.x].direction = builderState.direction;
        }
      }

      if (builderState.count === 1) {
        builderState.field = arr;
        builderState.count = 6 - builderState.size;
        builderState.size = builderState.size - 1;
      } else {
        builderState.field = arr;
        builderState.count = builderState.count - 1;
      }

      setBuilderState(builderState)

      if (builderState.size === 0) {
        clearInterval(interval)
        setBuilderState({...builderState, field: arr})
      }
    }, 10)

  }

  const handleClick = () => {
    if (builderState.size > 0) {
      if (!Test(builderState.hovered)) return;
      let arr = _.cloneDeep(builderState.field)
      for (let i = 0; i < builderState.size; i++) {
        if (builderState.direction === Direction.Right) {
          if (builderState.hovered.x + i >= 10) return;
          arr[builderState.hovered.y][builderState.hovered.x + i].type = TileType.Ship;
          arr[builderState.hovered.y][builderState.hovered.x + i].direction = builderState.direction;
        } else {
          if (builderState.hovered.y + i >= 10) return;
          arr[builderState.hovered.y + i][builderState.hovered.x].type = TileType.Ship;
          arr[builderState.hovered.y + i][builderState.hovered.x].direction = builderState.direction;
        }
      }

      if (builderState.count === 1)
        setBuilderState(
          {
            ...builderState,
            field: arr,
            size: builderState.size - 1,
            count: 6 - builderState.size
          })
      else
        setBuilderState(
          {
            ...builderState,
            field: arr,
            count: builderState.count - 1
          })
    }
  }
  return (
    <>
      <h1>{builderState.size > 0 ? "Place you ships" : "Ready to start"}</h1>
      {builderState.size === 0 ?
        <div>
          <Button variant="contained"
                  onClick={() => props.finished(builderState.field)}> Start game</Button>
          <Button variant="contained" onClick={clearField}>Clear field</Button>
        </div> :
        <div>
          <Button variant="contained" onClick={clearField}>Clear field</Button>
          <Button variant="contained" onClick={rotate}>Rotate</Button>
          <Button variant="contained" onClick={autoPlacement}>Auto placement</Button>
        </div>
      }
      <div style={{width: size, height: size}}
           onClick={handleClick}>
        <div className={"field"} style={{width: size, height: size}}>
          {
            builderState.field.map((row, y) =>
              row.map(({type}, x) =>
                <BuilderFieldTile key={y + "-" + x}
                                  size={(size / 10)}
                                  cords={{x, y}}
                                  empty={type === TileType.Empty}
                                  onHover={handleHover}
                                  state={Compare({x, y})}/>
              ))
          }
        </div>
      </div>
    </>
  );
}