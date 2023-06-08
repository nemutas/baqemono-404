import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { gl } from '../core/WebGL'
import { DistortionPass } from './DistortionPass'

class Effects {
  private composer!: EffectComposer

  constructor() {
    this.init()
  }

  private init() {
    this.composer = new EffectComposer(gl.renderer)
    this.composer.addPass(new RenderPass(gl.scene, gl.camera))
    this.composer.addPass(new AfterimagePass(0.7))
    this.composer.addPass(new DistortionPass())
  }

  resize() {
    const { width, height } = gl.size
    this.composer.setSize(width, height)
  }

  render() {
    this.composer.render()
  }

  dispose() {
    this.composer.passes.forEach((pass) => pass.dispose())
    this.composer.dispose()
  }
}

export const effects = new Effects()
