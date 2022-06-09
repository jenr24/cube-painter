
import type { AppDispatch, RootState } from "../../index";
import React from "react";
import { setRotation } from "@/reducers/RotationReducer";
import { Container, useInterval } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import DrawingArea from "./DrawingArea";
import Controls from "./Controls";

type CanvasProps = {
    width: number,
    height: number,
    renderInterval: number
}

const Canvas: React.FC<CanvasProps> = ({ width, height, renderInterval }) => {

    const dispatch = useDispatch<AppDispatch>();
    const isAnimating = useSelector<RootState>((state) => state.rotation.isAnimating);
    const rotation = useSelector<RootState>((state) => state.rotation.rotation) as number[];

    useInterval(() => { // update cube animation once per frame
        if (isAnimating) dispatch(
            setRotation([
                rotation[0],
                rotation[1] + (6.28 / 600.0),
                rotation[2] + (6.28 / 900.0)
            ])
        );
    }, renderInterval)

    return(
        <Container centerContent>
            <DrawingArea width={width} height={height} renderInterval={renderInterval}/>
            <Controls />
        </Container>
    )    
};

export default Canvas;