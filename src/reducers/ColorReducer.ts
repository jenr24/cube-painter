import { createAction, createReducer } from "@reduxjs/toolkit";

export interface ColorState {
    colors: number[][],
    size: number
}

export const setColor = createAction<[number, number[]]>('color/set');

const initalState = {
    colors: [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0]
    ],
    size: 6
} as ColorState;

const ColorReducer = createReducer(initalState, (builder) => {
    builder
        .addCase(setColor, (state, action) => {
            const [index, color] = action.payload;
            if (index < state.size) state.colors[index] = color;
        })
});

export default ColorReducer;