export const Shader = () => {
    const vertex = /* wgsl */`
        struct Uniforms {
            mvpMatrix: mat4x4<f32>,
        };

        @binding(0) @group(0) 
        var<uniform> uniforms : Uniforms;

        @group(0) @binding(1)
        var<storage, read> color: array<vec3<f32>, 6>;

        struct Output {
            @builtin(position) Position: vec4<f32>,
            @location(0) vColor: vec4<f32>,
        };

        @stage(vertex)
        fn main(@builtin(vertex_index) VertexIndex: u32, @location(0) pos: vec4<f32>) -> Output {
            var output: Output;
            output.Position = uniforms.mvpMatrix * pos;
            output.vColor = vec4<f32>(color[VertexIndex / 6u], 1.0);
            return output;
        }
    `;

    const fragment = /* wgsl */`
        @stage(fragment)
        fn main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
            return color;
        }
    `;
    return {vertex, fragment};
}