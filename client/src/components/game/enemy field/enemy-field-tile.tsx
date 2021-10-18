import {useState} from "react";
import {CropFree, LocalFireDepartment, Water} from "@mui/icons-material";
import {Cords, TileState, TileType} from "../shared/types";
import {styles} from "../shared/styles";


type AppProps = {
  size: number;
  onClick: any;
  cords: Cords;
  state: TileState,
  active: boolean
};


export default function EnemyFieldTile(props: AppProps) {
  const [tileState, setTileState] = useState(props.state);
  const handleClick = () => {
    if (props.active) {
      setTileState({...tileState, hit: true})
      props.onClick(props.cords);
    }
  }

  if (tileState.hit) {
    if (tileState.type === TileType.Ship) {
      return (
        <div style={{width: props.size, height: props.size}}>
          <LocalFireDepartment style={{...styles.maxSize, color: "orange"}}/>
        </div>
      )
    } else {
      return (
        <div style={{width: props.size, height: props.size}}>
          <Water style={{...styles.maxSize, color: "blue"}}/>
        </div>
      )
    }
  } else {
    return (
      <div style={{width: props.size, height: props.size}}
           onClick={handleClick}>
        <CropFree style={styles.maxSize}/>
      </div>
    )
  }
}