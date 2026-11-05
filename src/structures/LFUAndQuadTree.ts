/**
 * Least Frequently Used (LFU) Cache
 * Evicts the entry with the lowest access frequency in O(1) time.
 * On frequency ties, Least Recently Used (LRU) order breaks the tie.
 */
class LFUEntry<K, V> {
  key: K;
  value: V;
  freq = 1;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LFUCache<K, V> {
  private readonly capacity: number;
  private readonly keyMap = new Map<K, LFUEntry<K, V>>();
  private readonly freqMap = new Map<number, Set<K>>();
  private minFreq = 1;

  constructor(capacity: number) {
    if (capacity <= 0) throw new RangeError('Capacity must be positive');
    this.capacity = capacity;
  }

  get size(): number {
    return this.keyMap.size;
  }

  get(key: K): V | undefined {
    const entry = this.keyMap.get(key);
    if (!entry) return undefined;
    this.incrementFreq(entry);
    return entry.value;
  }

  put(key: K, value: V): void {
    if (this.capacity <= 0) return;

    if (this.keyMap.has(key)) {
      const entry = this.keyMap.get(key)!;
      entry.value = value;
      this.incrementFreq(entry);
      return;
    }

    if (this.keyMap.size >= this.capacity) {
      // Evict least frequently used item (and oldest in that freq bucket)
      const minSet = this.freqMap.get(this.minFreq)!;
      const evictKey = minSet.keys().next().value;
      if (evictKey !== undefined) {
        minSet.delete(evictKey);
        this.keyMap.delete(evictKey);
      }
    }

    const newEntry = new LFUEntry(key, value);
    this.keyMap.set(key, newEntry);
    this.minFreq = 1;

    let fSet = this.freqMap.get(1);
    if (!fSet) {
      fSet = new Set<K>();
      this.freqMap.set(1, fSet);
    }
    fSet.add(key);
  }

  has(key: K): boolean {
    return this.keyMap.has(key);
  }

  clear(): void {
    this.keyMap.clear();
    this.freqMap.clear();
    this.minFreq = 1;
  }

  private incrementFreq(entry: LFUEntry<K, V>): void {
    const oldFreq = entry.freq;
    const oldSet = this.freqMap.get(oldFreq)!;
    oldSet.delete(entry.key);

    if (oldSet.size === 0 && this.minFreq === oldFreq) {
      this.minFreq++;
    }

    entry.freq++;
    let newSet = this.freqMap.get(entry.freq);
    if (!newSet) {
      newSet = new Set<K>();
      this.freqMap.set(entry.freq, newSet);
    }
    newSet.add(entry.key);
  }
}

/**
 * Spatial QuadTree (Point QuadTree)
 * 2D spatial indexing partitioning space into 4 quadrants (NW, NE, SW, SE).
 * Essential for 2D collision detection, geographic clustering, and map viewport culling.
 */
export interface AABB {
  x: number;      // Center x
  y: number;      // Center y
  halfWidth: number;
  halfHeight: number;
}

export interface QuadPoint {
  x: number;
  y: number;
}

export class QuadTree<T extends QuadPoint> {
  private readonly boundary: AABB;
  private readonly capacity: number;
  private points: T[] = [];
  private divided = false;

  private northWest?: QuadTree<T>;
  private northEast?: QuadTree<T>;
  private southWest?: QuadTree<T>;
  private southEast?: QuadTree<T>;

  constructor(boundary: AABB, capacity = 4) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  insert(point: T): boolean {
    if (!this.contains(this.boundary, point)) {
      return false;
    }

    if (this.points.length < this.capacity && !this.divided) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northWest!.insert(point) ||
      this.northEast!.insert(point) ||
      this.southWest!.insert(point) ||
      this.southEast!.insert(point)
    );
  }

  queryRange(range: AABB): T[] {
    const found: T[] = [];

    if (!this.intersects(this.boundary, range)) {
      return found;
    }

    for (const p of this.points) {
      if (this.contains(range, p)) {
        found.push(p);
      }
    }

    if (this.divided) {
      found.push(...this.northWest!.queryRange(range));
      found.push(...this.northEast!.queryRange(range));
      found.push(...this.southWest!.queryRange(range));
      found.push(...this.southEast!.queryRange(range));
    }

    return found;
  }

  private subdivide(): void {
    const { x, y, halfWidth, halfHeight } = this.boundary;
    const hw = halfWidth / 2;
    const hh = halfHeight / 2;

    this.northWest = new QuadTree({ x: x - hw, y: y + hh, halfWidth: hw, halfHeight: hh }, this.capacity);
    this.northEast = new QuadTree({ x: x + hw, y: y + hh, halfWidth: hw, halfHeight: hh }, this.capacity);
    this.southWest = new QuadTree({ x: x - hw, y: y - hh, halfWidth: hw, halfHeight: hh }, this.capacity);
    this.southEast = new QuadTree({ x: x + hw, y: y - hh, halfWidth: hw, halfHeight: hh }, this.capacity);

    this.divided = true;

    // Distribute existing points to children
    for (const p of this.points) {
      this.northWest.insert(p) ||
      this.northEast.insert(p) ||
      this.southWest.insert(p) ||
      this.southEast.insert(p);
    }
    this.points = [];
  }

  private contains(box: AABB, point: QuadPoint): boolean {
    return (
      point.x >= box.x - box.halfWidth &&
      point.x <= box.x + box.halfWidth &&
      point.y >= box.y - box.halfHeight &&
      point.y <= box.y + box.halfHeight
    );
  }

  private intersects(b1: AABB, b2: AABB): boolean {
    return !(
      b2.x - b2.halfWidth > b1.x + b1.halfWidth ||
      b2.x + b2.halfWidth < b1.x - b1.halfWidth ||
      b2.y - b2.halfHeight > b1.y + b1.halfHeight ||
      b2.y + b2.halfHeight < b1.y - b1.halfHeight
    );
  }
}

