import { Base } from "./base";
import { SurveyModel } from "./survey";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for a survey running in the Window.
 */
export class SurveyWindowModel extends Base {
  public static surveyElementName = "windowSurveyJS";
  surveyValue: SurveyModel;
  windowElement: HTMLDivElement;

  templateValue: string;
  expandedChangedCallback: () => void;
  showingChangedCallback: () => void;

  constructor(jsonObj: any, initialModel: SurveyModel = null) {
    super();
    if (initialModel) {
      this.surveyValue = initialModel;
    } else {
      this.surveyValue = this.createSurvey(jsonObj);
    }
    this.surveyValue.showTitle = false;
    if ("undefined" !== typeof document) {
      this.windowElement = <HTMLDivElement>document.createElement("div");
    }
    this.survey.onComplete.add((survey, options) => {
      this.onSurveyComplete();
    });
    this.registerFunctionOnPropertyValueChanged("isShowing", () => {
      if(!!this.showingChangedCallback) this.showingChangedCallback();
    });
    this.registerFunctionOnPropertyValueChanged("isExpanded", () => {
      this.onExpandedChanged();
    });
    this.updateCss();
    this.onCreating();
  }
  protected onCreating(): void {}
  public getType(): string {
    return "window";
  }
  /**
   * A survey object.
   * @see SurveyModel
   */
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  /**
   * Set this value to negative value, for example -1, to avoid closing the window on completing the survey. Leave it equals to 0 (default value) to close the window immediately, or set it to 3, 5, 10, ... to close the window in 3, 5, 10 seconds.
   */
  public closeOnCompleteTimeout: number = 0;
  /**
   * Returns true if the window is currently showing. Set it to true to show the window and false to hide it.
   * @see show
   * @see hide
   */
  public get isShowing(): boolean {
    return this.getPropertyValue("isShowing", false);
  }
  public set isShowing(val: boolean) {
    this.setPropertyValue("isShowing", val);
  }
  /**
   * Show the window
   * @see hide
   * @see isShowing
   */
  public show(): void {
    this.isShowing = true;
  }
  /**
   * Hide the window
   * @see show
   * @see isShowing
   */
  public hide(): void {
    this.isShowing = false;
  }
  /**
   * Returns true if the window is expanded. Set it to true to expand the window or false to collapse it.
   * @see expand
   * @see collapse
   */
  public get isExpanded(): boolean {
    return this.getPropertyValue("isExpanded", false);
  }
  public set isExpanded(val: boolean) {
    this.setPropertyValue("isExpanded", val);
  }
  protected onExpandedChanged(): void {
    if (!!this.expandedChangedCallback) {
      this.expandedChangedCallback();
    }
    this.updateCssButton();
  }
  /**
   * The window and survey title.
   */
  public get title(): string {
    return this.survey.title;
  }
  public set title(value: string) {
    this.survey.title = value;
  }
  get locTitle(): LocalizableString {
    return this.survey.locTitle;
  }
  /**
   * Expand the window to show the survey.
   */
  public expand(): void {
    this.isExpanded = true;
  }
  /**
   * Collapse the window and show survey title only.
   */
  public collapse(): void {
    this.isExpanded = false;
  }
  public changeExpandCollapse(): void {
    this.isExpanded = !this.isExpanded;
  }
  public get css(): any {
    return this.survey.css;
  }
  public get cssButton(): string {
    return this.getPropertyValue("cssButton", "");
  }
  public get cssRoot(): string {
    return this.getPropertyValue("cssRoot", "");
  }
  public get cssBody(): string {
    return this.getPropertyValue("cssBody", "");
  }
  public get cssHeaderRoot(): string {
    return this.getPropertyValue("cssHeaderRoot", "");
  }
  public get cssHeaderTitle(): string {
    return this.getPropertyValue("cssHeaderTitle", "");
  }
  private updateCss() {
    if(!this.css || !this.css.window) return;
    const cssWindow = this.css.window;
    this.setPropertyValue("cssRoot", cssWindow.root);
    this.setPropertyValue("cssBody", cssWindow.body);
    const cssHeader = cssWindow.header;
    if(!cssHeader) return;
    this.setPropertyValue("cssHeaderRoot", cssHeader.root);
    this.setPropertyValue("cssHeaderTitle", cssHeader.title);
    this.updateCssButton();
  }
  private updateCssButton() {
    const cssHeader = !!this.css.window ? this.css.window.header : null;
    if(!cssHeader) return;
    this.setCssButton(this.isExpanded ? cssHeader.buttonExpanded : cssHeader.buttonCollapsed);
  }
  private setCssButton(val: string): void {
    if(!val) return;
    this.setPropertyValue("cssButton", val);
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new SurveyModel(jsonObj);
  }
  protected onSurveyComplete(): void {
    if (this.closeOnCompleteTimeout < 0) return;
    if (this.closeOnCompleteTimeout == 0) {
      this.hide();
    } else {
      var self = this;
      var timerId: any = null;
      var func = function () {
        self.hide();
        if (typeof window !== "undefined") {
          window.clearInterval(timerId);
        }
      };
      timerId =
        typeof window !== "undefined"
          ? window.setInterval(func, this.closeOnCompleteTimeout * 1000)
          : 0;
    }
  }
}
