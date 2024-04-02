type ListenerCallback = (newVal: object) => any;

export class Observable {
  _value: any;
  _listeners: Array<ListenerCallback>;

  constructor(value: any) {
    this._value = value;
    this._listeners = [];
  }

  /**
   * Notifies subscribers of new value
   */
  notify() {
    this._listeners.forEach((listener) => listener(this._value));
  }

  /**
   *
   * @param listener
   */
  subscribe(listener: ListenerCallback) {
    this._listeners.push(listener);
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if (val !== this._value) {
      this._value = val;
      this.notify();
    }
  }
}

export class Computed extends Observable {
  /**
   *
   * @param value
   * @param deps
   */
  constructor(value: Function, deps: Observable[]) {
    super(value());
    const listener = () => {
      this._value = value();
      this.notify();
    };
    deps.forEach((dep) => dep.subscribe(listener));
  }

  get value() {
    return this._value;
  }

  set value(_) {
    throw "Cannot set computed property";
  }
}
