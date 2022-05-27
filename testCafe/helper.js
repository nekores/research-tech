import { ClientFunction, Selector } from "testcafe";
// eslint-disable-next-line no-undef
const minimist = require("minimist");

// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2));
const environment = args.env;

export const frameworks = environment ? [environment] : ["knockout", "react", "vue"];
// eslint-disable-next-line no-console
console.log("Frameworks: " + frameworks.join(", "));
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const applyTheme = ClientFunction((theme) => {
  window["Survey"].StylesManager.applyTheme(theme);
});

export const initSurvey = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    // eslint-disable-next-line no-console
    console.error = msg => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.warn = msg => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.log("surveyjs console.error and console.warn override");

    const model = new window["Survey"].Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!events) {
      for (var str in events) {
        model[str].add(events[str]);
      }
    }
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      window["ReactDOM"].render(
        window["React"].createElement(window["Survey"].Survey, {
          model: model,
          onComplete: surveyComplete,
        }),
        document.getElementById("surveyElement")
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<survey :survey='survey'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    }
    window["survey"] = model;
  }
);

export const registerCustomToolboxComponent = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    if (framework === "knockout") {
      window["ko"].components.register("svc-custom-action", {
        viewModel: {
          createViewModel: (params) => {
            return params.item;
          },
        },
        template: "<div class=\"my-custom-action-class\" data-bind=\"click: function() { $data.action() }, text: $data.title\"></div>"
      });
    } else if (framework === "react") {
      class CustomActionButton extends window["React"].Component {
        click = () => {
          this.props.item.action();
        }
        render() {
          return (
            // eslint-disable-next-line react/react-in-jsx-scope
            <div className="my-custom-action-class" onClick={this.click}> {this.props.item.title}</div>
          );
        }
      }

      window["Survey"].ReactElementFactory.Instance.registerElement("svc-custom-action", (props) => {
        return window["React"].createElement(CustomActionButton, props);
      });

    } else if (framework === "vue") {
      window["Vue"].component("svc-custom-action", {
        props: {
          item: {}
        },
        template: '<div class="my-custom-action-class" data-bind="click: function() { $data.action() }">{{ item.title }}</div>'
      });
    }
  }
);

export const registerCustomItemComponent = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    if (framework === "knockout") {
      window["ko"].components.register("new-item", {
        viewModel: {
          createViewModel: function (params, componentInfo) {
            const item = params.item;
            item.iconName = "icon-defaultfile";
            item.hint = item.title + " - Description";
            return item;
          }
        },
        template: "<div class=\"my-list-item\" style=\"display:flex;\" data-bind=\"attr: { title: hint } \"><span><sv-svg-icon params='iconName: iconName, size: iconSize'></sv-svg-icon></span><span data-bind=\"text: title, css: getActionBarItemTitleCss()\"></span></span></div>"
      });
    } else if (framework === "react") {
      class ItemTemplateComponent extends window["React"].Component {
        render() {
          const item = this.props.item;
          var Survey = window["Survey"];
          item.iconName = "icon-defaultfile";
          item.hint = item.title + " - Description";

          // eslint-disable-next-line react/react-in-jsx-scope
          return (<div className="my-list-item" style={{ display: "flex" }} title={item.hint}> <span> <Survey.SvgIcon iconName={item.iconName} size={item.iconSize} ></Survey.SvgIcon> </span> <span>{item.title}</span> </div>);
        }
      }
      window["Survey"].ReactElementFactory.Instance.registerElement("new-item", (props) => {
        return window["React"].createElement(ItemTemplateComponent, props);
      });

    } else if (framework === "vue") {
      window["Vue"].component("new-item", {
        props: {
          item: {}
        },
        created: function () {
          const item = this.item;
          item.iconName = "icon-defaultfile";
          item.hint = item.title + " - Description";
        },
        template: "<div class=\"my-list-item\" style=\"display:flex;\" v-bind:title=\"item.hint\" ><span><sv-svg-icon :iconName=\"item.iconName\" :size = \"item.iconSize\"></sv-svg-icon></span><span v-bind:class=\"item.getActionBarItemTitleCss()\">{{ item.title }}</span></span></div>"
      });
    }
  }
);

export const getSurveyResult = ClientFunction(() => {
  var result = window["SurveyResult"];
  if (typeof result === "undefined") {
    return result;
  }
  //clean result object from the vuejs stuff
  return JSON.parse(JSON.stringify(result));
});

export const getData = ClientFunction(() => {
  return window["survey"].data;
});

export const setData = ClientFunction(newData => {
  window["survey"].data = newData;
  window["survey"].render();
});

export const setOptions = ClientFunction((questionName, modValue) => {
  const mergeOptions = function (obj1, obj2) {
    for (const attrname in obj2) {
      obj1[attrname] = obj2[attrname];
    }
  };
  const q = window["survey"].getQuestionByName(questionName || "car");
  mergeOptions(q, modValue);
  window["survey"].render();
});

export const joinElementInnerText = ClientFunction((tagName, index) => {
  const el = document.getElementsByTagName(tagName)[index];
  const spans = el.querySelectorAll("span");
  let res = "";
  for (let i = 0; i < spans.length; i++) {
    const sp = spans[i];
    if (!sp.innerHTML || sp.innerHTML == "&nbsp;") continue;
    const childs = sp.getElementsByTagName("span");
    if (childs.length > 0) continue;
    if (!!res) res += " ";
    res += sp.innerHTML;
  }
  return res;
});

export const getQuestionValue = ClientFunction(() => {
  return window["survey"].getAllQuestions()[0].value;
});

export const getQuestionJson = ClientFunction(() => {
  return JSON.stringify(window["survey"].getAllQuestions()[0].toJSON());
});

export const getPanelJson = ClientFunction(() => {
  return JSON.stringify(window["survey"].getAllPanels()[0].toJSON());
});

export function getDynamicPanelRemoveButton(questionTitle, buttonText) {
  return Selector("span").withText(`${questionTitle}`).parent("[aria-labelledby]").find("span").withText(buttonText);
}

export async function checkSurveyWithEmptyQuestion(t) {
  const requiredMessage = Selector(".sv-string-viewer").withText("Response required.");

  await t
    .expect(requiredMessage.exists).notOk()
    .click("input[value=Complete]")
    .expect(requiredMessage.visible).ok();

  let surveyResult = await getSurveyResult();
  await t.expect(typeof surveyResult).eql("undefined");
}