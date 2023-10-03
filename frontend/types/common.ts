export enum ButtonColor {
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  RED = 'red',
  GRAY = 'gray',
}

export enum FormMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum ViewMode {
  EDIT = 'edit',
  VIEW = 'view',
}

export interface Action {
  icon: string;
  func: Function;
}
