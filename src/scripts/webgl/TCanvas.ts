import gsap from 'gsap'
import * as THREE from 'three'
import { resolvePath } from '../utils'
import { gl } from './core/WebGL'
import { effects } from './effects/Effects'
import fragmentShader from './shader/planeFs.glsl'
import vertexShader from './shader/planeVs.glsl'
import { mouse2d } from './utils/Mouse2D'

type TextureKey = '404' | 'file' | 'not' | 'found' | 'hahaha' | 'face'

export class TCanvas {
  private planes = new THREE.Group()
  private textures: { [key in string]: { texture: THREE.Texture; scale: number; aspect: number } } = {}
  private planeParams = {
    size: { width: 1.4, height: 0.8 },
    amount: { x: 3, y: 10 },
  }
  private faceVideo!: HTMLVideoElement
  private mouseTarget = new THREE.Vector2()

  constructor(private container: HTMLElement) {
    this.faceVideo = this.container.querySelector('video')!

    this.load().then(() => {
      this.init()
      this.createObjects()
      this.gsapAnimation()
      gl.requestAnimationFrame(this.anime)
    })
  }

  private async load() {
    const imageFileNames = ['404', 'FILE', 'NOT', 'FOUND', 'HAHAHA']

    const loader = new THREE.TextureLoader()

    await Promise.all(
      imageFileNames.map(async (name) => {
        const path = resolvePath(`images/${name}.png`)
        const texture = await loader.loadAsync(path)
        this.textures[name.toLowerCase()] = {
          texture,
          scale: 1.0,
          aspect: 1.2,
        }
        if (name === 'HAHAHA') {
          texture.wrapS = THREE.MirroredRepeatWrapping
        }
      }),
    )

    const videoTexture = await new THREE.VideoTexture(this.faceVideo)
    this.textures['face'] = {
      texture: videoTexture,
      scale: 2,
      aspect: (1.8 / 1) * 1.2,
    }
  }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.z = 0.8

    gl.setResizeCallback(() => {
      effects.resize()
    })
  }

  private getTextureData(name: TextureKey) {
    return this.textures[name]
  }

  private createObjects() {
    const data = this.getTextureData('found')

    const planesWorldGroup = new THREE.Group()
    planesWorldGroup.rotateZ(Math.PI / 24)
    planesWorldGroup.add(this.planes)
    gl.scene.add(planesWorldGroup)

    const { size, amount } = this.planeParams

    const geometry = new THREE.PlaneGeometry(size.width, size.height, ~~((size.width / size.height) * 20), 20)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tImage: { value: data.texture },
        uAspect: { value: data.aspect },
        uScale: { value: data.scale },
        uMirror: { value: new THREE.Vector2(1, 1) },
        uProgress: { value: 1 },
        uMouse: { value: new THREE.Vector2() },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      // wireframe: true,
    })

    const offsetX = (size.width * (amount.x - 1)) / 2

    for (let x = 0; x < amount.x; x++) {
      for (let y = 0; y < amount.y; y++) {
        const geo = geometry.clone()
        geo.applyMatrix4(new THREE.Matrix4().makeTranslation(x * size.width - offsetX, 0, -1.235))
        geo.applyMatrix4(new THREE.Matrix4().makeRotationX((y / amount.y) * Math.PI * 2))

        const mat = material.clone()
        mat.uniforms.uMirror.value.set(((x % 2) * 2 - 1) * -1, (y % 2) * 2 - 1)

        const mesh = new THREE.Mesh(geo, mat)
        this.planes.add(mesh)
      }
    }
  }

  // ----------------------------------
  // animation

  private gsapAnimation() {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: this.faceVideo.duration + 0.8 })

    for (const key of ['404', 'file', 'not', 'found', 'hahaha', 'face']) {
      const data = this.getTextureData(key as TextureKey)

      tl.call(() => {
        this.planes.children.forEach((child) => {
          const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
          mesh.material.uniforms.tImage.value = data.texture
          mesh.material.uniforms.uAspect.value = data.aspect
          mesh.material.uniforms.uScale.value = data.scale
        })
      })

      this.planes.children.forEach((child, i) => {
        const timing = 0 < i ? '<' : '<100%'

        const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
        if (key !== 'face') {
          tl.fromTo(mesh.material.uniforms.uProgress, { value: 0 }, { value: 1, duration: 0.5, ease: 'power1.out' }, timing)
        } else {
          tl.call(
            () => {
              this.faceVideo.play()
            },
            undefined,
            timing,
          )
        }
      })
    }
  }

  private anime = () => {
    this.mouseTarget.set(mouse2d.position[0], mouse2d.position[1])
    this.planes.children.forEach((child) => {
      const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
      mesh.material.uniforms.uMouse.value.lerp(this.mouseTarget, 0.3)
    })

    this.planes.rotation.x = THREE.MathUtils.lerp(this.planes.rotation.x, this.mouseTarget.y * 0.3, 0.1)

    // gl.render()
    effects.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
    effects.dispose()
  }
}
