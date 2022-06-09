import React from "react"
import { NumberArrayToColor } from "@/lib"
import { RgbColor, RgbColorPicker } from "react-colorful"

export interface ColorPickerProps {
    color: number[],
    setColor: (color: RgbColor) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({color, setColor}) => {
    return(
        <RgbColorPicker color={NumberArrayToColor(color)} onChange={setColor} />
    )
}

export default ColorPicker;