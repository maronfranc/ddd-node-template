import 'jest-extended';
import 'reflect-metadata';
import supertest from 'supertest';
import { configuration } from '../../../environment';
import infrastructure from '../../../infrastructure/Infrastructure';
import application from '../../application';
import { HttpStatus } from '../../library/http/http-status.enum';
import { AuthController } from './auth.controller';
import { IRegisterUserDto } from './dto';

describe('AuthController', () => {
  beforeAll(async () => {
    if (configuration.build?.toLowerCase() !== 'test') {
      throw new Error(`Attempted to test in a forbidden environment: ${configuration.build}`)
    }
    await infrastructure.init();
    await application.init();

    (application as any).Controllers = [AuthController];
    if (!application.testApp) {
      throw new Error("Undefined `application.testApp`");
    }
  });
  afterAll(async () => await infrastructure.close());

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
      const response = await supertest(application.testApp!)
        .post('/auth/register')
        .send(payloadCredentials);
      const body = response.body;
      expect(body.token).toBeString();
      expect(body.user).toBeObject();
      expect(body.user.id).toBeString();
      expect(body.user.person).toBeObject();
      // should not show user sensitive data
      expect(body.user.password).toBeNil();
      expect(body.user.salt).toBeNil();
      expect(body.user.person.cpf).toBeNil();
      // user saved in database should match payload
      expect(body.user.email).toBe(payloadCredentials.email);
      expect(body.user.person.firstName).toBe(payloadCredentials.firstName);
      expect(body.user.person.lastName).toBe(payloadCredentials.lastName);
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should throw exception if user email exists', async () => {
      const response = await supertest(application.testApp!)
        .post('/auth/register')
        .send(payloadCredentials);
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    describe('register user dto', () => {
      it('should throw bad request if email is invalid', async () => {
        const payloadInvalidEmail = { ...payloadCredentials };
        payloadInvalidEmail.email = 'invalid#email.com';
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidEmail);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if password is invalid', async () => {
        const payloadInvalidPassword = { ...payloadCredentials };
        payloadInvalidPassword.password = false as any;
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidPassword);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw bad request if password length is less than minLength`,
        async () => {
          const payloadInvalidPassword = { ...payloadCredentials };
          payloadInvalidPassword.password = '123' as any;
          const response = await supertest(application.testApp!)
            .post('/auth/register')
            .send(payloadInvalidPassword);
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

      it('should throw bad request if firstName is undefined', async () => {
        const payloadInvalidFirstName = { ...payloadCredentials };
        payloadInvalidFirstName.firstName = undefined as any;
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidFirstName);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if lastName is undefined', async () => {
        const payloadInvalidLastName = { ...payloadCredentials };
        payloadInvalidLastName.lastName = undefined as any;
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidLastName);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if birthDate is an invalid date', async () => {
        const payloadInvalidBirthDate = { ...payloadCredentials };
        payloadInvalidBirthDate.birthDate = new Date('Invalid date payload')
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidBirthDate);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  let loginToken: string;
  describe('login', () => {
    it('should generate a valid token', async () => {
      const response = await supertest(application.testApp!)
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
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidEmail);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if password is invalid', async () => {
        const payloadInvalidPassword = { ...payloadCredentials };
        payloadInvalidPassword.password = false as any;
        const response = await supertest(application.testApp!)
          .post('/auth/register')
          .send(payloadInvalidPassword);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw bad request if password length is less than minLength`,
        async () => {
          const payloadInvalidPassword = { ...payloadCredentials };
          payloadInvalidPassword.password = '123' as any;
          const response = await supertest(application.testApp!)
            .post('/auth/register')
            .send(payloadInvalidPassword);
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
  });

  describe('token', () => {
    it('should return expected user data', async () => {
      expect(loginToken).toBeString();
      const response = await supertest(application.testApp!)
        .get('/auth/token')
        .set({ authorization: `Bearer ${loginToken}` })
        .send();
      const body = response.body;
      expect(body.user).toBeObject();
      expect(body.user.id).toBeString();
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
