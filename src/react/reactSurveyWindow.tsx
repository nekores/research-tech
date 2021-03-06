import * as React from "react";
import { Survey } from "./reactSurvey";
import { SurveyElementBase } from "./reactquestion_element";
import { Base, SurveyWindowModel } from "survey-core";

export class SurveyWindow extends Survey {
  protected window: SurveyWindowModel;
  constructor(props: any) {
    super(props);
    this.handleOnExpanded = this.handleOnExpanded.bind(this);
  }
  protected getStateElements(): Array<Base> {
    return [this.window, this.window.survey];
  }
  handleOnExpanded(event: any) {
    this.window.changeExpandCollapse();
  }
  protected canRender(): boolean {
    return super.canRender() && this.window.isShowing;
  }
  protected renderElement(): JSX.Element {
    var header = this.renderWindowHeader();
    var body = this.window.isExpanded ? this.renderBody() : null;
    let style: React.CSSProperties = {
      position: "fixed",
      bottom: 3,
      right: 10,
      maxWidth: "60%",
    };
    return (
      <div className={this.window.cssRoot} style={style}>
        {header}
        {body}
      </div>
    );
  }
  protected renderWindowHeader(): JSX.Element {
    var styleA = { width: "100%", cursor: "pointer" };
    var styleTitle = { paddingRight: "10px" };
    var glyphClassName = this.window.cssButton;
    glyphClassName = "glyphicon pull-right " + glyphClassName;
    var title = SurveyElementBase.renderLocString(this.survey.locTitle);
    return (
      <div className={this.window.cssHeaderRoot}>
        <span onClick={this.handleOnExpanded} style={styleA}>
          <span className={this.window.cssHeaderTitle} style={styleTitle}>
            {title}
          </span>
          <span className={glyphClassName} aria-hidden="true" />
        </span>
        {this.window.isExpanded ? (
          <span
            onClick={this.handleOnExpanded}
            style={{ float: "right", cursor: "pointer" }}
          >
            <span className={this.window.cssHeaderTitle} style={styleTitle}>
              X
            </span>
          </span>
        ) : null}
      </div>
    );
  }
  protected renderBody(): JSX.Element {
    return <div className={this.window.cssBody}>{this.doRender()}</div>;
  }
  protected createSurvey(newProps: any) {
    if (!newProps) newProps = {};
    super.createSurvey(newProps);
    this.window = new SurveyWindowModel(null, this.survey);
    if (newProps.closeOnCompleteTimeout) {
      this.window.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
    }
    this.window.isShowing = true;
    if (!this.window.isExpanded && (newProps.expanded || newProps.isExpanded))
      this.window.expand();
  }
}
