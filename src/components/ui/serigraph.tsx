"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  bgColor: "#285b9f",
  colorA: "#020408",
  colorB: "#1aacf4",
  colorC: "#6699ff",
  colorD: "#fdf7f2",
  scale: 0.8,
  speed: 0.33,
  flow: 0.09,
  warp: 0.55,
  warpScale: 0.5,
  roughness: 0.55,
  lacunarity: 1.9,
  lay: 0.85,
  layAngle: 2.45,
  contrast: 1,
  midpoint: 0.46,
  inks: 3,
  soft: 0.34,
  dissolve: 0.55,
  meshScale: 1.8,
  meshCreep: 0.05,
  spot: 0.08,
  tooth: 0.016,
  toothScale: 22,
  sink: 0.26,
  glow: 0.26,
  lift: 0.02,
  gamma: 0.98,
  grain: 0.052,
  grainAnim: 0,
  dither: 1.3,
  vignette: 0.08,
  cursor: 1,
  register: 0.26,
  open: 0.4,
  parallax: 0.003,
  maxDpr: 1,
};

function hexToVec3(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;          

uniform vec3  uBg, uColorA, uColorB, uColorC, uColorD;
uniform float uScale, uSpeed, uFlow, uWarp, uWarpScale, uRoughness;
uniform float uLacunarity, uLay, uLayAngle, uContrast, uMidpoint, uInks;
uniform float uSoft, uDissolve, uMeshScale, uMeshCreep, uSpot, uTooth;
uniform float uToothScale, uSink, uGlow, uLift, uGamma, uGrain;
uniform float uDither, uVignette, uRegister, uOpen, uParallax;

#define OCTAVES 4

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += amp * snoise(p);
    p *= uLacunarity;
    amp *= uRoughness;
  }
  return v;
}

vec3 ramp4(float t) {
  vec3 c = mix(uColorA, uColorB, smoothstep(0.00, 0.36, t));
  c = mix(c, uColorC, smoothstep(0.32, 0.70, t));
  c = mix(c, uColorD, smoothstep(0.66, 1.00, t));
  return c;
}

float triDither(vec2 fc) {
  float a = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float b = fract(sin(dot(fc + 17.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (a + b - 1.0) / 255.0;
}

vec2 rot(vec2 p, float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c) * p; }

const vec3 K = vec3(0.5773503);
vec3 hueRot(vec3 c, float a) {
  float cs = cos(a), sn = sin(a);
  return c * cs + cross(K, c) * sn + K * dot(K, c) * (1.0 - cs);
}

uniform float uGrainAnim;
float houseGrain(vec2 fc) {
  uvec2 q = uvec2(fc) * uvec2(1597334677u, 3812015801u)
          + uint(floor(iTime * 24.0 * uGrainAnim)) * 2654435769u;
  uint n = q.x ^ q.y; n = n * 1664525u + 1013904223u; n ^= n >> 16u; n *= 2246822519u; n ^= n >> 13u;
  float a = float(n & 0xffffu) / 65535.0;
  n *= 3266489917u; n ^= n >> 16u;
  float b = float(n & 0xffffu) / 65535.0;
  return a + b - 1.0;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
  float t = iTime * uSpeed;

  vec2 p = (uv - iMouse * uParallax) * uScale + vec2(iMouse.x * uRegister, 0.0);

  vec2 q = vec2(fbm(p * uWarpScale + vec2(0.0, t * uFlow)),
                fbm(p * uWarpScale + vec2(5.2, 1.3) - t * uFlow * 0.7));
  vec2 g = p + uWarp * q;

  float f = 0.5 + dot(g, vec2(cos(uLayAngle), sin(uLayAngle))) * uLay * 0.5
          + fbm(g + vec2(t * 0.10, -t * 0.08)) * 0.35;
  f = clamp((f - uMidpoint) * uContrast + 0.5, 0.0, 1.0);
  f += uTooth * snoise(g * uToothScale) * 0.5;

  float n = max(2.0, floor(uInks));
  float x = clamp(f, 0.0, 0.9999) * n;
  float i = floor(x);
  float fr = fract(x);

  float mesh = fbm(g * uMeshScale + vec2(-t * uMeshCreep, t * uMeshCreep * 0.6)) * 0.5 + 0.5;
  float thr = mix(0.5, mesh, uDissolve);
  float w = max(0.01, uSoft * (1.0 + iMouse.y * uOpen));
  float on = smoothstep(thr - w, thr + w, fr);

  vec3 c0 = hueRot(ramp4(clamp((i + 0.5) / n, 0.0, 1.0)), (i / n - 0.5) * uSpot);
  vec3 c1 = hueRot(ramp4(clamp((i + 1.5) / n, 0.0, 1.0)), ((i + 1.0) / n - 0.5) * uSpot);
  vec3 col = mix(c0, c1, on);

  float lvl = (i + on) / n;
  col += uColorD * uGlow * pow(lvl, 4.0);
  col = mix(uBg, col, smoothstep(0.0, max(0.01, uSink), lvl) * 0.90 + 0.10);

  col = clamp(col + uLift, 0.0, 1.0);
  col = pow(col, vec3(max(0.2, uGamma)));
  col *= 1.0 - uVignette * dot(uv, uv);
  { float hgL = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
    col += houseGrain(gl_FragCoord.xy) * uGrain * mix(1.0, 4.0 * hgL * (1.0 - hgL), 0.6); }
  col += triDither(gl_FragCoord.xy) * uDither;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export function Serigraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) {
      console.warn('WebGL2 is not available in this browser.');
      return;
    }

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type);
      if (!sh) throw new Error("could not create shader");
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(sh) || "shader compile error");
      return sh;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "program link error");
    gl.useProgram(program);
    
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const LOC: Record<string, WebGLUniformLocation> = {};
    const loc = (n: string) => (n in LOC ? LOC[n] : (LOC[n] = gl.getUniformLocation(program, n) as WebGLUniformLocation));
    const u1f = (n: string, v: number) => gl.uniform1f(loc(n), v);
    const u2f = (n: string, x: number, y: number) => gl.uniform2f(loc(n), x, y);
    const u3c = (n: string, hex: string) => { const c = hexToVec3(hex); gl.uniform3f(loc(n), c[0], c[1], c[2]); };

    function applyConfig() {
      gl!.useProgram(program);
      u3c('uBg', CONFIG.bgColor);
      u3c('uColorA', CONFIG.colorA);
      u3c('uColorB', CONFIG.colorB);
      u3c('uColorC', CONFIG.colorC);
      u3c('uColorD', CONFIG.colorD);
      u1f('uScale', CONFIG.scale);
      u1f('uSpeed', CONFIG.speed);
      u1f('uFlow', CONFIG.flow);
      u1f('uWarp', CONFIG.warp);
      u1f('uWarpScale', CONFIG.warpScale);
      u1f('uRoughness', CONFIG.roughness);
      u1f('uLacunarity', CONFIG.lacunarity);
      u1f('uLay', CONFIG.lay);
      u1f('uLayAngle', CONFIG.layAngle);
      u1f('uContrast', CONFIG.contrast);
      u1f('uMidpoint', CONFIG.midpoint);
      u1f('uInks', CONFIG.inks);
      u1f('uSoft', CONFIG.soft);
      u1f('uDissolve', CONFIG.dissolve);
      u1f('uMeshScale', CONFIG.meshScale);
      u1f('uMeshCreep', CONFIG.meshCreep);
      u1f('uSpot', CONFIG.spot);
      u1f('uTooth', CONFIG.tooth);
      u1f('uToothScale', CONFIG.toothScale);
      u1f('uSink', CONFIG.sink);
      u1f('uGlow', CONFIG.glow);
      u1f('uLift', CONFIG.lift);
      u1f('uGamma', CONFIG.gamma);
      u1f('uGrain', CONFIG.grain);
      u1f('uGrainAnim', CONFIG.grainAnim);
      u1f('uDither', CONFIG.dither);
      u1f('uVignette', CONFIG.vignette);
      u1f('uRegister', CONFIG.register);
      u1f('uOpen', CONFIG.open);
      u1f('uParallax', CONFIG.parallax);
      resize();
    }

    let dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; }
      gl!.viewport(0, 0, w, h);
      gl!.useProgram(program);
      u2f('iResolution', w, h);
    }
    
    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => { resizeQueued = false; resize(); });
    };
    window.addEventListener('resize', onResize, { passive: true });

    const mouse = { x: 0, y: 0, ax: 0, ay: 0, tx: 0, ty: 0, rest: undefined as any };
    const aim = (e: PointerEvent) => {
      const a = window.innerWidth / window.innerHeight;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * a;
      mouse.ty = (0.5 - e.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', aim, { passive: true });
    window.addEventListener('pointerdown', aim, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 });
    observer.observe(canvas);

    let prevT = performance.now();
    let clock = 0;
    let reqId = 0;
    
    function frame(now: number) {
      reqId = requestAnimationFrame(frame);
      const raw = now - prevT;
      prevT = now;
      if (!visible || document.hidden) return;
      const ms = raw > 50 ? 50 : raw < 4.167 ? 4.167 : raw;
      const s = ms > 36.7 ? 2.2 : ms * 0.06;
      clock += ms * 0.001;

      const kLead = 0.105 * s, kBody = 0.043 * s;
      mouse.ax += (mouse.tx - mouse.ax) * kLead;
      mouse.ay += (mouse.ty - mouse.ay) * kLead;
      mouse.x  += (mouse.ax - mouse.x)  * kBody;
      mouse.y  += (mouse.ay - mouse.y)  * kBody;

      u1f('iTime', clock);
      if (mouse.rest === undefined) mouse.rest = { x: mouse.tx, y: mouse.ty };
      if (!CONFIG.cursor) { mouse.tx = mouse.rest.x; mouse.ty = mouse.rest.y; }

      u2f('iMouse', mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    applyConfig();
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    reqId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', aim);
      window.removeEventListener('pointerdown', aim);
      observer.disconnect();
      cancelAnimationFrame(reqId);
      gl!.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full object-cover" />;
}
