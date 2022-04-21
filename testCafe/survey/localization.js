import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, test, Selector } from "testcafe";
const title = "localization";

const setRu = ClientFunction(() => {
  window["survey"].locale = "ru";
});

const setEn = ClientFunction(() => {
  window["survey"].locale = "en";
});

const setDe = ClientFunction(() => {
  window["survey"].locale = "de";
});

const setFi = ClientFunction(() => {
  window["survey"].locale = "fi";
});

const setFr = ClientFunction(() => {
  window["survey"].locale = "fr";
});

const json = {
  title: "Software developer survey.",
  pages: [
    {
      title: "What operating system do you use?",
      questions: [
        {
          type: "checkbox",
          name: "opSystem",
          title: "OS",
          hasOther: true,
          isRequired: true,
          choices: ["Windows", "Linux", "Macintosh OSX"]
        },
        {
          type: "dropdown",
          name: "q1",
          choices: [
            { value: 1, text: { default: "en1", de: "de1", fr: "fr1" } },
            { value: 2, text: { default: "en2", de: "de2", fr: "fr2" } }
          ]
        }
      ]
    },
    {
      title: "What language(s) are you currently using?",
      questions: [
        {
          type: "checkbox",
          name: "langs",
          title: "Plese select from the list",
          colCount: 4,
          isRequired: true,
          choices: [
            "Javascript",
            "Java",
            "Python",
            "CSS",
            "PHP",
            "Ruby",
            "C++",
            "C",
            "Shell",
            "C#",
            "Objective-C",
            "R",
            "VimL",
            "Go",
            "Perl",
            "CoffeeScript",
            "TeX",
            "Swift",
            "Scala",
            "Emacs List",
            "Haskell",
            "Lua",
            "Clojure",
            "Matlab",
            "Arduino",
            "Makefile",
            "Groovy",
            "Puppet",
            "Rust",
            "PowerShell"
          ]
        }
      ]
    },
    {
      title: "Please enter your name and e-mail",
      questions: [
        { type: "text", name: "name", title: "Name:" },
        { type: "text", name: "email", title: "Your e-mail" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("next", async t => {
    await setRu();
    await t.hover("input[value=Далее]");

    await setEn();
    await t.hover("input[value=Next]");

    await setDe();
    await t.hover("input[value=Weiter]");

    await setFi();
    await t.hover("input[value=Seuraava]");

    await setFr();
    await t.hover("input[value=Suivant]");
  });
  test("check dropdown localizaition", async t => {
    const elSelect = Selector("select");
    const elOption = elSelect.find("option");
    await t
      .click(elSelect)
      .click(elOption.withText("en1"));
    await setDe();
    await t
      .click(elSelect)
      .click(elOption.withText("de1"));
    await setFr();
    await t
      .click(elSelect)
      .click(elOption.withText("fr2"));
    await setEn();
    await t
      .click(elSelect)
      .click(elOption.withText("en2"));
  });
});
