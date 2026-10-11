export function BackgroundFX() {
  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-background">
        {/* subtle dot grid — restrained, masked toward the top */}
        <div className="dot-grid absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_90%_65%_at_50%_0%,black_25%,transparent_85%)]" />

        {/* translucent colour blocks — quiet washes, slow drift */}
        <div
          className="blob animate-drift-a top-[-16%] left-[-10%] h-[44vw] w-[44vw] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, var(--signal-wash-a), transparent 68%)",
          }}
        />
        <div
          className="blob animate-drift-b top-[22%] right-[-12%] h-[38vw] w-[38vw] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at 55% 45%, var(--signal-wash-b), transparent 68%)",
          }}
        />
        <div
          className="blob animate-drift-c bottom-[-18%] left-[24%] h-[42vw] w-[42vw] blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, var(--signal-wash-c), transparent 68%)",
          }}
        />
      </div>

      {/* film grain — sits above everything, never intercepts input */}
      <div aria-hidden="true" className="grain-overlay" />
    </>
  );
}
