/**
 * Standard telemetry event emitted by Enterprise observers.
 */
export interface TelemetryEvent {
  readonly timestamp: number;
  readonly type: 'algorithm' | 'structure';
  readonly name: string;
  readonly operation: string;
  readonly durationMs: number;
  readonly success: boolean;
  readonly error?: string;
  readonly metadata?: Record<string, unknown>;
}

export type TelemetryListener = (event: TelemetryEvent) => void;

/**
 * Enterprise Telemetry Dispatcher (OpenTelemetry / Datadog / Prometheus hook integration).
 */
export class TelemetryBus {
  private static listeners: Set<TelemetryListener> = new Set();
  private static isMuted = false;

  static subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  static emit(event: TelemetryEvent): void {
    if (this.isMuted) return;
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // Never allow observer exceptions to disrupt critical business logic
      }
    }
  }

  static mute(): void {
    this.isMuted = true;
  }

  static unmute(): void {
    this.isMuted = false;
  }

  static clear(): void {
    this.listeners.clear();
  }
}

