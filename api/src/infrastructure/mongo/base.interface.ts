interface IDocumentDate {
  type: DateConstructor;
  required: boolean;
  default: string;
}

export interface IBaseModel {
  createdAt: IDocumentDate;
  updatedAt: IDocumentDate;
}
