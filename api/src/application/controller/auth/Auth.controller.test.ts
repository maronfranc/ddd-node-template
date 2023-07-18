import 'jest-extended';
import 'reflect-metadata';
import supertest from 'supertest';
import { INVALID_DATE } from '../../../domain/library/common/constants';
import { Application } from '../../Application';
import { HttpStatus } from '../../library/http/http-status.enum';
import { AuthController } from './Auth.controller';
import { IRegisterUserDto } from './dto';
import { Infrastructure } from '../../../infrastructure/Infrastructure';
import { configuration } from '../../../environment';

describe('AuthController', () => {
  beforeAll(async () => {
    if (configuration.build?.toLowerCase() !== 'test') {
      throw new Error(`Attempted to test in a forbidden environment: ${configuration.build}`)
    }
    await Infrastructure.init();

    (Application as any).Controllers = [AuthController];
    Application.init();
  });

  const payloadLogin = {
    email: `test.user${Math.random()}@example.com`,
    password: 'test-password',
  }
  const payloadCredentials: IRegisterUserDto = {
    ...payloadLogin,
    firstName: 'Dev',
    lastName: 'Test',
    birthDate: new Date('2000/01/01').toISOString() as any,
  }

  describe('register', () => {
    it('should register user with expected data', async () => {
      const response = await supertest(Application.app)
        .post('/auth/register')
        .send(payloadCredentials);
      const body = response.body;
      expect(body.token).toBeString();
      expect(body.user).toBeObject();
      expect(body.user._id).toBeString();
      expect(body.user.person).toBeObject();
      // saved birthDate value should be typeof Date 
      expect(new Date(body.user.person.birthDate).toString()).not.toBe(INVALID_DATE);
      // should not show user sensitive data
      expect(body.user.password).toBeNil();
      expect(body.user.salt).toBeNil();
      expect(body.user.person.cpf).toBeNil();
      // user saved in database should match payload
      expect(body.user.email).toBe(payloadCredentials.email);
      expect(body.user.person.firstName).toBe(payloadCredentials.firstName);
      expect(body.user.person.lastName).toBe(payloadCredentials.lastName);
      expect(body.user.person.birthDate).toBe(payloadCredentials.birthDate);
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should throw exception if user email exists', async () => {
      const response = await supertest(Application.app)
        .post('/auth/register')
        .send(payloadCredentials);
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    describe('register user dto', () => {
      it('should throw bad request if email is invalid', async () => {
        const payloadInvalidEmail = { ...payloadCredentials };
        payloadInvalidEmail.email = 'invalid#email.com';
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidEmail);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if password is invalid', async () => {
        const payloadInvalidPassword = { ...payloadCredentials };
        payloadInvalidPassword.password = false as any;
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidPassword);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw bad request if password length is less than minLength`,
        async () => {
          const payloadInvalidPassword = { ...payloadCredentials };
          payloadInvalidPassword.password = '123' as any;
          const response = await supertest(Application.app)
            .post('/auth/register')
            .send(payloadInvalidPassword);
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

      it('should throw bad request if firstName is undefined', async () => {
        const payloadInvalidFirstName = { ...payloadCredentials };
        payloadInvalidFirstName.firstName = undefined as any;
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidFirstName);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if lastName is undefined', async () => {
        const payloadInvalidLastName = { ...payloadCredentials };
        payloadInvalidLastName.lastName = undefined as any;
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidLastName);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if birthDate is an invalid date', async () => {
        const payloadInvalidBirthDate = { ...payloadCredentials };
        payloadInvalidBirthDate.birthDate = new Date('Invalid date payload')
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidBirthDate);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  let loginToken: string;
  describe('login', () => {
    it('should generate a valid token', async () => {
      const response = await supertest(Application.app)
        .post('/auth/login')
        .send(payloadLogin);
      const body = response.body;
      expect(body.token).toBeString();
      loginToken = body.token;
      expect(response.status).toBe(HttpStatus.OK);
    });

    describe('login dto', () => {
      it('should throw bad request if email is invalid', async () => {
        const payloadInvalidEmail = { ...payloadCredentials };
        payloadInvalidEmail.email = 'invalid#email.com';
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidEmail);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if password is invalid', async () => {
        const payloadInvalidPassword = { ...payloadCredentials };
        payloadInvalidPassword.password = false as any;
        const response = await supertest(Application.app)
          .post('/auth/register')
          .send(payloadInvalidPassword);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw bad request if password length is less than minLength`,
        async () => {
          const payloadInvalidPassword = { ...payloadCredentials };
          payloadInvalidPassword.password = '123' as any;
          const response = await supertest(Application.app)
            .post('/auth/register')
            .send(payloadInvalidPassword);
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
  });

  describe('token', () => {
    it('should return expected user data', async () => {
      expect(loginToken).toBeString();
      const response = await supertest(Application.app)
        .get('/auth/token')
        .set({ authorization: `Bearer ${loginToken}` })
        .send();
      const body = response.body;
      expect(body.user).toBeObject();
      expect(body.user._id).toBeString();
      expect(body.user.person).toBeObject();
      // should not show user sensitive data
      expect(body.user.password).toBeNil();
      expect(body.user.salt).toBeNil();
      expect(body.user.person.cpf).toBeNil();
      // user saved in database should match payload
      expect(body.user.email).toBe(payloadCredentials.email);
      expect(body.user.person.firstName).toBe(payloadCredentials.firstName);
      expect(body.user.person.lastName).toBe(payloadCredentials.lastName);
      // birthDate should not be in token data
      expect(body.user.person.birthDate).toBeNil();
      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
