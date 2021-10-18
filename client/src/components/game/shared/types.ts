export type Cords = {
  x: number;
  y: number;
}

export function compareCords(a: Cords, b: Cords) {
  return a.x === b.x && a.y === b.y;
}

export enum TileType {
  Empty,
  Ship
}

export type TileState = {
  type: TileType,
  hit: boolean,
  direction?: Direction
}

export enum Direction {
  Up,
  Right
}