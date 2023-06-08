import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

export class FXAAPass extends ShaderPass {
  constructor(width: number, height: number) {
    super(FXAAShader)
    this.setUniforms(width, height)
  }

  private setUniforms(width: number, height: number) {
    this.uniforms.resolution.value.set(1 / width, 1 / height)
  }

  resize(width: number, height: number) {
    this.setUniforms(width, height)
  }
}
