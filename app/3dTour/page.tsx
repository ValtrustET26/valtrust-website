"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function House({ onReady }: { onReady: (height: number) => void }) {
    const { scene } = useGLTF("/3DTours/plan.glb");
    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        // no centering
        scene.traverse((child: any) => {
            if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
        });
        const scaledBox = new THREE.Box3().setFromObject(scene); const scaledSize = scaledBox.getSize(new THREE.Vector3()); const scaledCenter = scaledBox.getCenter(new THREE.Vector3()); console.log("SCALED size:", scaledSize, "center:", scaledCenter); onReady(scaledSize.y);
    }, [scene]);
    return <primitive object={scene} />;
}

function Controls({ personHeight, active }: { personHeight: number; active: boolean }) {
    const { camera } = useThree();
    const keys = useRef<Record<string, boolean>>({});
    const mouse = useRef({ x: 0, y: -0.12 }); // un poco hacia arriba por defecto
    const speed = 3.0;

    useEffect(() => {
        if (!active) return;
        camera.position.set(2166, 55, -450);
        mouse.current = { x: 0, y: 0 };

        const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
        const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
        const move = (e: MouseEvent) => {
            mouse.current.x += e.movementX * 0.002;
            mouse.current.y += e.movementY * 0.002;
            mouse.current.y = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, mouse.current.y));
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        window.addEventListener("mousemove", move);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            window.removeEventListener("mousemove", move);
        };
    }, [active, camera, personHeight]);

    useFrame(() => {
        if (!active) return;
        const euler = new THREE.Euler(-mouse.current.y, -mouse.current.x, 0, "YXZ");
        camera.quaternion.setFromEuler(euler);

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0; dir.normalize();
        const right = new THREE.Vector3();
        right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

        if (keys.current["KeyW"] || keys.current["ArrowUp"]) camera.position.addScaledVector(dir, speed);
        if (keys.current["KeyS"] || keys.current["ArrowDown"]) camera.position.addScaledVector(dir, -speed);
        if (keys.current["KeyA"] || keys.current["ArrowLeft"]) camera.position.addScaledVector(right, -speed);
        if (keys.current["KeyD"] || keys.current["ArrowRight"]) camera.position.addScaledVector(right, speed);
        camera.position.y = personHeight;
    });

    return null;
}

export default function HouseTour() {
    const [active, setActive] = useState(false);
    const [locked, setLocked] = useState(false);
    const [personHeight, setPersonHeight] = useState(0);
    const [hint, setHint] = useState(false);
    const canLockRef = useRef(true);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Pointer lock para el mouse
    const requestLock = useCallback(() => {
        if (!canLockRef.current) return;
        document.querySelector("canvas")?.requestPointerLock();
    }, []);

    useEffect(() => {
        const onChange = () => {
            const isLocked = !!document.pointerLockElement;
            setLocked(isLocked);
            if (!isLocked) {
                // Bloquear re-lock por 1.2s tras salir con ESC
                canLockRef.current = false;
                setTimeout(() => { canLockRef.current = true; }, 1200);
            }
        };
        document.addEventListener("pointerlockchange", onChange);
        return () => document.removeEventListener("pointerlockchange", onChange);
    }, []);

    // Hint de controles desaparece a los 5s
    useEffect(() => {
        if (active) {
            setHint(true);
            const t = setTimeout(() => setHint(false), 5000);
            return () => clearTimeout(t);
        }
    }, [active]);

    const handleEnter = () => {
        setActive(true);
        setTimeout(() => requestLock(), 100);
    };

    // Salir del tour y volver a la pantalla inicial (libera el pointer lock si está activo)
    const handleExitTour = () => {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        setActive(false);
        setLocked(false);
    };

    return (
        <div ref={canvasRef} className="relative w-full h-screen overflow-hidden" style={{ background: "#050d1a" }}>

            {/* ── OVERLAY DE ENTRADA ── */}
            {!active && (
                <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                    style={{ background: "linear-gradient(160deg, #0B1E4A 0%, #050d1a 100%)" }}
                >
                    {/* Decoración de fondo */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #0D4687, transparent)" }} />
                    </div>

                    <div className="relative flex flex-col items-center text-center px-5 sm:px-6 max-w-xs sm:max-w-sm w-full">
                        {/* Badge */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6 sm:mb-8 text-[10px] sm:text-xs text-white/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            3D Virtual Tour
                        </div>

                        {/* Icono */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-5 sm:mb-6 border border-white/15"
                            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))" }}>
                            🏠
                        </div>

                        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Explore the Property</h2>
                        <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                            Walk through every room in full 3D.<br />Use your mouse and keyboard to navigate.
                        </p>

                        {/* Controles preview */}
                        <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
                            <div className="flex gap-1.5">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-white/70 border border-white/20"
                                    style={{ background: "rgba(255,255,255,0.08)" }}>W</div>
                            </div>
                            <div className="flex gap-1.5">
                                {["A", "S", "D"].map(k => (
                                    <div key={k} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-white/70 border border-white/20"
                                        style={{ background: "rgba(255,255,255,0.08)" }}>{k}</div>
                                ))}
                            </div>
                            <p className="text-white/30 text-[10px] sm:text-[11px] mt-1">WASD to move · Mouse to look around</p>
                        </div>

                        {/* Botón */}
                        <button
                            onClick={handleEnter}
                            className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-sm text-[#0B1E4A] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: "linear-gradient(135deg, #ffffff, #e2e8f0)" }}
                        >
                            Start Tour →
                        </button>
                    </div>
                </div>
            )}

            {/* ── HUD DENTRO DEL TOUR ── */}
            {active && (
                <>
                    {/* Crosshair */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" opacity="0.6" className="sm:w-5 sm:h-5">
                            <line x1="10" y1="0" x2="10" y2="8" stroke="white" strokeWidth="1.5" />
                            <line x1="10" y1="12" x2="10" y2="20" stroke="white" strokeWidth="1.5" />
                            <line x1="0" y1="10" x2="8" y2="10" stroke="white" strokeWidth="1.5" />
                            <line x1="12" y1="10" x2="20" y2="10" stroke="white" strokeWidth="1.5" />
                            <circle cx="10" cy="10" r="1.5" fill="white" />
                        </svg>
                    </div>

                    {/* Top bar */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom, rgba(5,13,26,0.8), transparent)" }}>
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                            <span className="text-white/70 text-[10px] sm:text-xs font-medium truncate">
                                <span className="sm:hidden">Virtual Tour</span>
                                <span className="hidden sm:inline">Virtual Tour · Valtrust</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs flex-shrink-0">
                            {locked ? (
                                <span className="hidden sm:inline">Mouse captured · <span className="text-white/60">ESC</span> to release</span>
                            ) : (
                                <button
                                    className="pointer-events-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                    onClick={requestLock}
                                >
                                    <span className="sm:hidden">Capture</span>
                                    <span className="hidden sm:inline">Click to capture mouse</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Botón salir tour - siempre visible, incluso con el mouse capturado */}
                    <div className="absolute top-12 sm:top-14 left-3 sm:left-5 z-30 pointer-events-auto">
                        <button
                            onClick={handleExitTour}
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
                        >
                            ← <span className="hidden xs:inline sm:inline">Exit Tour</span><span className="xs:hidden sm:hidden">Exit</span>
                        </button>
                    </div>

                    {/* Hint de controles */}
                    {hint && (
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-[92%] sm:w-auto"
                            style={{ opacity: hint ? 1 : 0, transition: "opacity 0.5s" }}>
                            <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/15 text-white/60 text-[10px] sm:text-xs flex-wrap"
                                style={{ background: "rgba(11,30,74,0.7)", backdropFilter: "blur(8px)" }}>
                                <span>⌨ WASD to move</span>
                                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                                <span>🖱 Mouse to look</span>
                                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                                <span>ESC to release mouse</span>
                            </div>
                        </div>
                    )}

                    {/* Botón salir tour original (cuando no está bloqueado el mouse) */}
                    <div className="absolute bottom-4 sm:bottom-6 right-3 sm:right-5 z-10" style={{ display: locked ? "none" : "block" }}>
                        <button
                            onClick={handleExitTour}
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
                        >
                            ← Exit Tour
                        </button>
                    </div>
                </>
            )}

            <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                camera={{ fov: 120, near: 0.1, far: 10000 }}
                onClick={() => active && requestLock()}
            >
                <ambientLight intensity={2.5} />
                <directionalLight position={[200, 300, 200]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
                <pointLight position={[0, 100, 0]} intensity={1} />
                <pointLight position={[150, 80, 150]} intensity={0.8} />
                <pointLight position={[-150, 80, -150]} intensity={0.8} />

                <House onReady={(h) => setPersonHeight(40)} />
                {active && personHeight > 0 && <Controls personHeight={personHeight} active={active} />}
            </Canvas>
        </div>
    );
}