import { JsonObject } from "./jsonobject";
import { IElement } from "./base";
import { PanelModel } from "./panel";
import { LocalizableString } from "./localizablestring";
import { Question } from "./question";
import { start } from "repl";

/**
 * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
 *
 */
export class FlowPanelModel extends PanelModel {
  static contentElementNamePrefix = "element:";
  constructor(name: string = "") {
    super(name);
    this.createLocalizableString("content", this, true);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("content", function() {
      self.onContentChanged();
    });
  }
  public getType(): string {
    return "flowpanel";
  }
  onSurveyLoad(): any {
    super.onSurveyLoad();
    this.onContentChanged();
  }
  public get content(): string {
    return this.getLocalizableStringText("content");
  }
  public set content(val: string) {
    this.setLocalizableStringText("content", val);
  }
  public get locContent(): LocalizableString {
    return this.getLocalizableString("content");
  }
  public get html(): string {
    return this.getPropertyValue("html", "");
  }
  public set html(val: string) {
    this.setPropertyValue("html", val);
  }
  protected onContentChanged(): any {
    var html = [];
    //contentElementNamePrefix
    var regEx = /{(.*?(element:)[^$].*?)}/g;
    var str = this.content;
    var startIndex = 0;
    var res = null;
    while ((res = regEx.exec(str)) !== null) {
      if (res.index > startIndex) {
        html.push(str.substr(startIndex, res.index - startIndex));
        startIndex = res.index;
      }
      var question = this.getQuestionFromText(res[0]);
      if (!!question) {
        html.push(this.getHtmlForQuestion(question));
      } else {
        html.push(
          str.substr(startIndex, res.index + res[0].length - startIndex)
        );
      }
      startIndex = res.index + res[0].length;
    }
    if (startIndex < str.length) {
      html.push(str.substr(startIndex, str.length - startIndex));
    }
    this.html = html.join("");
  }
  private getQuestionFromText(str: string): Question {
    str = str.substr(1, str.length - 2);
    str = str.replace(FlowPanelModel.contentElementNamePrefix, "").trim();
    return this.getQuestionByName(str);
  }
  protected getHtmlForQuestion(question: Question): string {
    return "";
  }
  protected getQuestionHtmlId(question: Question): string {
    return this.name + "_" + question.id;
  }
  protected onAddElement(element: IElement, index: number) {
    super.onAddElement(element, index);
    this.addElementToContent(element);
  }
  protected onRemoveElement(element: IElement) {
    var searchStr = this.getElementContentText(element);
    this.content = this.content.replace(searchStr, "");
    super.onRemoveElement(element);
  }
  private addElementToContent(element: IElement) {
    if (this.isLoadingFromJson) return;
    this.content = this.content + this.getElementContentText(element);
  }
  private getElementContentText(element: IElement) {
    return "{" + FlowPanelModel.contentElementNamePrefix + element.name + "}";
  }
}

JsonObject.metaData.addClass(
  "flowpanel",
  [{ name: "content:text", serializationProperty: "locContent" }],
  function() {
    return new FlowPanelModel();
  },
  "panel"
);
