import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, checkElementScreenshot } from "../../helper";

const title = "Dropdown Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });
  test("Check dropdown question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "dropdown",
          title: "Where are you living?",
          name: "dropdown_question",
          optionsCaption: "Select country here...",
          choices: ["Greece"]
        },
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(() => { document.body.focus(); })();
    await checkElementScreenshot("dropdown-question.png", questionRoot, t);

    await ClientFunction(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; })();
    await checkElementScreenshot("dropdown-question-answered.png", questionRoot, t);
  });

  test("Check dropdown select question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "dropdown",
          title: "Where are you living?",
          name: "dropdown_question",
          optionsCaption: "Select country here...",
          choices: ["Greece"],
          renderAs: "select"
        },
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(() => { document.body.focus(); })();
    await checkElementScreenshot("dropdown-select-question.png", questionRoot, t);

    await ClientFunction(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; })();
    await checkElementScreenshot("dropdown-select-question-answered.png", questionRoot, t);
  });

  test("Check dropdown select question popup", async (t) => {
    await t.resizeWindow(1280, 1100);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
          name: "question1",
          hasOther: "true",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        },
        {
          type: "dropdown",
          renderAs: "select",
          name: "question12",
          hasOther: "true",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7"
          ]
        }
      ]
    });

    const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .click(questionDropdownSelect)
      .pressKey("tab tab");
    await checkElementScreenshot("dropdown-select-question-popup-with-search.png", popupContainer, t);

    await t
      .pressKey("esc")
      .click(questionDropdownSelect.nth(1));
    await checkElementScreenshot("dropdown-select-question-popup.png", popupContainer, t);
  });
});