import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { createSvg } from "survey-core";

export class SvgIcon extends React.Component<any, any> {
  private svgIconRef: any;
  constructor(props: any) {
    super(props);
    this.svgIconRef = React.createRef();
  }

  updateSvg() {
    createSvg(
      this.props.size,
      this.props.width,
      this.props.height,
      this.props.iconName,
      this.svgIconRef.current
    );
  }
  componentDidUpdate() {
    this.updateSvg();
  }
  render() {
    return (
      <svg
        className={"sv-svg-icon " + this.props.className}
        ref={this.svgIconRef}
      >
        <use></use>
      </svg>
    );
  }
  componentDidMount() {
    this.updateSvg();
  }
}

ReactElementFactory.Instance.registerElement("sv-svg-icon", (props) => {
  return React.createElement(SvgIcon, props);
});
