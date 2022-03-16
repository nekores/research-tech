import { HashTable } from "./helpers";
import { ProcessValue } from "./conditionProcessValue";

import { Operand, FunctionOperand } from "./expressions/expressions";
import { ConditionsParser } from "./conditionsParser";

/**
 * Base interface for expression execution
 */
export interface IExpresionExecutor {
  /**
   * This call back runs on executing expression if there is at least one async function
   */
  onComplete: (res: any) => void;
  /**
   * The expression as string, property with get/set
   */
  expression: string;
  /**
   * Returns true if the expression is valid and can be executed
   */
  canRun(): boolean;
  /**
   * Run the expression. Returns the result of execution.
   * The result can be undefined if there is an asyn function. In this case result will be returned onComplete callback.
   * @param values has with values names and their results. Normally it is question names and their values
   * @param properties the list of properties that are available in functions. Commonly it is survey and question, if expression execuited in a question context
   */
  run(values: HashTable<any>, properties: HashTable<any>): any;
  /**
   * Returns the list of variables that used in the expression. They defined as: {variableName} in default parser.
   */
  getVariables(): Array<string>;
  /**
   * Returns true if there is a function in the expression
   */
  hasFunction(): boolean;
  /**
   * Returns true if there is an async function in the expression
   */
  isAsync: boolean;
}

export class ExpressionExecutor implements IExpresionExecutor {
  public static createExpressionExecutor: () => IExpresionExecutor = () => { return new ExpressionExecutor(); }
  public onComplete: (res: any) => void;
  private expressionValue: string;
  private operand: Operand;
  private processValue = new ProcessValue();
  private parser = new ConditionsParser();
  private isAsyncValue: boolean = false;
  private hasFunctionValue: boolean = false;
  private asyncFuncList: Array<FunctionOperand>;

  public get expression(): string {
    return this.expressionValue;
  }
  public set expression(value: string) {
    if (this.expression === value) return;
    this.expressionValue = value;
    this.operand = this.parser.parseExpression(value);
    this.hasFunctionValue = this.canRun() ? this.operand.hasFunction() : false;
    this.isAsyncValue = this.hasFunction()
      ? this.operand.hasAsyncFunction()
      : false;
  }
  public getVariables(): Array<string> {
    if (!this.operand) return [];

    var variables: Array<string> = [];
    this.operand.setVariables(variables);
    return variables;
  }

  public hasFunction(): boolean {
    return this.hasFunctionValue;
  }
  public get isAsync(): boolean {
    return this.isAsyncValue;
  }

  public canRun(): boolean {
    return !!this.operand;
  }

  public run(
    values: HashTable<any>,
    properties: HashTable<any> = null
  ): any {
    if (!this.operand) return null;

    this.processValue.values = values;
    this.processValue.properties = properties;
    if (!this.isAsync) return this.runValues();
    this.asyncFuncList = [];
    this.operand.addToAsyncList(this.asyncFuncList);
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      this.asyncFuncList[i].onAsyncReady = () => {
        this.doAsyncFunctionReady();
      };
    }
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      this.asyncFuncList[i].evaluateAsync(this.processValue);
    }
    return false;
  }
  private doAsyncFunctionReady() {
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      if (!this.asyncFuncList[i].isReady) return;
    }
    this.runValues();
  }
  private runValues(): any {
    var res = this.operand.evaluate(this.processValue);
    if(!!this.onComplete) {
      this.onComplete(res);
    }
    return res;
  }
}

export class ExpressionRunnerBase {
  private expressionExecutor: IExpresionExecutor;

  public constructor(expression: string) {
    this.expressionExecutor = ExpressionExecutor.createExpressionExecutor();
    this.expressionExecutor.onComplete = (res: any) => { this.doOnComplete(res); };
    this.expression = expression;
  }
  public get expression(): string {
    return this.expressionExecutor.expression;
  }

  public set expression(value: string) {
    this.expressionExecutor.expression = value;
  }

  public getVariables(): Array<string> {
    return this.expressionExecutor.getVariables();
  }

  public hasFunction(): boolean {
    return this.expressionExecutor.hasFunction();
  }
  public get isAsync(): boolean {
    return this.expressionExecutor.isAsync;
  }

  public canRun(): boolean {
    return this.expressionExecutor.canRun();
  }
  protected runCore(
    values: HashTable<any>,
    properties: HashTable<any> = null
  ): any {
    return this.expressionExecutor.run(values, properties);
  }
  protected doOnComplete(res: any): void {}
}

export class ConditionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: boolean) => void;
  public run(
    values: HashTable<any>,
    properties: HashTable<any> = null
  ): boolean {
    return this.runCore(values, properties) == true;
  }
  protected doOnComplete(res: any): void {
    if (!!this.onRunComplete) this.onRunComplete(res == true);
  }
}

export class ExpressionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: any) => void;
  public run(values: HashTable<any>, properties: HashTable<any> = null): any {
    return this.runCore(values, properties);
  }
  protected doOnComplete(res: any): void {
    if (!!this.onRunComplete) this.onRunComplete(res);
  }
}
