uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  float dist = distance(vUv, vec2(0.5));
  vec2 dir = vUv - vec2(0.5);
  float distortionY = pow(dist, 5.0);
  float distortionX = pow(dist, 2.0);
  vec2 distortion = normalize(dir) * (distortionX * 0.8 + distortionY) * 0.5;

  vec2 shift = distortion * dir;
  vec2 shiftR = shift * 0.00 - vec2(0.000, 0.0);
  vec2 shiftG = shift * 0.02 - vec2(0.002, 0.0);
  vec2 shiftB = shift * 0.04 - vec2(0.004, 0.0);

  float r = texture2D(tDiffuse, vUv - distortion - shiftR).r;
  float g = texture2D(tDiffuse, vUv - distortion - shiftG).g;
  float b = texture2D(tDiffuse, vUv - distortion - shiftB).b;
  vec3 color = vec3(r, g, b);

  float dark = smoothstep(0.3, 0.8, dist) * (1.0 - 0.2) + 0.2;
  color = mix(color, vec3(0.0), dark);

  gl_FragColor = vec4(color, 1.0);
}