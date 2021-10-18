import {useEffect, useState} from "react";
import YourFieldTile from "./your-field-tile";
import {TileState} from "../shared/types";

type Props = {
  field: TileState[][]
}

export default function YourField(props: Props) {
  const [size, setSize] = useState(500);
  const [field, setField] = useState(props.field);

  useEffect(() => {
    setField(props.field)
  }, [props.field])

  return (
    <>
      <h1 style={{marginTop: "0px", textAlign: "center"}}>Your field</h1>
      <div style={{width: size, height: size}}>
        <div className={"field"} style={{width: size, height: size}}>
          {
            props.field.map((row, y) =>
              row.map((state, x) =>
                <YourFieldTile key={y + "-" + x}
                               size={(size / 10)}
                               state={state}/>
              ))
          }
        </div>
      </div>
    </>
  );
}