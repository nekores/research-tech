import * as ko from "knockout";
import {
  QuestionMatrixModel,
  MatrixRowModel,
  IMatrixData,
} from "../question_matrix";
import { QuestionImplementor } from "./koquestion";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { ItemValue } from "../itemvalue";
import { Helpers } from "../helpers";

export class QuestionMatrix extends QuestionMatrixModel {
  koVisibleRows: any = <any>ko.observableArray<MatrixRowModel>();
  koVisibleColumns: any = <any>ko.observableArray<any>();
  constructor(public name: string) {
    super(name);
    this.koVisibleRows(this.visibleRows);
    this.koVisibleColumns(this.visibleColumns);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
  protected onColumnsChanged() {
    super.onColumnsChanged();
    this.koVisibleColumns(this.visibleColumns);
  }
  protected onRowsChanged() {
    super.onRowsChanged();
    this.koVisibleRows(this.visibleRows);
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.onRowsChanged();
  }
  protected getVisibleRows(): Array<MatrixRowModel> {
    var rows = super.getVisibleRows();
    this.koVisibleRows(rows);
    return rows;
  }
  public getItemCss(row: any, column: any) {
    var isChecked = row.value == column.value;
    var isDisabled = this.isReadOnly;
    var allowHover = !isChecked && !isDisabled;
    var cellDisabledClass = this.hasCellText
      ? this.cssClasses.cellTextDisabled
      : this.cssClasses.itemDisabled;

    var cellSelectedClass = this.hasCellText
      ? this.cssClasses.cellTextSelected
      : this.cssClasses.itemChecked;

    var itemHoverClass = !this.hasCellText ? this.cssClasses.itemHover : "";

    var cellClass = this.hasCellText
      ? (<any>this)["koCss"]().cellText
      : (<any>this)["koCss"]().label;

    let itemClass =
      cellClass +
      (isChecked ? " " + cellSelectedClass : "") +
      (isDisabled ? " " + cellDisabledClass : "") +
      (allowHover ? " " + itemHoverClass : "");
    return itemClass;
  }
}

Serializer.overrideClassCreator("matrix", function () {
  return new QuestionMatrix("");
});
QuestionFactory.Instance.registerQuestion("matrix", (name) => {
  var q = new QuestionMatrix(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
