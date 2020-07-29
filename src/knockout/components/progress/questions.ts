import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./questions.html");
export var progressQuestionsComponent: any;

ko.components.register("survey-progress-questions", {
    viewModel: function (params: any) {
      this.survey = params.model;
      return { model: this.survey };
    },
    template: template
  });