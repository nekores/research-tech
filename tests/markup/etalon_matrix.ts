import { registerMarkupTests } from "./helper";
import { StylesManager } from "../../src/stylesmanager";

registerMarkupTests(
  [
    {
      name: "Test matrix question (modern) markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("modern"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrix-modern",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix question markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrix-v2",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix question in mobile mode markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      initSurvey: survey => survey.setIsMobile(true),
      snapshot: "matrix-mobile-v2",
      excludePlatform: "Vue"
    },
  ]
);

