export interface NgLink {
  readonly id: string;
  readonly type: NgLinkType;
  readonly start: NgLinkEndpoint;
  readonly end: NgLinkEndpoint;
  readonly style?: NgLinkStyle;
}

export interface NgLinkEndpoint {
  readonly x: number;
  readonly y: number;
}

export interface NgLinkStyle {
  readonly width?: number;
  readonly color?: string;
  readonly dashed?: boolean;
}

export enum NgLinkType {
  SS = 'S-S',
  SE = 'S-E',
  ES = 'E-S',
  EE = 'E-E'
}
