import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'

export class GammaCorrectionPass extends ShaderPass {
  constructor() {
    super(GammaCorrectionShader)
  }
}
