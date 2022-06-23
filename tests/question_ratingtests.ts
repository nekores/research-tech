import { QuestionRatingModel } from "../src/question_rating";
import { SurveyModel } from "../src/survey";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";
import { CustomResizeObserver } from "./questionImagepicker";

QUnit.test("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1);
});

QUnit.test("check rating default items has owner and owner property name", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const item = q1.visibleRateValues[0];
  assert.equal(item.locOwner, q1);
  assert.equal(item.ownerPropertyName, "rateValues");
});
QUnit.test("check rating processResponsiveness", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1["processResponsiveness"](500, 600);
  assert.equal(q1.renderAs, "default");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "dropdown");
});

QUnit.test("check rating initResponsiveness", (assert) => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultV2Css;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.afterRender(rootElement);
  assert.ok(q1["resizeObserver"]);
  q1.dispose();
  assert.notOk(q1["resizeObserver"]);
});

QUnit.test("check rating resize observer behavior", (assert) => {
  const ResizeObserver = window.ResizeObserver;
  const getComputedStyle = window.getComputedStyle;
  window.ResizeObserver = <any>CustomResizeObserver;
  let currentScrollWidth = 0;
  let currentOffsetWidth = 0;
  window.getComputedStyle = <any>(() => {
    return { width: currentOffsetWidth };
  });
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);

  Object.defineProperty(rootElement, "isConnected", {
    get: () => true
  });
  Object.defineProperties(contentElement, {
    "scrollWidth": {
      get: () => currentScrollWidth,
    },
    "offsetWidth": {
      get: () => currentOffsetWidth,
    }
  }
  );
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultV2Css;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.afterRender(rootElement);
  assert.ok(q1["resizeObserver"]);
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 300;
  currentScrollWidth = 300;
  (<any>q1["resizeObserver"]).call();
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "dropdown");
  currentOffsetWidth = 400;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "dropdown");
  q1["destroyResizeObserver"]();
  assert.equal(q1.renderAs, "default", "https://github.com/surveyjs/survey-creator/issues/2966: after destroying resize observer renderAs should return to default state");
  window.getComputedStyle = getComputedStyle;
  window.ResizeObserver = ResizeObserver;
});

QUnit.test("check rating in case of state 'collapsed'", (assert) => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  const getFuncOnStateChanged = () => {
    return q1["onPropChangeFunctions"].filter(item => item.name == "state" && item.key == "for-responsiveness")[0];
  };
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultV2Css;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.state = "collapsed";
  q1.afterRender(rootElement);
  assert.notOk(q1["resizeObserver"]);
  assert.ok(getFuncOnStateChanged());
  q1.state = "expanded";
  assert.ok(q1["resizeObserver"]);
  assert.notOk(getFuncOnStateChanged());
  q1.dispose();
  assert.notOk(q1["resizeObserver"]);
});
QUnit.test("check rating useDropdown", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
        useDropdown: "never"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1["processResponsiveness"](500, 600);
  assert.equal(q1.renderAs, "default", "useDropdown=never, big size, default");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "default", "useDropdown=never, small size, default");

  q1.useDropdown = "always";
  q1["processResponsiveness"](500, 600);
  assert.equal(q1.renderAs, "dropdown", "useDropdown=always, big size, dropdown");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "dropdown", "useDropdown=always, big size, dropdown");
});
QUnit.test("check getItemClass in display mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.mode = "display";
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1);
});
QUnit.test("check getRenderedItemClass for integers and strings", (assert) => {
  var json = {
    questions: [
      {
        "type": "rating",
        "name": "q1",
        "rateMax": 3,
        "minRateDescription": "No",
        "maxRateDescription": "10",
        "displayRateDescriptionsAsExtremeItems": true
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.mode = "display";
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemFixedSize = "sv_q_rating_fixed";
  const item = q1.renderedRateItems[0];
  const item2 = q1.renderedRateItems[1];
  const itemLast = q1.renderedRateItems[2];

  assert.ok(q1.getRenderedItemClass(item).indexOf("sv_q_rating_fixed") == -1);
  assert.ok(q1.getRenderedItemClass(item2).indexOf("sv_q_rating_fixed") != -1);
  assert.ok(q1.getRenderedItemClass(itemLast).indexOf("sv_q_rating_fixed") != -1);
});