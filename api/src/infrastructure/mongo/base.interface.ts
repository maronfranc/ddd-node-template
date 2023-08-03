export interface SchemaDefinitionValues {
  type: any;
  required?: boolean;
  /** @default true */
  select?: boolean;
  default?: any;
  lowercase?: boolean;
  ref?: string;
}

export interface IBaseModel {
  createdAt: SchemaDefinitionValues;
  updatedAt: SchemaDefinitionValues;
}
