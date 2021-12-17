interface Hashable {
  hashValue: string
}

class HashMap<T extends Hashable,E> {
  private map: Map<string,E>;
  constructor() {
    this.map = new Map<string,E>();
  }

  public has(key: T): boolean {
    return this.map.has(key.hashValue);
  }

  public set(key: T, value: E) {
    this.map.set(key.hashValue, value);
  }

  public get(key: T): E {
    return this.map.get(key.hashValue)!;
  }
};

class HashSet<T extends Hashable> {
  private set: Set<string>;
  private valueLookup: Map<string, T>;

  constructor(values: T[] = []) {
    this.set = new Set<string>(values.map(v => v.hashValue));
    this.valueLookup = new Map(values.map(v => [v.hashValue, v]));
  }

  public has(key: T): boolean {
    return this.set.has(key.hashValue);
  }

  public add(key: T) {
    if (this.has(key)) {
      return;
    }
    this.set.add(key.hashValue);
    this.valueLookup.set(key.hashValue, key);
  }

  public delete(key: T) {
    this.set.delete(key.hashValue);
    this.valueLookup.delete(key.hashValue);
  }

  get size(): number {
    return this.set.size;
  }

  public iter(): IterableIterator<T> {
    return this.valueLookup.values();
  }
};

export { Hashable, HashMap, HashSet };
