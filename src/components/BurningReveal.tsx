import { useEffect, useRef, useState } from 'react';

export function BurningReveal() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hasCompletedRef = useRef(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isComplete) return;

        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        // --- Configuration ---
        // Using a slightly lower pixel ratio for performance on high-DPI screens if needed, 
        // but sticking to user request of min(devicePixelRatio, 2)
        const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

        let startTime = performance.now();
        let animationProgress = 0.0; // Start at 0 progress

        let uniforms: Record<string, WebGLUniformLocation | null>;
        let textTexture: WebGLTexture | null;
        let gl: WebGLRenderingContext | null = null;
        let animationFrameId = 0;

        // --- Shaders ---
        const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;

      void main() {
        vUv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        const fsSource = `
      precision mediump float;

      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform float u_progress;
      uniform float u_time;
      uniform sampler2D u_text;

      float rand(vec2 n) {
          return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 n) {
          const vec2 d = vec2(0., 1.);
          vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
          return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
      }

      float fbm(vec2 n) {
          float total = 0.0, amplitude = .4;
          for (int i = 0; i < 4; i++) {
              total += noise(n) * amplitude;
              n += n;
              amplitude *= 0.6;
          }
          return total;
      }

      void main() {
          vec2 uv = vUv;
          uv.x *= min(1., u_resolution.x / u_resolution.y);
          uv.y *= min(1., u_resolution.y / u_resolution.x);

          vec2 screenUv = vUv * 0.5 + 0.5;
          screenUv.y = 1.0 - screenUv.y;

          float t = u_progress;

          vec4 textColor = texture2D(u_text, screenUv);
          vec3 color = textColor.rgb;

          float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));

          float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
          color -= vec3(.99, .95, .99) * paper_darkness;

          vec3 fire_color = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, .0);
          float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
          show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));

          float fire_border = .02 * show_fire;
          float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
          fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
          color += fire_color * fire_edge;

          float opacity = 1. - smoothstep(main_noise - .0005, main_noise + .0005, t);

          gl_FragColor = vec4(color, opacity);
      }
    `;

        // --- Helpers ---
        function createLogoTexture(gl: WebGLRenderingContext) {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // 1×1 white pixel placeholder while image loads
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255])
            );

            const image = new Image();
            // Load the SVG from assets
            image.src = "/src/assets/entranceAnimation.svg";

            image.onload = () => {
                const textCanvas = document.createElement("canvas");
                const ctx = textCanvas.getContext("2d");
                if (!ctx) return;

                // High resolution canvas for crisp text
                textCanvas.width = 2048;
                textCanvas.height = 1024;

                // 1. Fill white background
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

                // 2. Calculate aspect ratio to fit logo nicely
                const padding = 100;
                const maxWidth = textCanvas.width - (padding * 2);
                const maxHeight = textCanvas.height - (padding * 2);

                const imgRatio = image.width / image.height;
                let drawWidth = maxWidth;
                let drawHeight = maxWidth / imgRatio;

                if (drawHeight > maxHeight) {
                    drawHeight = maxHeight;
                    drawWidth = maxHeight * imgRatio;
                }

                // 3. Draw Image Centered
                const x = (textCanvas.width - drawWidth) / 2;
                const y = (textCanvas.height - drawHeight) / 2;

                ctx.drawImage(image, x, y, drawWidth, drawHeight);

                // 4. Update texture
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(
                    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas
                );
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            };

            return texture;
        }

        function createShader(gl: WebGLRenderingContext, sourceCode: string, type: number) {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, sourceCode);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    "An error occurred compiling the shaders: " +
                    gl.getShaderInfoLog(shader)
                );
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        function createShaderProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
            const program = gl.createProgram();
            if (!program) return null;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(
                    "Unable to initialize the shader program: " +
                    gl.getProgramInfoLog(program)
                );
                return null;
            }
            return program;
        }

        function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
            const uniforms: Record<string, WebGLUniformLocation | null> = {};
            const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                const info = gl.getActiveUniform(program, i);
                if (info) {
                    uniforms[info.name] = gl.getUniformLocation(program, info.name);
                }
            }
            return uniforms;
        }

        // --- Init ---
        function init() {
            if (!canvasEl) return;
            gl = canvasEl.getContext("webgl") || (canvasEl.getContext("experimental-webgl") as WebGLRenderingContext);

            if (!gl) {
                console.error("WebGL is not supported by your browser.");
                if (!hasCompletedRef.current) {
                    hasCompletedRef.current = true;
                    setIsComplete(true);
                }
                return;
            }

            const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
            const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

            if (!vertexShader || !fragmentShader) return;

            const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
            if (!shaderProgram) return;

            uniforms = getUniforms(gl, shaderProgram);

            const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.useProgram(shaderProgram);

            const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            textTexture = createLogoTexture(gl);

            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();
            render();
        }

        function resizeCanvas() {
            if (!canvasEl || !gl || !uniforms) return;
            canvasEl.width = window.innerWidth * devicePixelRatio;
            canvasEl.height = window.innerHeight * devicePixelRatio;
            gl.viewport(0, 0, canvasEl.width, canvasEl.height);
            gl.uniform2f(uniforms.u_resolution, canvasEl.width, canvasEl.height);
        }

        function easeInOut(t: number) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function render() {
            const currentTime = performance.now();
            // Original code used 8000ms duration.
            // We start slightly slow to let user see "LOGO" then burn.
            const elapsed = (currentTime - startTime) / 8000;

            // Adjust animation progress logic based on original request
            // Original: if (elapsed <= 1) animationProgress = 0.3 + 0.7 * easeInOut(elapsed);
            // This means it starts at 0.3 (already partially burnt?) or just specific noise threshold.
            // Let's stick to EXACT original logic:

            if (elapsed <= 1) {
                animationProgress = 0.3 + 0.8 * easeInOut(elapsed);

                if (gl && uniforms) {
                    gl.uniform1f(uniforms.u_time, currentTime);
                    gl.uniform1f(uniforms.u_progress, animationProgress);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, textTexture);
                    gl.uniform1i(uniforms.u_text, 0);

                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                }
                animationFrameId = requestAnimationFrame(render);
            } else {
                if (!hasCompletedRef.current) {
                    hasCompletedRef.current = true;
                    setIsComplete(true);
                }
            }
        }

        init();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isComplete]);

    if (isComplete) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            id="fire-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999, // High z-index to sit on top of everything
                display: 'block'
            }}
        />
    );
}
