varying vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  pos.yz = normalize(pos.yz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}