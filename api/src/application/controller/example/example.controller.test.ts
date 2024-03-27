import 'jest-extended';
import 'reflect-metadata';
import supertest from "supertest";
import { configuration } from "../../../environment";
import infrastructure from "../../../infrastructure/Infrastructure";
import application from "../../application";
import { ExampleController } from "./example.controller";

describe(ExampleController.name, () => {
  beforeAll(async () => {
    if (configuration.build?.toLowerCase() !== 'test') {
      throw new Error(`Attempted to test in a forbidden environment: ${configuration.build}`)
    }
    await infrastructure.init();
    application.init();
    (application as any).Controllers = [ExampleController];
  });

  let testId: string;
  const examplePayload = { title: `Dev test: [${Math.random()}]` };
  describe('POST /example/create', () => {
    it('should create a new example', async () => {
      const response = await supertest(application.app)
        .post('/example/create')
        .send(examplePayload);
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.id).toBeString();
      testId = body.id;
    });
  });

  describe('GET /example/:id', () => {
    it('should return created example', async () => {
      const response = await supertest(application.app).get(`/example/${testId}`);
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.id).not.toBeNil();
      expect(body.id).toBe(testId);
    });
  });

  describe('GET /examples', () => {
    it('should return a list of created examples', async () => {
      const response = await supertest(application.app).get(`/example`);
      const body = response.body;
      expect(body).toBeDefined();
    });
  });
});
