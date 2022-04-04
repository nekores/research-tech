import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "progressButtons";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "text",
          name: "question1"
        }
      ]
    },
    {
      name: "page2",
      elements: [
        {
          type: "text",
          name: "question2"
        }
      ]
    },
    {
      name: "page3",
      elements: [
        {
          type: "text",
          name: "question3"
        }
      ]
    }
  ],
  showProgressBar: "top",
  progressBarType: "buttons"
};

["default", "modern", "bootstrap"].forEach((theme) => {
  frameworks.forEach((framework) => {
    fixture`${framework} ${title} ${theme}`
      .page`${url_test}${theme}/${framework}.html`.beforeEach(async (t) => {
      await applyTheme(theme);
      await initSurvey(framework, json);
    });
    test("check progress buttons", async (t) => {
      await t.hover(Selector("[aria-label='question1']"));
      await t.click(Selector("[title='page3']"));
      await t.hover(Selector("[aria-label='question3']"));
      await t.click(Selector("[title='page2']"));
      await t.hover(Selector("[aria-label='question2']"));
    });
  });
});