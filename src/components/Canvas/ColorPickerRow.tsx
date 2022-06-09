import type { AppDispatch, RootState } from '../../index'
import { Flex, Spacer } from "@chakra-ui/react"
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { RgbColor } from "react-colorful";
import { useDispatch, useSelector } from "react-redux";
import React from 'react';
import ColorPicker from './ColorPicker';

export interface ColorPickerRowProps {
    color1: number, color2: number,
    setColor: ActionCreatorWithPayload<[number, number[]], string>
} 

const ColorPickerRow: React.FC<ColorPickerRowProps> = ({ color1, color2, setColor }) => {
    const dispatch = useDispatch<AppDispatch>();
    const colors = useSelector<RootState>((state) => state.colors.colors) as number[][];

    const updateColorHandler = (
        n: number, 
        setColor: ActionCreatorWithPayload<[number, number[]], string>
    ) => (
        color: RgbColor
    ): void => {
        let { r, g, b } = color;
        if (!r || !g || !b ) return;
        dispatch(setColor([n, [r / 255.0, g / 255.0, b / 255.0, 1.0]]));
    }
    
    return (
        <Flex direction="row" justify='center' margin="1em">
            <ColorPicker color={colors[color1]} setColor={updateColorHandler(color1, setColor)} />
            <Spacer />
            <ColorPicker color={colors[color2]} setColor={updateColorHandler(color2, setColor)}/>
        </Flex>
    )
}

export default ColorPickerRow;