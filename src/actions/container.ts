import { propertyArray } from "../jsonobject";
import { Base } from "../base";
import { IAction, Action } from "./action";

export let defaultActionBarCss = {
  root: "sv-action-bar",
  defaultSizeMode: "sv-action-bar--default-size-mode",
  smallSizeMode: "sv-action-bar--small-size-mode",
  item: "sv-action-bar-item",
  itemActive: "sv-action-bar-item--active",
  itemPressed: "sv-action-bar-item--pressed",
  itemIcon: "sv-action-bar-item__icon",
  itemTitle: "sv-action-bar-item__title",
  itemTitleWithIcon: "sv-action-bar-item__title--with-icon",
};

export class ActionContainer<T extends Action = Action> extends Base {
  @propertyArray({
    onSet: (_: any, target: ActionContainer<Action>) => {
      target.onSet();
    },
    onPush: (item: any, i: number, target: ActionContainer<Action>) => {
      target.onPush(item);
    },
    onRemove: (item: any, i: number, target: ActionContainer<Action>) => {
      target.onRemove(item);
    }
  })
  actions: Array<T>;
  private cssClassesValue: any;

  protected getRenderedActions(): Array<T> {
    return this.actions;
  }

  public updateCallback: (isResetInitialized: boolean) => void;
  public containerCss: string;
  public sizeMode: "default" | "small" = "default";

  protected raiseUpdate(isResetInitialized: boolean) {
    this.updateCallback && this.updateCallback(isResetInitialized);
  }

  protected onSet() {
    this.actions.forEach((item) => { this.setActionCssClasses(item); });
    this.raiseUpdate(true);
  }
  protected onPush(item: T) {
    this.setActionCssClasses(item);
    this.raiseUpdate(true);
  }

  protected onRemove(item: T) {
    this.raiseUpdate(true);
  }

  private setActionCssClasses(item: T) {
    item.cssClasses = this.cssClasses;
  }

  public get hasActions(): boolean {
    return (this.actions || []).length > 0;
  }

  public get renderedActions(): Array<T> {
    return this.getRenderedActions();
  }

  get visibleActions(): Array<T> {
    return this.actions.filter((action) => action.visible !== false);
  }
  public getRootCss(): string {
    const sizeModeClass = this.sizeMode === "small" ? this.cssClasses.smallSizeMode : this.cssClasses.defaultSizeMode;
    return this.cssClasses.root + (!!sizeModeClass ? " " + sizeModeClass : "") + (!!this.containerCss ? " " + this.containerCss : "");
  }
  public set cssClasses(val: any) {
    this.cssClassesValue = val;
    this.actions.forEach((action: T) => {
      this.setActionCssClasses(action);
    });
  }
  public get cssClasses(): any {
    return this.cssClassesValue || defaultActionBarCss;
  }
  private createAction(item: IAction) {
    return item instanceof Action ? item : new Action(item);
  }
  public addAction(val: IAction, sortByVisibleIndex = true): Action {
    const res: Action = this.createAction(val);
    this.actions.push(<T>res);
    this.sortItems();
    return res;
  }
  private sortItems(): void {
    this.actions = []
      .concat(this.actions.filter((item) => item.visibleIndex === undefined || item.visibleIndex >= 0))
      .sort((firstItem, secondItem) => {
        return firstItem.visibleIndex - secondItem.visibleIndex;
      });
  }

  public setItems(items: Array<IAction>, sortByVisibleIndex = true): void {
    this.actions = <any>items.map((item) => this.createAction(item));
    if (sortByVisibleIndex) {
      this.sortItems();
    }
  }
  public initResponsivityManager(container: HTMLDivElement): void {
    return;
  }
  public resetResponsivityManager(): void { }
  public getActionById(id: string): T {
    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i].id === id) return this.actions[i];
    }
    return null;
  }
}
