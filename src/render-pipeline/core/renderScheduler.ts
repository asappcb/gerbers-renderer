export class RenderScheduler {
  private pending = false;
  private reasons = new Set<string>();
  private rafId: number | null = null;

  constructor(private onFrame: (reasons: string[]) => void) {}

  requestRender(reason = "unknown") {
    this.reasons.add(reason);
    if (this.pending) return;

    this.pending = true;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.pending = false;
      const reasons = Array.from(this.reasons);
      this.reasons.clear();
      this.onFrame(reasons);
    });
  }

  isPending(): boolean {
    return this.pending;
  }

  getPendingReasons(): string[] {
    return Array.from(this.reasons);
  }

  /** Cancel any pending frame. Call on teardown to avoid rendering a disposed viewer. */
  cancel() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pending = false;
    this.reasons.clear();
  }
}
