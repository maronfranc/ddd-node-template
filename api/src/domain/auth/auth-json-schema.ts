import { REGEX_EMAIL } from "../library/common/regex";

export const authJsonSchema = {
  email: {
    name: 'email',
    type: 'string',
    pattern: REGEX_EMAIL.toString()
  },
  /** user password */
  password: {
    name: 'password',
    type: 'string',
    minLength: 6,
  },
  brithDate: {
    name: 'brithDate',
    type: 'Date',
  },
  firstName: {
    name: 'firstName',
    type: 'string',
  },
  lastName: {
    name: 'lastName',
    type: 'string',
  },
}