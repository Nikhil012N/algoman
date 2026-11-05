/**
 * Disjoint Set Union (DSU) / Union-Find data structure
 * Features:
 * - Path compression
 * - Union by rank
 * - Time: Nearly O(1) amortized via inverse Ackermann alpha(N)
 */
export class DisjointSet<T = string | number> {
  private readonly parent = new Map<T, T>();
  private readonly rank = new Map<T, number>();

  /**
   * Initializes or gets the set identifier for an element.
   */
  makeSet(x: T): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  /**
   * Finds the representative root of element x with path compression.
   */
  find(x: T): T {
    this.makeSet(x);
    const p = this.parent.get(x)!;
    if (p !== x) {
      const root = this.find(p);
      this.parent.set(x, root);
      return root;
    }
    return p;
  }

  /**
   * Merges sets containing a and b. Returns true if merged, false if already in same set.
   */
  union(a: T, b: T): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) return false;

    const rankA = this.rank.get(rootA)!;
    const rankB = this.rank.get(rootB)!;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }

    return true;
  }

  /**
   * Checks whether two elements belong to the same set.
   */
  connected(a: T, b: T): boolean {
    return this.find(a) === this.find(b);
  }
}

/**
 * Prefix Tree / Trie implementation for fast string retrieval and autocomplete.
 */
class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isEndOfWord = false;
}

export class Trie {
  private readonly root = new TrieNode();

  /**
   * Inserts a word into the trie.
   */
  insert(word: string): void {
    if (!word) return;
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true;
  }

  /**
   * Returns true if the exact word is present in the trie.
   */
  search(word: string): boolean {
    if (!word) return false;
    const node = this.traverse(word);
    return Boolean(node && node.isEndOfWord);
  }

  /**
   * Returns true if there is any word in the trie that starts with the given prefix.
   */
  startsWith(prefix: string): boolean {
    if (!prefix) return true;
    return this.traverse(prefix) !== null;
  }

  /**
   * Retrieves all words matching the specified prefix.
   */
  wordsWithPrefix(prefix: string): string[] {
    const startNode = prefix ? this.traverse(prefix) : this.root;
    if (!startNode) return [];

    const results: string[] = [];
    const collect = (node: TrieNode, path: string) => {
      if (node.isEndOfWord) results.push(path);
      for (const [char, child] of node.children.entries()) {
        collect(child, path + char);
      }
    };

    collect(startNode, prefix);
    return results;
  }

  private traverse(str: string): TrieNode | null {
    let curr = this.root;
    for (const char of str) {
      if (!curr.children.has(char)) return null;
      curr = curr.children.get(char)!;
    }
    return curr;
  }
}

