import * as ko from "knockout";
import { SurveyModel, SvgRegistry } from "survey-core";
import { SurveyElement } from "survey-core";
import { koTemplate, SurveyTemplateText } from "./templateText";
import { CustomWidgetCollection } from "survey-core";
import { LocalizableString } from "survey-core";
import { ItemValue } from "survey-core";
import { ImplementorBase } from "./kobase";
import { doKey2ClickDown, doKey2ClickUp, doKey2ClickBlur } from "../utils/utils";
import { SurveyTimerModel } from "../surveyTimerModel";

CustomWidgetCollection.Instance.onCustomWidgetAdded.add(customWidget => {
  if (customWidget.widgetJson.isDefaultRender) return;
  if (!customWidget.htmlTemplate)
    customWidget.htmlTemplate =
      "<div>'htmlTemplate' attribute is missed.</div>";
  new SurveyTemplateText().replaceText(
    customWidget.htmlTemplate,
    "widget",
    customWidget.name
  );
});

export class SurveyImplementor extends ImplementorBase {
  private renderedElement: HTMLElement;
  constructor(public survey: SurveyModel) {
    super(survey);
    this.survey.valueHashGetDataCallback = (valuesHash: any, key: string): any => {
      if (valuesHash[key] === undefined) {
        valuesHash[key] = ko.observable();
      }
      return ko.unwrap(valuesHash[key]);
    };
    this.survey.valueHashSetDataCallback = (valuesHash: any, key: string, value: any): void => {
      if (ko.isWriteableObservable(valuesHash[key])) {
        valuesHash[key](value);
      } else {
        valuesHash[key] = ko.observable(value);
      }
    };
    this.survey.valueHashDeleteDataCallback = (valuesHash: any, key: string): void => {
      if (ko.isWriteableObservable(valuesHash[key])) {
        valuesHash[key](undefined);
      } else {
        delete valuesHash[key];
      }
    };
    this.survey["koTitleTemplate"] = <any>ko.observable("survey-header");
    this.survey["koAfterRenderPage"] = (elements: any, con: any) => {
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      setTimeout(() => {
        !!ko.tasks && ko.tasks.runEarly();
        this.survey.afterRenderPage(el);
      }, 0);
    };
    this.survey["koAfterRenderHeader"] = (elements: any, con: any) => {
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (el) this.survey.afterRenderHeader(el);
    };
    this.survey.disposeCallback = () => {
      this.dispose();
    };
  }
  public render(element: any = null) {
    if (typeof ko === "undefined")
      throw new Error("knockoutjs library is not loaded.");
    const page = this.survey.activePage;
    if(!!page) {
      page.updateCustomWidgets();
    }
    this.survey.updateElementCss(false);
    if (element && typeof element === "string") {
      element = document.getElementById(element);
    }
    if (element) {
      this.renderedElement = element;
    }
    this.survey.startTimerFromUI();
    this.applyBinding();
  }
  private applyBinding() {
    if (!this.renderedElement) return;
    ko.cleanNode(this.renderedElement);
    ko.renderTemplate(
      "survey-content",
      this.survey,
      { afterRender: this.koEventAfterRender },
      this.renderedElement
    );
  }
  public koEventAfterRender(element: any, survey: any) {
    SvgRegistry.renderIcons();
    survey.afterRenderSurvey(element);
  }
  public dispose(): void {
    super.dispose();
    if (!!this.renderedElement) {
      ko.cleanNode(this.renderedElement);
      this.renderedElement.innerHTML = "";
    }
    this.survey["koAfterRenderPage"] = undefined;
    this.survey["koAfterRenderHeader"] = undefined;
    this.survey.iteratePropertiesHash((hash, key) => {
      delete hash[key];
    });
  }
}

SurveyModel.prototype["onCreating"] = function() {
  this.implementor = new SurveyImplementor(this);
};
SurveyModel.prototype["render"] = function(element: any = null) {
  this.implementor.render(element);
};
SurveyModel.prototype["getHtmlTemplate"] = function(): string {
  return koTemplate;
};

export class Survey extends SurveyModel {
  constructor(jsonObj: any = null, renderedElement: any = null) {
    super(jsonObj, renderedElement);
  }
}

LocalizableString.prototype["onCreating"] = function () {
  // var self = this;
  // this.koReRender = ko.observable(0);
  this.koHasHtml = ko.observable(this.hasHtml);
  this.koRenderedHtml = ko.observable(this.renderedHtml);
  // Object.defineProperty(self, "koHasHtml", {
  //   get: () => {
  //     self.koReRender();
  //     return self.hasHtml;
  //   },
  // });
  // this.koRenderedHtml = ko.pureComputed(function() {
  //   self.koReRender();
  //   return self.renderedHtml;
  // });
};

ItemValue.prototype["onCreating"] = function () {
  new ImplementorBase(this);
};

LocalizableString.prototype["onChanged"] = function () {
  // this.koReRender(this.koReRender() + 1);
  const hasHtml = this.hasHtml;
  this.koHasHtml(hasHtml);
  this.koRenderedHtml(hasHtml ? this.getHtmlValue() : this.calculatedText);
};
SurveyTimerModel.prototype["onCreating"] = function() {
  new ImplementorBase(this);
};

ko.components.register("survey", {
  viewModel: {
    createViewModel: function (params: any, componentInfo: any) {
      var survey: Survey = ko.unwrap(params.survey);
      setTimeout(() => {
        var surveyRoot = document.createElement("div");
        componentInfo.element.appendChild(surveyRoot);
        survey.render(surveyRoot);
      }, 1);
      // !!ko.tasks && ko.tasks.runEarly();
      return params.survey;
    },
  },
  template: koTemplate,
});

ko.bindingHandlers["surveyProp"] = {
  update: function (element: any, valueAccessor: any, allBindingsAccessor: any) {
    var value = ko.utils.unwrapObservable(valueAccessor()) || {};
    for (var propName in value) {
      if (typeof propName == "string") {
        var propValue = ko.utils.unwrapObservable(value[propName]);
        element[propName] = propValue;
      }
    }
  },
};
SurveyModel.platform = "knockout";

export var registerTemplateEngine = (ko: any, platform: string) => {
  (<any>ko).surveyTemplateEngine = function () { };

  (<any>ko).surveyTemplateEngine.prototype = new ko.nativeTemplateEngine();

  (<any>ko).surveyTemplateEngine.prototype.makeTemplateSource = function (
    template: any,
    templateDocument: any
  ) {
    if (typeof template === "string") {
      templateDocument = templateDocument || document;
      var templateElementRoot = templateDocument.getElementById(
        "survey-content-" + platform
      );
      if (!templateElementRoot) {
        templateElementRoot = document.createElement("div");
        templateElementRoot.id = "survey-content-" + SurveyModel.platform;
        templateElementRoot.style.display = "none";
        templateElementRoot.innerHTML = koTemplate;
        document.body.appendChild(templateElementRoot);
      }
      var elem;
      for (var i = 0; i < templateElementRoot.children.length; i++) {
        if (templateElementRoot.children[i].id === template) {
          elem = templateElementRoot.children[i];
          break;
        }
      }
      if (!elem) {
        elem = templateDocument.getElementById(template);
      }
      if (!elem) {
        return new ko.nativeTemplateEngine().makeTemplateSource(
          template,
          templateDocument
        );
      }
      return new ko.templateSources.domElement(elem);
    } else if (template.nodeType === 1 || template.nodeType === 8) {
      return new ko.templateSources.anonymousTemplate(template);
    } else {
      throw new Error("Unknown template type: " + template);
    }
  };

  // (<any>ko).surveyTemplateEngine.prototype.renderTemplateSource = function (templateSource: any, bindingContext: any, options: any, templateDocument: any) {
  //   var useNodesIfAvailable = !((<any>ko.utils).ieVersion < 9),
  //     templateNodesFunc = useNodesIfAvailable ? templateSource["nodes"] : null,
  //     templateNodes = templateNodesFunc ? templateSource["nodes"]() : null;
  //   if (templateNodes) {
  //     return (<any>ko.utils).makeArray(templateNodes.cloneNode(true).childNodes);
  //   } else {
  //     var templateText = templateSource["text"]();
  //     return (<any>ko.utils).parseHtmlFragment(templateText, templateDocument);
  //   }
  // };

  var surveyTemplateEngineInstance = new (<any>ko).surveyTemplateEngine();
  ko.setTemplateEngine(surveyTemplateEngineInstance);
};

ko.bindingHandlers["key2click"] = {
  init: function (element: HTMLElement, valueAccessor, allBindingsAccessor, viewModel: any) {
    const options = valueAccessor() || {
      processEsc: true
    };
    if (viewModel.disableTabStop) {
      element.tabIndex = -1;
      return;
    }
    element.tabIndex = 0;
    element.onkeyup = (evt: any) => {
      evt.preventDefault();
      evt.stopPropagation();
      doKey2ClickUp(evt, options);
      return false;
    };
    element.onkeydown = (evt: any) => doKey2ClickDown(evt, options);
    element.onblur = (evt: any) => doKey2ClickBlur(evt);
  },
};
