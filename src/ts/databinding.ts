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

  /**
   *
   * @param input
   * @param observable
   * use the `onkeyup` event to signal whenever the input value change
   */
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

  bindAll(elem: HTMLElement, context: any) {
    this.bindLists(elem, context);
    this.bindObservables(elem, context);
  }

  /**
   *
   * @param elem
   * @param context
   * file element with attribute is `data-bind`
   */
  bindObservables(elem: HTMLElement, context: any) {
    const dataBinding = elem.querySelectorAll("[data-bind]");
    dataBinding.forEach((elem: any) => {
      this.bindValue(elem, context[elem.getAttribute("data-bind")]);
    });
  }

  /**
   *
   * @param elem
   * @param context
   * - First: fine element with attribute `repeat`
   */
  bindLists(elem: HTMLElement, context: any) {
    const listBinding = elem.querySelectorAll("[repeat]");
    listBinding.forEach((elem) => {
      const parent = elem.parentElement;
      const expression = elem.getAttribute("repeat");
      elem.removeAttribute("repeat");
      const template = elem.outerHTML;
      if (parent) {
        parent.removeChild(elem);
        if (expression) {
          context[expression].forEach((item: Element) => {
            let newTemplate = `${template}`;
            const matches = newTemplate.match(/\{\{([^\}]*?)\}\}/g);
            if (matches) {
              matches.forEach((match) => {
                match = match.replace("{{", "").replace("}}", "");
                const value = this.executeInContext(`this.${match}`, { item });
                newTemplate = newTemplate.replace(`{{${match}}}`, value);
              });
              parent.innerHTML += newTemplate;
            }
          });
        }
      }
    });
  }
}
