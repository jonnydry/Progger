import { logger } from './utils/logger';

type SimpleChord = {
  chordName: string;
  musicalFunction: string;
  relationToKey: string;
};

type SimpleScale = {
  name: string;
  rootNote: string;
};

type ProgressionResultFromAPI = {
  progression: SimpleChord[];
  scales: SimpleScale[];
};

type PendingRequest = {
  promise: Promise<ProgressionResultFromAPI>;
  created: number;
};

class PendingRequestManager {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly maxPendingTime = 60000; // 60 seconds
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    // Clean up old entries every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30000);
  }

  get(key: string): Promise<ProgressionResultFromAPI> | null {
    const pending = this.pendingRequests.get(key);
    if (!pending) return null;

    // Check if the request is too old
    if (Date.now() - pending.created > this.maxPendingTime) {
      this.pendingRequests.delete(key);
      return null;
    }

    return pending.promise;
  }

  set(key: string, promise: Promise<ProgressionResultFromAPI>): void {
    this.pendingRequests.set(key, {
      promise,
      created: Date.now()
    });

    // Clean up when the promise resolves or rejects
    promise.finally(() => {
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, 1000); // Keep it for 1 second to catch timing issues
    });

    // Trigger cleanup if we have many entries
    if (this.pendingRequests.size > 100) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, pending] of this.pendingRequests.entries()) {
      if (now - pending.created > this.maxPendingTime) {
        this.pendingRequests.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      logger.debug("Cleaned up expired pending requests", { cleaned, remaining: this.pendingRequests.size });
    }
  }

  getSize(): number {
    return this.pendingRequests.size;
  }

  // Cleanup on shutdown
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.pendingRequests.clear();
  }
}

// Export singleton instance
export const pendingRequests = new PendingRequestManager();
export { PendingRequestManager };
