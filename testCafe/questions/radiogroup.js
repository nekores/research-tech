import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "radiogroup";

const json = {
  questions: [
    {
      type: "radiogroup",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    await t.click("input[value=Nissan]").click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "Nissan");
  });

  test("change column count", async t => {
    const getClassName = ClientFunction(
      () => document.querySelector("div[id*=sq_1] fieldset .sv_q_select_column").className
    );
    let className = await getClassName();
    assert.notEqual(className.indexOf("sv-q-column-4"), -1);

    await setOptions("car", { colCount: 1 });

    const getClassNameOneCol = ClientFunction(
      () => document.querySelector("div[id*=sq_1] fieldset > .sv_q_radiogroup").className
    );
    className = await getClassNameOneCol();
    assert.notEqual(className.indexOf("sv-q-col-1"), -1);

    await setOptions("car", { colCount: 2 });

    className = await getClassName();
    assert.notEqual(className.indexOf("sv-q-column-2"), -1);
  });

  test("change choices order", async t => {
    const radiogroup = Selector("[role=\"radiogroup\"]");
    const chocies = radiogroup.find("input[type=\"radio\"]").parent("label").parent();

    //asc
    await setOptions("car", { choicesOrder: "asc" });
    await t.expect(chocies.nth(0).find("[aria-label=\"Audi\"]").exists).ok();
    await t.expect(chocies.nth(3).find("[aria-label=\"BMW\"]").exists).ok();

    //desc
    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(chocies.nth(0).find("[aria-label=\"Volkswagen\"]").exists).ok();
    await t.expect(chocies.nth(3).find("[aria-label=\"Vauxhall\"]").exists).ok();

    //random
    if (chocies.count === 1) {
      assert(false, "need to more than one choices");
    }

    let first = chocies.nth(0);
    let random_count = 0;
    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      const first_2 = chocies.nth(0);

      if (first.innerText !== first_2.innerText) {
        random_count++;
      }
      first = first_2;
      if (random_count >= 4) break;
    }

    //because of 'none', 'asc', 'desc' and if 4 it is really random
    assert(random_count >= 4);
  });

  test("check integrity", async t => {
    const choices = [
      "None",
      "Ford",
      "Vauxhall",
      "Volkswagen",
      "Nissan",
      "Audi",
      "Mercedes-Benz",
      "BMW",
      "Peugeot",
      "Toyota",
      "Citroen"
    ];
    const getChoicesCount = ClientFunction(
      () => document.querySelectorAll("div input[type=radio]").length
    );
    let checkIntegrity = async () => {
      const choicesCount = await getChoicesCount();
      assert.equal(choicesCount, choices.length);
      for (let i = 0; i < choices.length; i++) {
        await t.click(`input[value=${choices[i]}]`);
      }
    };

    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity();
  });

  test("show \"other\" choice", async t => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t.expect(Selector(".sv-string-viewer").withText("Other").visible).ok();
    await t.expect(Selector("textarea").visible).notOk();
    await t.click("input[value=Ford]");
    await t.expect(Selector("textarea").visible).notOk();
    await t.click("input[value=other]");
    await t.expect(Selector("textarea").visible).ok();
  });

  test("check \"other\" choice doesn't change order", async t => {
    const radiogroup = Selector("[role=\"radiogroup\"]");
    const chocies = radiogroup.find("input[type=\"radio\"]").parent("label").parent();

    await setOptions("car", { hasOther: true, otherText: "Other Test" });
    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(chocies.nth(11).find("[aria-label=\"Other Test\"]").exists).ok();
  });

  test("choose other", async t => {
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]);

    await setOptions("car", { hasOther: true });

    const radiogroup = Selector("[role=\"radiogroup\"]");
    const chocies = radiogroup.find("input[type=\"radio\"]").parent("label").parent();
    const otherText = chocies.nth(11).find("[aria-label=\"Other (describe)\"]");

    await t
      .click(otherText)
      .typeText(getOtherInput, "Zaporozec")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "other");
    assert.equal(surveyResult["car-Comment"], "Zaporozec");
  });

  test("checked class", async t => {
    const isCheckedClassExistsByIndex = ClientFunction(index =>
      document
        .querySelector(
          `fieldset .sv_q_select_column:nth-child(3) div:nth-child(${index})`
        )
        .classList.contains("checked")
    );

    assert.equal(await isCheckedClassExistsByIndex(2), false);
    assert.equal(await isCheckedClassExistsByIndex(3), false);

    await t.click(
      "fieldset .sv_q_select_column:nth-child(3) div:nth-child(2) label input"
    );

    assert.equal(await isCheckedClassExistsByIndex(2), true);
    assert.equal(await isCheckedClassExistsByIndex(3), false);

    await t.click(
      "fieldset .sv_q_select_column:nth-child(3) div:nth-child(3) label input"
    );

    assert.equal(await isCheckedClassExistsByIndex(2), false);
    assert.equal(await isCheckedClassExistsByIndex(3), true);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    const newTitle = "MyText";
    let questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    const outerSelector = ".sv_q_title";
    const innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    const json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test("click on radio title state editable", async (t) => {
    const newTitle = "MyText";
    let questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    const selector = ".sv_q_radiogroup_label .sv-string-editor";
    await t
      .click(selector)
      .typeText(selector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    const json = JSON.parse(await getQuestionJson());
    assert.equal(json.choices[0].text, newTitle);
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`;

  test("otherText changed", async t => {
    const currentJson = {
      title: "Survey New Design Test",
      description: "Survey Description",
      logoPosition: "left",
      questions: [
        {
          type: "checkbox",
          name: "car",
          title: "Checkbox",
          hasOther: true,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "radiogroup",
          name: "carss",
          title: "Radiogroup",
          hasOther: true,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
      ]
    };
    const oldOtherText = "Other (describe)";
    const newOtherText = "New Other";
    await initSurvey(framework, currentJson);
    await t
      .expect(Selector(".sv-string-viewer").withText(oldOtherText).count).eql(2)
      .expect(Selector(".sv-string-viewer").withText(newOtherText).count).eql(0);
    await ClientFunction(() => {
      const newOtherText = "New Other";
      window["survey"].getQuestionByName("car").otherText = newOtherText;
      window["survey"].getQuestionByName("carss").otherText = newOtherText;
    })();
    await t
      .expect(Selector(".sv-string-viewer").withText(oldOtherText).count).eql(0)
      .expect(Selector(".sv-string-viewer").withText(newOtherText).count).eql(2);
  });
});