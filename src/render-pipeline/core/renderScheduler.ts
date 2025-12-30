export class RenderScheduler {
  private pending = false;
  private reasons = new Set<string>();

  constructor(private onFrame: (reasons: string[]) => void) {}

  requestRender(reason = "unknown") {
    this.reasons.add(reason);
    if (this.pending) return;
    
    this.pending = true;
    requestAnimationFrame(() => {
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
}
