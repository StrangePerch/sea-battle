import {CropSquare, LocalFireDepartment, Water} from "@mui/icons-material";
import {styles} from "../shared/styles";
import {TileState, TileType} from "../shared/types";

type AppProps = {
  size: number,
  state: TileState
};

export default function YourFieldTile(props: AppProps) {
  switch (props.state.type) {
    case TileType.Ship:
      if (props.state.hit) {
        return (
          <div style={{width: props.size, height: props.size}}>
            <LocalFireDepartment style={{...styles.maxSize, color: "orange"}}/>
          </div>
        )
      } else {
        return (
          <div style={{width: props.size, height: props.size}}>
            <CropSquare
              style={styles.maxSize}/>
          </div>
        )
      }
    default:
      if (props.state.hit) {
        return (
          <div style={{width: props.size, height: props.size}}>
            <Water style={{...styles.maxSize, color: "gray"}}/>
          </div>
        )
      } else {
        return (
          <div style={{width: props.size, height: props.size}}>
            <Water style={{...styles.maxSize, color: "blue"}}/>
          </div>
        )
      }

  }
}