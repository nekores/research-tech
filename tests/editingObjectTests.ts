import { SurveyModel } from "../src/survey";
import { Base, Event, ArrayChanges } from "../src/base";
import { QuestionTextModel } from "../src/question_text";
import { MatrixDropdownColumn } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ExpressionValidator } from "../src/validator";
import {
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";

export default QUnit.module("Survey.editingObj Tests");

QUnit.test("Edit object property using the survey", function(assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel();
  survey.editingObj = question;
  assert.equal(
    survey.getValue("name"),
    "q1",
    "Get survey value from the object directly"
  );
  survey.setValue("name", "q2");
  assert.equal(question.name, "q2", "The question name was changed via survey");
  question.isRequired = true;
  survey.clearValue("isRequired");
  assert.equal(
    question.isRequired,
    false,
    "isRequired property is default again"
  );
});
QUnit.test("Expression based on object properties", function(assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  assert.equal(survey.getValue("inputType"), "text", "Get the default value");
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
});
QUnit.test("React on property change", function(assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
  question.inputType = "color";
  assert.equal(minQuestion.isVisible, false, "min property is invisible now");
  question.inputType = "text";
  assert.equal(minQuestion.isVisible, true, "min property is visible again");
});
QUnit.test("Edit question title property", function(assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.editingObj = question;
  assert.equal(question.title, "q1", "the default title value");
  assert.equal(survey.getValue("title"), undefined, "The value is empty");
  survey.setValue("title", "q1 title");
  assert.equal(question.title, "q1 title", "set title property correctly");
  survey.setValue("title", "");
  assert.equal(question.title, "q1", "get title property from name");
});
QUnit.test("Edit columns in matrix", function(assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new MatrixDropdownColumn("col3");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 2, "Two columns");
  assert.equal(
    matrix.visibleRows[0].cells[0].value,
    "col1",
    "Name set correctly"
  );
  matrix.visibleRows[0].cells[1].value = "title1";
  assert.equal(question.columns[0].title, "title1", "Edit title correctly");
  matrix.addRow();
  assert.equal(question.columns.length, 3, "We have 3 columns");
  assert.equal(question.columns[2].name, "col3", "column has correct name");
  assert.equal(
    question.columns[2].getType(),
    "matrixdropdowncolumn",
    "column added with correct type"
  );
});
QUnit.test(
  "Edit columns in matrix, where there is no columns from the beginning",
  function(assert) {
    var question = new QuestionMatrixDynamicModel("q1");
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "columns",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "name" },
            { cellType: "text", name: "title" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("columns")
    );
    matrix.onGetValueForNewRowCallBack = (
      sender: QuestionMatrixDynamicModel
    ): any => {
      var item = new MatrixDropdownColumn("col1");
      matrix.value.push(item);
      return item;
    };
    survey.editingObj = question;
    matrix.addRow();
    assert.equal(matrix.visibleRows.length, 1, "Two columns");
    assert.equal(
      matrix.visibleRows[0].cells[0].value,
      "col1",
      "Name set correctly"
    );
    matrix.visibleRows[0].cells[1].value = "title1";
    assert.equal(question.columns.length, 1, "We have one column now");
    assert.equal(question.columns[0].name, "col1", "Edit name correctly");
    assert.equal(question.columns[0].title, "title1", "Edit title correctly");
  }
);
QUnit.test("Edit columns in matrix, column isRequired and isUnique", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          {
            cellType: "text",
            name: "name",
            isRequired: true,
            isUnique: true,
          },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  survey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 2, "Two columns");
  assert.equal(
    matrix.visibleRows[0].cells[0].value,
    "col1",
    "Name set correctly"
  );
  var rows = matrix.visibleRows;
  var nameQuestion = rows[0].cells[0].question;
  assert.equal(nameQuestion.isRequired, true, "cell question is required");
  nameQuestion.value = "";
  assert.equal(nameQuestion.isEmpty(), true, "reset name in editing matrix");
  assert.equal(nameQuestion.errors.length, 1, "required error");
  assert.equal(
    question.columns[0].name,
    "col1",
    "do not set empty value into column"
  );
  nameQuestion.value = "col2";
  assert.equal(
    nameQuestion.value,
    "col2",
    "set duplicated name in editing matrix"
  );
  assert.equal(nameQuestion.errors.length, 1, "duplicate error");
  assert.equal(
    question.columns[0].name,
    "col1",
    "do not set duplcated value into column"
  );
  nameQuestion.value = "col3";
  assert.equal(nameQuestion.errors.length, 0, "no errors");
  assert.equal(
    question.columns[0].name,
    "col3",
    "set name property into column"
  );
});
QUnit.test("Edit choices in matrix with custom property", function(assert) {
  Serializer.addProperty("itemvalue", "imageLink");
  var question = new QuestionMatrixDynamicModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
          { cellType: "text", name: "imageLink" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "one choice");
  matrix.visibleRows[0].cells[2].value = "imageVal";
  assert.equal(
    question.choices[0].imageLink,
    "imageVal",
    "set custom property from matrix"
  );
  question.choices[0].imageLink = "imageVal1";
  assert.equal(
    matrix.visibleRows[0].cells[2].value,
    "imageVal1",
    "set custom property from question"
  );
  Serializer.removeProperty("itemvalue", "imageLink");
});
QUnit.test("Edit choices in matrix + detailPanel + hasError", function(assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value", isRequired: true },
          { cellType: "text", name: "text" },
        ],
        detailPanelMode: "underRowSingle",
        detailElements: [{ type: "text", name: "value", isRequired: true }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  question.choices.push(new ItemValue(null));
  assert.equal(matrix.hasErrors(), true, "value is null");
  var rows = matrix.visibleRows;
  rows[0].cells[0].value = "item1";
  assert.equal(matrix.hasErrors(), false, "value is not null");
});
QUnit.test("Edit custom choices in matrix with custom property", function(
  assert
) {
  Serializer.addClass("itemvalues_ex", [], null, "itemvalue");
  Serializer.addProperty("itemvalues_ex", "imageLink");
  Serializer.addProperty("text", { name: "test:itemvalues_ex[]" });
  var property = Serializer.findProperty("text", "test");
  property.type = "itemvalues_ex[]";

  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "test",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
          { cellType: "text", name: "imageLink" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("test");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = Serializer.createClass("itemvalues_ex");
    item.owner = matrix.value;
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "one choice");
  matrix.visibleRows[0].cells[2].value = "imageVal";
  assert.equal(
    question.test[0].imageLink,
    "imageVal",
    "set custom property from matrix"
  );
  question.test[0].imageLink = "imageVal1";
  assert.equal(
    matrix.visibleRows[0].cells[2].value,
    "imageVal1",
    "set custom property from question"
  );
  Serializer.removeProperty("text", "test");
  Serializer.removeProperty("itemvalues_ex", "imageLink");
  Serializer.removeClass("itemvalues_ex");
});

QUnit.test("Edit validators in matrix", function(assert) {
  var question = new QuestionTextModel("q1");
  //question.validators.push(new ExpressionValidator());
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "validators",
        rowCount: 0,
        columns: [
          {
            cellType: "dropdown",
            name: "validatorType",
            choices: [{ value: "expressionvalidator", text: "expression" }],
          },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("validators")
  );
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ExpressionValidator();
    item["validatorType"] = item.getType();
    sender.value.push(item);
    //question.validators.push(item);
    return item;
  };
  survey.editingObj = question;
  assert.strictEqual(
    matrix.value,
    question.validators,
    "matrix value and validators array is the same object"
  );
  assert.equal(matrix.visibleRows.length, 0, "visibleRows is empty");
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "visibleRows has a row");
  assert.equal(question.validators.length, 1, "Validator is here");
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct"
  );
  matrix.getDisplayValue(true);
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct after calling getDisplayValue"
  );
});

QUnit.test("Composite: create from code", function(assert) {
  var json = {
    name: "propertygrid_restfull",
    createElements: function(panel, question) {
      panel.fromJSON({
        elements: [
          { type: "text", name: "url", title: question.title + "_url" },
        ],
      });
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "propertygrid_restfull", name: "choicesByUrl" }],
  });
  var counter = 0;
  survey.onValueChanging.add(function(sender, options) {
    counter++;
  });
  var question = new QuestionDropdownModel("q1");
  question.choicesByUrl.url = "myUrl";
  survey.editingObj = question;
  assert.equal(counter, 0, "We do not change anything");
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var urlQ = q.contentPanel.questions[0];
  assert.equal(urlQ.value, "myUrl", "Url set correctly from question");
  assert.equal(urlQ.title, "choicesByUrl_url");
  urlQ.value = "myUrl2";
  assert.equal(
    question.choicesByUrl.url,
    "myUrl2",
    "Url set correctly into question"
  );
  assert.equal(counter, 1, "We change url");
  urlQ.value = "";
  assert.notOk(question.choicesByUrl.url, "Url is empty");
  assert.equal(counter, 2, "We change url again");
  ComponentCollection.Instance.clear();
});

QUnit.test("simple validation, checkErrorsMode: onValueChanging", function(
  assert
) {
  var question = new QuestionDropdownModel("q1");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.onValidateQuestion.add(function(sender, options) {
    if (options.name !== "name") return;
    options.error = options.value.length != 3 ? "require3symbols" : null;
  });
  survey.editingObj = question;
  var nameQuestion = survey.getQuestionByName("name");
  nameQuestion.value = "q2";
  assert.equal(question.name, "q1", "We have old value");
  assert.equal(nameQuestion.value, "q2", "We have new value in prop grid");
  assert.equal(nameQuestion.errors.length, 1, "There is one error");
  nameQuestion.value = "qq2";
  assert.equal(question.name, "qq2", "We have new value");
  assert.equal(nameQuestion.errors.length, 0, "There is no errors");
});
QUnit.test("Validate in matrix, checkErrorsMode: onValueChanging", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  survey.onMatrixCellValidate.add(function(sender, options) {
    if (options.columnName != "name") return;
    options.error = options.value.length != 4 ? "Error in name" : null;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  var row = matrix.visibleRows[0];
  survey.editingObj = question;
  matrix.visibleRows[0].cells[0].value = "col33";
  assert.equal(
    row.cells[0].value,
    "col33",
    "keep incorrect value in question cell"
  );
  assert.equal(row.cells[0].question.errors.length, 1, "There is an error");
  assert.equal(question.columns[0].name, "col1", "column name is not changed");
  matrix.visibleRows[0].cells[0].value = "col3";
  assert.equal(row.cells[0].question.errors.length, 0, "There is no errors");
  assert.equal(question.columns[0].name, "col3", "column name is changed");
});
QUnit.test("Edit question string[] property type", function(assert) {
  var question = new QuestionTextModel("q1");
  question.dataList = ["item1", "item2"];
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [{ type: "comment", name: "dataList" }],
  });
  var dataListQuestion = survey.getQuestionByName("dataList");
  dataListQuestion.valueFromDataCallback = function(val: any): any {
    if (!Array.isArray(val)) return "";
    return val.join("\n");
  };
  dataListQuestion.valueToDataCallback = function(val: any): any {
    if (!val) return [];
    return val.split("\n");
  };
  survey.editingObj = question;
  assert.deepEqual(
    survey.getValue("dataList"),
    ["item1", "item2"],
    "string[] property get correctly value"
  );
  assert.equal(dataListQuestion.value, "item1\nitem2");
  dataListQuestion.value = "item1\nitem2\nitem3";
  assert.equal(question.dataList.length, 3, "There are three items now");
  assert.equal(question.dataList[2], "item3", "The third item is 'item3'");
});
QUnit.test("Edit custom array that returns values onGetValue", function(
  assert
) {
  Serializer.addProperty("page", {
    name: "pages:surveypages",
    className: "page",
    category: "general",
    displayName: "Page order",
    onGetValue: function(obj) {
      return !!obj && !!obj.survey ? obj.survey.pages : [];
    },
    onSetValue: function(obj) {
      //Do nothing
    },
    isSerializable: false,
  });
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  survey.addNewPage("page2");
  survey.addNewPage("page3");
  survey.currentPage = survey.pages[0];

  var editSurvey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "pages",
        columns: [{ cellType: "text", name: "name" }],
        rowCount: 0,
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    editSurvey.getQuestionByName("pages")
  );
  editSurvey.editingObj = survey.pages[0];
  var pages = editSurvey.getValue("pages");
  assert.ok(pages);
  assert.equal(pages.length, 3);
  var rows = matrix.visibleRows;
  assert.equal(rows.length, 3, "There are 3 pages");
  Serializer.removeProperty("page", "pages");
});
QUnit.test("Edit matrix dynamic column", function(assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var column = question.addColumn("col1", "Column 1");
  column.cellType = "checkbox";
  column["hasSelectAll"] = true;
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "name",
        isRequired: true,
      },
      {
        type: "comment",
        name: "title",
      },
      {
        type: "boolean",
        name: "hasSelectAll",
      },
    ],
  });
  survey.editingObj = column;
  assert.equal(
    survey.getQuestionByName("name").value,
    "col1",
    "column name value is set correctly"
  );
  assert.equal(
    survey.getQuestionByName("title").value,
    "Column 1",
    "column title value is set correctly"
  );
  assert.equal(
    survey.getQuestionByName("hasSelectAll").value,
    true,
    "column hasSelectAll value is set correctly"
  );
  survey.getQuestionByName("name").value = "col2";
  survey.getQuestionByName("title").value = "Column 2";
  survey.getQuestionByName("hasSelectAll").value = false;
  assert.equal(column.name, "col2", "column name changed correctly");
  assert.equal(column.title, "Column 2", "column title changed correctly");
  assert.equal(
    column["hasSelectAll"],
    false,
    "column hasSelectAll changed correctly"
  );
});
QUnit.test("Edit choices in matrix dynamic column", function(assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var column = question.addColumn("col1", "Column 1");
  column.cellType = "checkbox";
  column["choices"] = [1, 2, 3, 4, 5];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = column;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.rowCount, 5, "There are 5 items");
  column["choices"].push(new ItemValue(6));
  assert.equal(matrix.rowCount, 6, "There are 6 items now");
  matrix.visibleRows[0].cells[0].value = "Item 1";
  assert.equal(column["choices"][0].value, "Item 1", "value changed in matrix");
});
