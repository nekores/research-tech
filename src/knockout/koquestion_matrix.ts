import * as ko from "knockout";
import {
  QuestionMatrixModel,
  MatrixRowModel,
  IMatrixData
} from "../question_matrix";
import { QuestionImplementor } from "./koquestion";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { ItemValue } from "../itemvalue";
import { Helpers } from "../helpers";

export class MatrixRow extends MatrixRowModel {
  private isValueUpdating = false;
  koValue: any;
  koCellClick: any;
  constructor(
    item: ItemValue,
    public fullName: string,
    data: IMatrixData,
    value: any
  ) {
    super(item, fullName, data, value);
    this.koValue = ko.observable(this.value);
    var self = this;
    this.koValue.subscribe(function(newValue) {
      if (self.isValueUpdating) true;
      self.value = newValue;
    });
    this.koCellClick = function(column) {
      self.koValue(column.value);
    };
  }
  protected onValueChanged() {
    this.isValueUpdating = true;
    if (!Helpers.isTwoValueEquals(this.koValue(), this.value)) {
      this.koValue(this.value);
    }
    this.isValueUpdating = false;
  }
}
export class QuestionMatrix extends QuestionMatrixModel {
  koVisibleRows: any;
  constructor(public name: string) {
    super(name);
    new QuestionImplementor(this);
    this.koVisibleRows = ko.observable(this.visibleRows);
  }
  protected onRowsChanged() {
    super.onRowsChanged();
    this.koVisibleRows(this.visibleRows);
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.koVisibleRows(this.visibleRows);
  }
  protected createMatrixRow(
    item: ItemValue,
    fullName: string,
    value: any
  ): MatrixRowModel {
    return new MatrixRow(item, fullName, this, value);
  }
  public getItemCss(row, column) {
    var isChecked = row.koValue() == column.value;
    var cellSelectedClass = this.hasCellText
      ? this.cssClasses.cellTextSelected
      : "checked";
    var cellClass = this.hasCellText
      ? this["koCss"]().cellText
      : this["koCss"]().label;
    let itemClass = cellClass + (isChecked ? " " + cellSelectedClass : "");
    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("matrix", function() {
  return new QuestionMatrix("");
});
QuestionFactory.Instance.registerQuestion("matrix", name => {
  var q = new QuestionMatrix(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
