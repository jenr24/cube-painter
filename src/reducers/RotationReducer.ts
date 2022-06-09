import { createAction, createReducer } from "@reduxjs/toolkit";

export interface RotationState {
    rotation: [number, number, number],
    isAnimating: boolean,
};

export const setRotation = createAction<[number, number, number]>("rotation/set");
export const toggleAnimation = createAction("rotation/toggleAnimation");

const initialState = {
    rotation: [0, 0, 0],
    isAnimating: false,
} as RotationState;

const RotationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setRotation, (state, action) => {
            state.rotation = action.payload;
        })
        .addCase(toggleAnimation, (state) => {
            state.isAnimating = !state.isAnimating;
        })
});

export default RotationReducer;