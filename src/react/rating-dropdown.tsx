import * as React from "react";
import { QuestionRatingModel, RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./reactquestion_dropdown";

export class SurveyQuestionRatingDropdown extends SurveyQuestionDropdownBase<QuestionRatingModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.cssClasses.rootDropdown}>
        {select}
      </div>
    );
  }
}
ReactQuestionFactory.Instance.registerQuestion(
  "sv-rating-dropdown",
  (props) => {
    return React.createElement(SurveyQuestionRatingDropdown, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
