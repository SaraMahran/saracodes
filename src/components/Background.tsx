/** Subtle fixed dot grid on bg that fades out toward the edges (see .dot-grid in globals.css). */
export function Background() {
  return <div aria-hidden="true" className="dot-grid pointer-events-none fixed inset-0 -z-20" />;
}
