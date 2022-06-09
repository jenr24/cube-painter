import React from "react"
import type { AppDispatch } from "../../index"
import { setColor } from "@/reducers/ColorReducer"
import { toggleAnimation } from "@/reducers/RotationReducer"
import { Container, Switch } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import ColorPickerRow from "./ColorPickerRow"

const Controls: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const toggleAnimationHandler = () => { dispatch(toggleAnimation()) }
    return (
        <Container background='purple.700' padding='0.5em' borderWidth='0.2em' borderRadius='1em' borderColor='purple.500'>
            <ColorPickerRow color1={0} color2={1} setColor={setColor} />
            <ColorPickerRow color1={2} color2={3} setColor={setColor} />
            <ColorPickerRow color1={4} color2={5} setColor={setColor} />
            <Switch onChange={toggleAnimationHandler} colorScheme="green" />
        </Container>
    )
}

export default Controls;