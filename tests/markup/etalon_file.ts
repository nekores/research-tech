import { StylesManager } from "../../src/stylesmanager";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  // default
  [{
    name: "Test file question empty (default)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "file",
  },
  {
    name: "Test file question ZIP (default)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            }
          ],
        }
      ]
    },
    snapshot: "file-zip",
  },
  {
    name: "Test file question PNG (default)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.png",
              "type": "image/png",
              "content": "#item1.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-png",
  },
  {
    name: "Test multiply file question (default)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-zip-png",
  },
  {
    name: "Test multiply file question readOnly (default)",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-zip-png-ro",
  },

  // defaultV2
  {
    name: "Test file question empty (defaultV2)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "file-2",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question ZIP (defaultV2)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            }
          ],
        }
      ]
    },
    snapshot: "file-2-zip",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question PNG (defaultV2)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.png",
              "type": "image/png",
              "content": "#item1.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-2-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question (defaultV2)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-2-zip-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question readOnly (defaultV2)",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-2-zip-png-ro",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  // defaultV2 mobile
  {
    name: "Test file question empty mobile (defaultV2 mobile)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "file-mob2",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test file question ZIP mobile (defaultV2 mobile)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            }
          ],
        }
      ]
    },
    snapshot: "file-mob2-zip",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test file question PNG mobile (defaultV2 mobile)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.png",
              "type": "image/png",
              "content": "#item1.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-mob2-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test multiply file question mobile (defaultV2 mobile)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-mob2-zip-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test multiply file question readOnly (defaultV2 mobile)",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-mob2-zip-png-ro",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  // modern
  {
    name: "Test file question empty (modern)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "file-modern",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question ZIP (modern)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            }
          ],
        }
      ]
    },
    snapshot: "file-modern-zip",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question PNG (modern)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: [
            {
              "name": "item1.png",
              "type": "image/png",
              "content": "#item1.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-modern-png",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question (modern)",
    json: {
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-modern-zip-png",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question readOnly (modern)",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden",
          allowMultiple: true,
          defaultValue: [
            {
              "name": "item1.zip",
              "type": "application/x-zip-compressed",
              "content": "#item1.zip"
            },
            {
              "name": "item2.png",
              "type": "image/png",
              "content": "#item2.png"
            }
          ],
        }
      ]
    },
    snapshot: "file-modern-zip-png-ro",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  ]
);