export class NotificationPriorityQueue {
  constructor(maxSize = 10) {
    this.heap = [];
    this.maxSize = maxSize;
    this.weights = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };
  }

  getScore(notification) {
    return this.weights[notification.Type] || 0;
  }

  // Returns true if a is SMALLER than b (i.e. a has lower priority)
  isLowerPriority(a, b) {
    const sA = this.getScore(a);
    const sB = this.getScore(b);
    if (sA !== sB) {
      return sA < sB;
    }
    const tA = new Date(a.Timestamp).getTime();
    const tB = new Date(b.Timestamp).getTime();
    return tA < tB;
  }

  add(notification) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(notification);
      this.bubbleUp(this.heap.length - 1);
    } else {
      if (this.isLowerPriority(this.heap[0], notification)) {
        this.heap[0] = notification;
        this.bubbleDown(0);
      }
    }
  }

  bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.isLowerPriority(this.heap[idx], this.heap[parent])) {
        // Swap
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[parent];
        this.heap[parent] = temp;
        idx = parent;
      } else {
        break;
      }
    }
  }

  bubbleDown(idx) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.isLowerPriority(this.heap[left], this.heap[smallest])) {
        smallest = left;
      }
      if (right < length && this.isLowerPriority(this.heap[right], this.heap[smallest])) {
        smallest = right;
      }
      if (smallest !== idx) {
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[smallest];
        this.heap[smallest] = temp;
        idx = smallest;
      } else {
        break;
      }
    }
  }

  getTopN() {
    // Return sorted from highest priority to lowest
    const copy = [...this.heap];
    return copy.sort((a, b) => this.isLowerPriority(a, b) ? 1 : -1);
  }
}
