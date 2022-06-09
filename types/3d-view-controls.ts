declare module '3d-view-controls' {
    import type { vec3, mat4 } from "gl-matrix";
    export default function createCamera(
        canvas: HTMLCanvasElement, 
        cameraOption: { 
            eye: vec3; center: vec3; 
            zoomMax: number; zoomSpeed: number; 
    }): Camera;

    export interface Camera {
        tick: () => boolean;
        matrix: mat4
    }
}