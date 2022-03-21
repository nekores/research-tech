import React from "react";
import { ActionDropdownViewModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { Popup } from "../popup/popup";
import { SurveyActionBarItem } from "./action-bar-item";

export class SurveyActionBarItemDropdown extends SurveyActionBarItem {
  private viewModel: ActionDropdownViewModel;
  constructor(props: any) {
    super(props);
    this.viewModel = new ActionDropdownViewModel(this.item);
  }
  renderButtonContent() {
    const buttonContent = super.renderButtonContent();
    return (
      <>
        {buttonContent}
        <Popup model={this.item.popupModel}></Popup>
      </>
    );
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.viewModel.dispose();
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item-dropdown", (props) => {
  return React.createElement(SurveyActionBarItemDropdown, props);
});
