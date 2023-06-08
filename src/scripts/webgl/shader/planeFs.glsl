uniform sampler2D tImage;
uniform float uAspect;
uniform float uScale;
uniform vec2 uMirror;
uniform float uProgress;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 aspect = vec2(uAspect, 1.0);
  vec2 uv = (vUv - 0.5) * aspect * uScale * -1.0 * uMirror + 0.5;
  vec2 up = vec2(0.0, 1.0 - uProgress) * 0.1;
  vec2 mouseMove = uMouse * uMirror * uScale * 0.2;
  vec4 tex = texture2D(tImage, uv + up + mouseMove);

  gl_FragColor = tex;
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
}