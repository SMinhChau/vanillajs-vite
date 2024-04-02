import { Computed, Observable } from "./observable";

export class DataBinding {
  /**
   *
   * @param js
   * @returns
   */
  execute(js: string) {
    return eval(js);
  }

  executeInContext(src: string, context: any, attachBindingHelpers = false) {
    if (attachBindingHelpers) {
      context.observable = this.observable;
      context.computed = this.computed;
      context.bindValue = this.bindValue;
    }
    return this.execute.call(context, src);
  }

  observable(value: object) {
    return new Observable(value);
  }

  computed(calculation: Function, deps: Observable[]) {
    return new Computed(calculation, deps);
  }

  bindValue(input: HTMLInputElement, observable: Observable) {
    const initialValue = observable.value;
    input.value = initialValue;
    observable.subscribe(() => (input.value = observable.value));

    let converter = (value: any) => value;
    if (typeof initialValue === "number") {
      converter = (num) => (isNaN((num = parseFloat(num))) ? 0 : num);
    }
    input.onkeyup = () => {
      observable.value = converter(input.value);
    };
  }
}
