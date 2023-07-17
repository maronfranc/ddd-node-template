import { IDomainException } from "../library/exceptions/domain.exception";
import { exampleJsonSchema } from "./example-schema";

export const exampleException = {
  'invalid-title': <IDomainException>{
    detail: 'Invalid title',
    code: 'example-0001',
    errors: [exampleJsonSchema.title],
    statusName: 'BAD_REQUEST',
  },
} as const;
