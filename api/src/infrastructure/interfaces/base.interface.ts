export interface SchemaDefinitionValues {
  type: any;
  required?: boolean;
  /** @default true */
  select?: boolean;
  default?: any;
  lowercase?: boolean;
  ref?: string;
}

export type SchemaDefinition<TKeys extends string = string> = Record<TKeys, SchemaDefinitionValues>;

export interface IBaseModel {
  id: string;
  createdAt: SchemaDefinitionValues;
  updatedAt: SchemaDefinitionValues;
}
