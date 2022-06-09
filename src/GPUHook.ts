import { vec3, mat4 } from "gl-matrix";
import createCamera, { Camera } from '3d-view-controls';
import { useEffect, useState } from "react";
import { CheckWebGPU, CreateGPUBuffer, CreateTransforms, CreateViewProjection, Float32ArrayContaining } from "./lib";
import { CubeData } from "./vertex_data";
import { Shader } from "./shader";
import type { ColorState } from "./reducers/ColorReducer";
import { useSelector } from "react-redux";
import type { RootState } from ".";
import type { RotationState } from "./reducers/RotationReducer";
import { useInterval } from "@chakra-ui/react";

export interface CameraOption {
    eye: vec3;
    center: vec3;
    zoomMax: number;
    zoomSpeed: number;
}

export interface ViewProjection {
    viewMatrix: mat4;
    projectionMatrix: mat4;
    viewProjectionMatrix: mat4;
    cameraOption: CameraOption;
}


export interface MatrixState {
    mvpMatrix: mat4,
    vpMatrix: mat4,
    modelMatrix: mat4,
    vMatrix: vec3,
}

export interface GPUHandle {
    device: GPUDevice,
    context: GPUCanvasContext,
    format: GPUTextureFormat,
    vertexBuffer: GPUBuffer,
    colorBuffer: GPUBuffer,
    uniformBuffer: GPUBuffer,
    numberOfVertices: number,
    matrices: MatrixState,
    camera: Camera,
    viewProjection: ViewProjection,
}

export const useGPU = (getCanvas: () => HTMLCanvasElement | null, renderInterval: number) => {

    /** Does your browser support WebGPU */
    if(CheckWebGPU().includes('Your current browser does not support WebGPU!')){
        console.log(CheckWebGPU());
        throw('Your current browser does not support WebGPU!');
    }

    const colorState: ColorState = useSelector<RootState>((state) => state.colors) as ColorState;
    if (colorState.size != 6) return null;
    const rotationState = useSelector<RootState>((state) => state.rotation) as RotationState;

    const [handle, setHandle] = useState<GPUHandle | null>(null);


    /** initialize **/
    useEffect(() => {
        const initializeGPU = async () => {
            let canvas = getCanvas();
            while (canvas === null) { canvas = getCanvas() }
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter === null) throw('adapter not found');

            const device = await adapter.requestDevice();
            if (device === null) throw('device not found');

            const cubeData = CubeData();
            const numberOfVertices = cubeData.positions.length / 3;
            const vertexBuffer = CreateGPUBuffer(device, cubeData.positions);
            const colorBuffer = device.createBuffer({
                size: 6 * 4 * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
            })

            const format = 'bgra8unorm';
            const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
            context.configure({
                device: device, format: format
            });

            // create uniform data
            const modelMatrix = mat4.create();
            const mvpMatrix = mat4.create();
            let vMatrix = mat4.create();
            let vpMatrix = mat4.create();
            const viewProjection = CreateViewProjection(canvas.width/canvas.height);
            vpMatrix = viewProjection.viewProjectionMatrix;

            // create uniform buffer and bind group
            const uniformBuffer = device.createBuffer({
                size: 64,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });

            const matrices = { mvpMatrix, vpMatrix, modelMatrix, vMatrix } as MatrixState;
            
            var camera = createCamera(canvas, viewProjection.cameraOption);

            setHandle({
                device, context, format,
                vertexBuffer, colorBuffer, uniformBuffer,
                numberOfVertices, matrices,
                camera, viewProjection
            } as GPUHandle);
        }; initializeGPU();
    }, []);

    /** render **/
    useInterval(() => {
        if (handle === null) return;
        const shader = Shader();
        const rotation = rotationState.rotation;
        const colors = colorState.colors;

        let canvas = getCanvas();
        if (canvas === null) return;

        const pipeline = handle.device.createRenderPipeline({
            vertex: {
                module: handle.device.createShaderModule({                    
                    code: shader.vertex
                }),
                entryPoint: "main",
                buffers:[
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float32x3",
                            offset: 0,
                        }]
                    },
                ]
            },
            fragment: {
                module: handle.device.createShaderModule({                    
                    code: shader.fragment
                }),
                entryPoint: "main",
                targets: [{
                    format: handle.format as GPUTextureFormat
                }],
            },
            primitive:{
                topology: "triangle-list",
                cullMode: 'back'
            },
            depthStencil:{
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            layout: handle.device.createPipelineLayout({
                bindGroupLayouts: [
                    handle.device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: { type: 'uniform', minBindingSize: 64 }
                            },
                            {
                                binding: 1,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: { type: 'read-only-storage', minBindingSize: 96 }
                            }
                        ]
                    }),
                ]
            })
        });

        const uniformBindGroup = handle.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: handle.uniformBuffer,
                        offset: 0,
                        size: 64
                    }
                },

                {
                    binding: 1,
                    resource: {
                        buffer: handle.colorBuffer,
                    }
                }
            ]
        });

        const textureView = handle.context.getCurrentTexture().createView();
        const depthTexture = handle.device.createTexture({
            size: [canvas.width, canvas.height, 1],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        var { mvpMatrix, vpMatrix, modelMatrix } = handle.matrices;

        if(handle.camera.tick()) {
            const pMatrix = handle.viewProjection.projectionMatrix;
            mat4.multiply(vpMatrix, pMatrix, handle.camera.matrix);
            setHandle({...handle, 
                matrices: { ...handle.matrices, 
                    vMatrix: handle.camera.matrix, 
                    vpMatrix 
                }
            } as GPUHandle);
        }

        CreateTransforms(modelMatrix, [0, 0, 0], rotation);
        mat4.multiply(mvpMatrix, vpMatrix, modelMatrix)
        handle.device.queue.writeBuffer(handle.uniformBuffer, 0, mvpMatrix as ArrayBuffer);
        setHandle({...handle, matrices: { ...handle.matrices, mvpMatrix }} as GPUHandle)

        const commandEncoder = handle.device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                loadOp: 'clear',
                clearValue: { r: 0.19607843137, g: 0.14901960784, b: 0.34901960784, a: 1.0 }, //background color
                storeOp: 'store'
            }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1.0,
                depthStoreOp: "store",
                depthLoadOp: "clear",
                stencilClearValue: 0,
            }
        });

        renderPass.setVertexBuffer(0, handle.vertexBuffer);
        renderPass.setVertexBuffer(1, handle.colorBuffer);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.setPipeline(pipeline);
        renderPass.draw(handle.numberOfVertices);
        renderPass.end();

        handle.device.queue.writeBuffer(handle.colorBuffer, 0, Float32Array.of(...colors.flat()));
        handle.device.queue.submit([commandEncoder.finish()]);
    }, renderInterval);
}