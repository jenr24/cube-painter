import React from "react";
import { useGPU } from "@/GPUHook";
import { Box } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";

type MouseDragState = "hover" | "drag"

interface DrawingAreaProps {
    width: number;
    height: number;
    renderInterval: number;
}

const DrawingArea: React.FC<DrawingAreaProps> = ({width, height, renderInterval}) => {

    const canvas = useRef(null);
    const [dragging, setDragging] = useState<MouseDragState>("hover");

    useEffect(() => {
        document.addEventListener("mouseup", (_e) => {
            setDragging('hover');
        })
    }, [])

    useGPU(() => canvas.current, renderInterval);

    const setDraggingHandler = () => {
        setDragging("drag");
    }

    return(
        <Box 
            width={width + 30} 
            height={height + 30} 
            marginBottom='1em' 
            borderWidth='15px' 
            borderColor='purple.900' 
            borderRadius='1em'
        >
            <canvas 
                style={{cursor: (dragging === 'drag' ? 'grabbing' : 'grab')}} 
                width={width} 
                height={height} 
                ref={canvas} 
                onMouseDown={setDraggingHandler}
            />
        </Box>
    )
}

export default DrawingArea;