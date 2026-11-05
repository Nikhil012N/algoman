/**
 * Suffix Automaton (Direct Acyclic Word Graph - DAWG)
 * Linear-time O(N) index of all substrings of a string.
 * Used in high-performance bioinformatics (genome search), search engines, and compression algorithms.
 */
class State {
  len = 0;
  link = -1;
  next: Record<string, number> = {};
}

export class SuffixAutomaton {
  private readonly st: State[] = [];
  private sz = 1;
  private last = 0;

  constructor(text?: string) {
    this.st[0] = new State();
    if (text) {
      for (let i = 0; i < text.length; i++) {
        this.extend(text[i]!);
      }
    }
  }

  extend(c: string): void {
    const cur = this.sz++;
    this.st[cur] = new State();
    this.st[cur]!.len = this.st[this.last]!.len + 1;

    let p = this.last;
    while (p !== -1 && !(c in this.st[p]!.next)) {
      this.st[p]!.next[c] = cur;
      p = this.st[p]!.link;
    }

    if (p === -1) {
      this.st[cur]!.link = 0;
    } else {
      const q = this.st[p]!.next[c]!;
      if (this.st[p]!.len + 1 === this.st[q]!.len) {
        this.st[cur]!.link = q;
      } else {
        const clone = this.sz++;
        this.st[clone] = new State();
        this.st[clone]!.len = this.st[p]!.len + 1;
        this.st[clone]!.next = { ...this.st[q]!.next };
        this.st[clone]!.link = this.st[q]!.link;

        while (p !== -1 && this.st[p]!.next[c] === q) {
          this.st[p]!.next[c] = clone;
          p = this.st[p]!.link;
        }

        this.st[q]!.link = clone;
        this.st[cur]!.link = clone;
      }
    }

    this.last = cur;
  }

  /**
   * Checks if pattern is a substring of the indexed text in strictly O(M) time.
   */
  contains(pattern: string): boolean {
    if (!pattern) return true;
    let curr = 0;
    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i]!;
      if (!(c in this.st[curr]!.next)) {
        return false;
      }
      curr = this.st[curr]!.next[c]!;
    }
    return true;
  }

  /**
   * Computes the number of distinct substrings in O(states) time.
   */
  countDistinctSubstrings(): number {
    let count = 0;
    for (let i = 1; i < this.sz; i++) {
      count += this.st[i]!.len - this.st[this.st[i]!.link]!.len;
    }
    return count;
  }
}

/**
 * Aho-Corasick Automaton
 * Multi-pattern string matching in linear time O(N + M + Z).
 * Foundation of IDS/IPS (Snort, Suricata), antivirus signature scanning, and profanity filters.
 */
class ACNode {
  next: Record<string, ACNode> = {};
  link: ACNode | null = null;
  output: string[] = [];
}

export class AhoCorasick {
  private readonly root = new ACNode();

  constructor(keywords: readonly string[] = []) {
    for (const kw of keywords) {
      this.insert(kw);
    }
    this.buildFailureLinks();
  }

  insert(keyword: string): void {
    if (!keyword) return;
    let curr = this.root;
    for (let i = 0; i < keyword.length; i++) {
      const ch = keyword[i]!;
      if (!curr.next[ch]) {
        curr.next[ch] = new ACNode();
      }
      curr = curr.next[ch]!;
    }
    curr.output.push(keyword);
  }

  buildFailureLinks(): void {
    const queue: ACNode[] = [];

    for (const child of Object.values(this.root.next)) {
      child.link = this.root;
      queue.push(child);
    }

    while (queue.length > 0) {
      const curr = queue.shift()!;

      for (const [ch, child] of Object.entries(curr.next)) {
        let f: ACNode | null = curr.link;
        while (f && !f.next[ch] && f !== this.root) {
          f = f.link;
        }
        child.link = (f && f.next[ch]) ? f.next[ch]! : this.root;
        child.output.push(...child.link.output);
        queue.push(child);
      }
    }
  }

  /**
   * Finds all keyword occurrences in text returning match and 0-based end index.
   */
  search(text: string): { match: string; endIndex: number }[] {
    const results: { match: string; endIndex: number }[] = [];
    let curr: ACNode = this.root;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;

      while (curr !== this.root && !curr.next[ch]) {
        curr = curr.link ?? this.root;
      }

      curr = curr.next[ch] ?? this.root;

      for (const kw of curr.output) {
        results.push({ match: kw, endIndex: i });
      }
    }

    return results;
  }
}
