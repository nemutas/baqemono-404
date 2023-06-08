import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/DistortionFs.glsl'

export class DistortionPass extends ShaderPass {
  constructor() {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
  }
}
