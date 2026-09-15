// Advanced Organic Emotional Core Shaders (Smooth Fluid Metamorphosis)

export const aggressionVertexShader = `
  uniform float uTime;
  uniform float uTension;
  uniform float uScrollProgress;
  uniform vec2 uMouse;

  varying vec3 vPosition;
  varying float vDisplacement;
  varying vec2 vUv;

  // 3D Simplex Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;

    // Silky, harmonic low-frequency displacement - eliminating ripples & polygonal artifacts
    float timeSlow = uTime * 0.35;
    
    // Smooth broad fluid motion
    vec3 sampleCoord = position * 0.75 + vec3(timeSlow * 0.3, timeSlow * 0.25, timeSlow * 0.15);
    float baseNoise = snoise(sampleCoord);
    
    // Harmonic secondary undertone (subtle and broad)
    float harmonicNoise = snoise(position * 1.25 - vec3(timeSlow * 0.2)) * 0.35;

    // Gentle mouse repulsion
    float distMouse = length(position.xy - vec3(uMouse * 2.2, 0.0).xy);
    float mouseWave = sin(max(0.0, 2.2 - distMouse) * 3.1415) * 0.12;

    // Smooth total displacement without high-frequency ripples
    float disp = (baseNoise + harmonicNoise) * 0.22 * uTension + mouseWave;
    vDisplacement = disp;

    vec3 newPos = position + normal * disp;
    vPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
  }
`;

export const aggressionFragmentShader = `
  uniform float uTime;
  uniform float uTension;
  uniform float uScrollProgress;

  varying vec3 vPosition;
  varying float vDisplacement;
  varying vec2 vUv;

  void main() {
    // True analytical surface normals from screen-space derivatives - eliminates all shading seams and facet ridges!
    vec3 fdx = dFdx(vPosition);
    vec3 fdy = dFdy(vPosition);
    vec3 normal = normalize(cross(fdx, fdy));

    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Multi-layer Fresnel on analytically smooth geometry
    float NdotV = max(dot(viewDir, normal), 0.0);
    float fresnel1 = pow(1.0 - NdotV, 3.2);
    float fresnel2 = pow(1.0 - NdotV, 1.6);

    // Color Palette:
    // 1. High Tension: Deep Smoky Obsidian Core with Liquid Molten Amber/Crimson Rim
    vec3 colTenseCore = vec3(0.04, 0.02, 0.015);
    vec3 colTenseMid  = vec3(0.68, 0.22, 0.09);
    vec3 colTenseRim  = vec3(0.96, 0.52, 0.20);

    // 2. Harmony: Smooth Smoked Pearl with Champagne Gold Rim
    vec3 colCalmCore  = vec3(0.07, 0.07, 0.065);
    vec3 colCalmMid   = vec3(0.70, 0.55, 0.38);
    vec3 colCalmRim   = vec3(0.95, 0.88, 0.78);

    vec3 currentCore = mix(colCalmCore, colTenseCore, uTension);
    vec3 currentMid  = mix(colCalmMid, colTenseMid, uTension);
    vec3 currentRim  = mix(colCalmRim, colTenseRim, uTension);

    // Smooth color blend across the organic curvature
    vec3 color = mix(currentCore, currentMid, clamp(vDisplacement * 1.5 + 0.35, 0.0, 1.0));
    color = mix(color, currentRim, fresnel1);

    // Subtle breathing pulse
    float pulse = sin(uTime * 2.0) * 0.05 + 0.95;
    color *= pulse;

    // Clean alpha falloff: core is deep & non-distracting, contours glow delicately
    float alpha = clamp(0.15 + fresnel2 * 0.75 + (uTension * 0.15), 0.06, 0.88);

    gl_FragColor = vec4(color, alpha);
  }
`;
