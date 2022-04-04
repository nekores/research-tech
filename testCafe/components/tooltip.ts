import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "Tooltip errors";

var json = {
  questions: [
    {
      type: "matrixdynamic",
      name: "matrixdynamic_question",
      columns: [
        {
          isRequired: true,
          name: "Column 1",
        },
      ],
      choices: [1],
      rowCount: 1,
    },
    {
      type: "paneldynamic",
      name: "paneldynamic",
      templateElements: [
        {
          type: "text",
          isRequired: true,
          name: "paneldynamic_question",
        },
      ],
      panelCount: 1,
    },
    {
      type: "multipletext",
      name: "multipletext",
      items: [
        {
          isRequired: true,
          name: "multipletext_item",
          title: "multipletext_item"
        }
      ]
    },
  ],
};

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}.html`
    .beforeEach(async (t) => {
      await applyTheme(themeName);
      await initSurvey(framework, json);
      await t.resizeWindow(1000, 1000);
    });
  test("check errors tooltip", async (t) => {
    const focusBody = ClientFunction(() => { document.body.focus(); });
    const getTooltipPosition = (base: number, offset: number): string => {
      return base + offset + 12 + "px";
    };
    const matrixCellSelector = Selector(".sd-table__cell:not(.sd-table__cell--header)");
    const questionInPanelSelector = Selector(".sd-question__content .sd-question__content");
    const multipleTextCellSelector = Selector(".sd-multipletext__cell");
    const tooltipClass = ".sd-question__erbox--tooltip";
    await t
      .click(Selector("input[value='Complete']"));
    await focusBody();
    const tooltipInPanel = questionInPanelSelector.find(tooltipClass);
    const tooltipInMatrix = matrixCellSelector.find(tooltipClass);
    const tooltipInMultipleText = multipleTextCellSelector.find(tooltipClass);
    const questionInPanelClientRect = await questionInPanelSelector.boundingClientRect;
    const matrixCellClientRect = await matrixCellSelector.boundingClientRect;
    const multipleTextCellClientRect = await multipleTextCellSelector.boundingClientRect;
    await t.expect(tooltipInPanel.visible).notOk()
      .hover(questionInPanelSelector, { offsetX: 30, offsetY: 30 })
      .expect(tooltipInPanel.visible).ok()
      .expect(tooltipInPanel.getStyleProperty("left")).eql(getTooltipPosition(questionInPanelClientRect.left, 30))
      .expect(tooltipInPanel.getStyleProperty("top")).eql(getTooltipPosition(questionInPanelClientRect.top, 30))
      .hover(questionInPanelSelector, { offsetX: 40, offsetY: 40 })
      .expect(tooltipInPanel.getStyleProperty("left")).eql(getTooltipPosition(questionInPanelClientRect.left, 40))
      .expect(tooltipInPanel.getStyleProperty("top")).eql(getTooltipPosition(questionInPanelClientRect.top, 40))
      .hover(matrixCellSelector, { offsetX: 10, offsetY: 10 })
      .expect(tooltipInMatrix.visible).ok()
      .expect(tooltipInMatrix.getStyleProperty("left")).eql(getTooltipPosition(matrixCellClientRect.left, 10))
      .expect(tooltipInMatrix.getStyleProperty("top")).eql(getTooltipPosition(matrixCellClientRect.top, 10))
      .hover(matrixCellSelector, { offsetX: 20, offsetY: 20 })
      .expect(tooltipInMatrix.getStyleProperty("left")).eql(getTooltipPosition(matrixCellClientRect.left, 20))
      .expect(tooltipInMatrix.getStyleProperty("top")).eql(getTooltipPosition(matrixCellClientRect.top, 20))
      .hover(multipleTextCellSelector, { offsetX: 10, offsetY: 10 })
      .expect(tooltipInMultipleText.visible).ok()
      .expect(tooltipInMultipleText.getStyleProperty("left")).eql(getTooltipPosition(multipleTextCellClientRect.left, 10))
      .expect(tooltipInMultipleText.getStyleProperty("top")).eql(getTooltipPosition(multipleTextCellClientRect.top, 10))
      .hover(multipleTextCellSelector, { offsetX: 20, offsetY: 20 })
      .expect(tooltipInMultipleText.getStyleProperty("left")).eql(getTooltipPosition(multipleTextCellClientRect.left, 20))
      .expect(tooltipInMultipleText.getStyleProperty("top")).eql(getTooltipPosition(multipleTextCellClientRect.top, 20));
  });
});
