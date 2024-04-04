import { DataBinding } from "./databinding";

export class Slide {
  _text: string;
  _context: object;
  _dataBinding: DataBinding;
  _html: HTMLDivElement;
  _title: string;
  _transition!: NodeListOf<HTMLElement> | string;
  _nextSlideName!: string | null;

  constructor(text: string) {
    this._text = text;
    this._context = {};
    this._dataBinding = new DataBinding();
    this._html = document.createElement("div");
    this._html.innerHTML = text;
    this._title = this._html.querySelectorAll("title")[0].innerText;

    const transition = this._html.querySelectorAll("transition");
    transition.length
      ? (this._transition = transition[0].innerHTML)
      : (this._nextSlideName = null);

    const hasNext = this._html.querySelectorAll("next-slide");
    if (hasNext.length > 0) {
      this._nextSlideName = hasNext[0].innerHTML;
    }
    /**
     * used to execute scripts
     */
    const script = this._html.querySelector("script");
    if (script) {
      this._dataBinding.executeInContext(script.innerText, this._context, true);
      this._dataBinding.bindAll(this._html, this._context);
    }
  }

  get transition() {
    return this._transition;
  }

  get title() {
    return this._title;
  }

  get html() {
    return this._html;
  }

  get nextSlide() {
    return this._nextSlideName;
  }
}
