import 'jest-extended';
import 'reflect-metadata';
import supertest from "supertest";
import { configuration } from "../../../environment";
import infrastructure from "../../../infrastructure/Infrastructure";
import application from "../../application";
import { TodoListController } from './todo-list.controller';
import { ITodoList } from '../../../infrastructure/entity-interfaces/todo-list.interface';
import { HttpStatus } from '../../library/http/http-status.enum';
import { ITodoItem } from '../../../infrastructure/entity-interfaces/todo-item.interface';
import { TODO_ITEM_STATUS } from '../../../infrastructure/mongo/todo-list/todo-item/todo-item.schema';
import { isFilledArrayKey } from '../../library/utils/type-validator';

describe(TodoListController.name, () => {
  beforeAll(async () => {
    if (configuration.build?.toLowerCase() !== 'test') {
      throw new Error(`Attempted to test in a forbidden environment: ${configuration.build}`)
    }
    await infrastructure.init();
    application.init();
    (application as any).Controllers = [TodoListController];
  });

  function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  function mockTodoList(): ITodoList {
    const rng = `${Math.random()}`;
    return {
      title: `Dev test: [${rng}]`,
      description: `Dev test todo list description ${rng}`,
    }
  }
  function mockTodoItem(): ITodoItem {
    const rng = `${Math.random()}`;
    return {
      description: `Dev test todo item description ${rng}`,
      status: 'pending',
    }
  }

  let testTodoListId: string;
  describe("Common CRUD flow", () => {
    const todoListPayload = mockTodoList();
    describe('POST /todo-list', () => {
      it('should create a new todo list', async () => {
        const response = await supertest(application.app)
          .post('/todo-list')
          .send(todoListPayload);
        const body = response.body;
        expect(body).toBeDefined();
        expect(body.todoList.id).toBeString();
        testTodoListId = body.todoList.id;
      });
    });

    const updatedTitle = "Dev test update todo list title"
    const updatedDescription = "Dev test update todo list description"
    describe('PATCH /todo-list', () => {
      describe("description", () => {
        it('should update todo list', async () => {
          const response = await supertest(application.app)
            .patch(`/todo-list/${testTodoListId}`)
            .send(<ITodoList>{
              title: updatedTitle,
              description: updatedDescription,
            });
          const body = response.body;
          expect(body).toBeDefined();
          expect(body.updated).toBe(true);
        });
      });
    });

    describe('GET /todo-list/:id', () => {
      it('should return updated todo list', async () => {
        const response = await supertest(application.app)
          .get(`/todo-list/${testTodoListId}`);
        const body = response.body;
        expect(body).toBeDefined();
        const todoList = body.todoList
        expect(todoList.id).not.toBeNil();
        expect(todoList.id).toBe(testTodoListId);
        expect(todoList.title).toBeString();
        expect(todoList.description).toBeString();
        expect(todoList.title).toBe(updatedTitle);
        expect(todoList.description).toBe(updatedDescription);
      });
    });

    describe('GET /todo-list', () => {
      it('should return a list of created todo-list', async () => {
        const response = await supertest(application.app).get(`/todo-list`);
        const body = response.body;
        expect(body).toBeDefined();
        expect(body.todoLists).toBeArray();
        expect(body.todoLists).not.toBeArrayOfSize(0);
      });
    });

    describe("DELETE /todo-list/:id", () => {
      it("should delete todo list", async () => {
        const response = await supertest(application.app)
          .delete(`/todo-list/${testTodoListId}`);
        const body = response.body;
        expect(body).toBeDefined();
        expect(body.deleted).toBeBoolean();
      });

      describe("subsequent request", () => {
        it("should not return deleted todo list", async () => {
          const response = await supertest(application.app)
            .get(`/todo-list/${testTodoListId}`);
          const body = response.body;
          expect(body).toBeDefined();
          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
      });
    });
  });

  /** FIXME: in some cases db is not returning _id instead of id */
  function fixTodoListIds(todo: any): Required<ITodoList> {
    if (!todo.id) todo.id = todo._id;
    if (!isFilledArrayKey(todo.items, 'id')) {
      todo.items = todo.items.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
    }
    return todo;
  }
  describe("Batch update flow", () => {
    let testListId: string;
    beforeAll(async () => {
      const todoListPayload = mockTodoList();
      const response = await supertest(application.app)
        .post('/todo-list')
        .send(todoListPayload);
      expect(response.body.todoList.id).toBeString();
      testListId = response.body.todoList.id;
    });

    let firstTestItems: ITodoItem[] = [];
    const FIRST_ITEM_PUSH = 2;
    const SECOND_ITEM_PUSH = 3;
    const TOTAL_ITEMS = FIRST_ITEM_PUSH + SECOND_ITEM_PUSH;
    const payload = {
      /** Items to be completed */
      firstItems: range(FIRST_ITEM_PUSH).map(() => mockTodoItem()),
      /** Items that will stay pending */
      secondItems: range(SECOND_ITEM_PUSH).map(() => mockTodoItem()),
    }

    describe('POST /todo-list/:id/item-batch', () => {
      describe("first items insert", () => {
        it('should add them to the list', async () => {
          const response = await supertest(application.app)
            .post(`/todo-list/${testListId}/item-batch`)
            .send(payload.firstItems);
          const body = response.body;
          expect(body).toBeDefined();
          const items = body.todoList.items as ITodoItem[];
          expect(items).toBeArrayOfSize(FIRST_ITEM_PUSH);

          firstTestItems = items;

          items.map((item) => {
            expect(item.description).toBeString();
            expect(item.status).toBeOneOf(TODO_ITEM_STATUS);
          });
        });
      });

      describe("second items insert", () => {
        it('should add them and not remove previous', async () => {
          const response = await supertest(application.app)
            .post(`/todo-list/${testListId}/item-batch`)
            .send(payload.secondItems);
          const body = response.body;
          expect(body).toBeDefined();
          const items = body.todoList.items as ITodoItem[];
          expect(items).toBeArrayOfSize(SECOND_ITEM_PUSH);

          items.forEach((item) => {
            expect(item.description).toBeString();
            expect(item.status).toBeOneOf(TODO_ITEM_STATUS);
          });
        });
      });

      describe("subsequent request", () => {
        it("should have all generated items", async () => {
          const response = await supertest(application.app)
            .get(`/todo-list/${testListId}`);
          const body = response.body;
          expect(body).toBeDefined();
          expect(body.todoList.id).toBe(testListId);

          const items = body.todoList.items as ITodoItem[];
          expect(items).toBeArray();
          expect(items).toBeArrayOfSize(TOTAL_ITEMS);
        });
      });
    });

    describe("PATCH /todo-list/:id/item-batch", () => {
      const newStatus: ITodoItem['status'] = 'complete';
      describe('update some items', () => {
        it('should update items status', async () => {
          const payload = { items: firstTestItems, status: newStatus };
          const response = await supertest(application.app)
            .patch(`/todo-list/${testListId}/item-batch`)
            .send(payload);
          const body = response.body;
          expect(body).toBeDefined();

          const todoList = body.todoList;
          expect(todoList.id).not.toBeNil();
          expect(todoList.id).toBe(testListId);
          expect(todoList.itemIds).not.toBeNil();
          expect(todoList.itemIds).not.toBeArrayOfSize(0);

          const itemIds = todoList.itemIds as ITodoItem[];
          const testIds = firstTestItems.map((item) => item.id);
          itemIds.forEach((id) => {
            expect(id).toBeOneOf(testIds);
          });
        });

        describe("subsequent request", () => {
          let mostRecentListState: ITodoList;
          /** First request items */
          const completeItems = [] as ITodoItem[];
          /** Second request items */
          const pendingItems = [] as ITodoItem[];
          beforeAll(async () => {
            const res = await supertest(application.app).get(`/todo-list/${testListId}`);
            expect(res.body.todoList).toBeDefined();
            expect(res.body.todoList.id).toBe(testListId);
            mostRecentListState = res.body.todoList;
            expect(mostRecentListState.items).toBeArray();
            const items = mostRecentListState.items!;
            completeItems.push(
              ...items.filter((item) => item.status === 'complete')
            );
            pendingItems.push(
              ...items.filter((item) => item.status === 'pending')
            );
          });

          describe("update status items", () => {
            it("should be `complete`", async () => {
              for (const item of completeItems) {
                expect(item.status).toBe('complete');
              }
            });
          });

          describe("not updated status items", () => {
            it("should be `pending`", async () => {
              for (const item of pendingItems) {
                expect(item.status).toBe('pending');
              }
            });
          });
        });
      });
    });


    describe("items change back to previous status", () => {
      let todoList: Required<ITodoList>;

      beforeAll(async () => {
        const createListPayload = mockTodoList();
        const createResponse = await supertest(application.app)
          .post('/todo-list')
          .send(createListPayload);
        expect(createResponse.body.todoList.id).toBeString();

        const createItemsResponse = await supertest(application.app)
          .post(`/todo-list/${testListId}/item-batch`)
          .send([mockTodoItem()]);
        expect(createItemsResponse.statusCode)
          .not.toBeGreaterThanOrEqual(400);

        const getResponse = await supertest(application.app)
          .get(`/todo-list/${testListId}`);
        expect(getResponse.statusCode)
          .not.toBeGreaterThanOrEqual(400);
        expect(getResponse.body.todoList).toBeDefined();
        todoList = fixTodoListIds(getResponse.body.todoList);
      });

      async function updateAndGetItems(
        id: string,
        items: Pick<ITodoItem, 'id'>[],
        status: ITodoItem['status'],
      ): Promise<Required<ITodoList>> {
        const payload = { items, status }
        const updateResponse = await supertest(application.app)
          .patch(`/todo-list/${id}/item-batch`)
          .send(payload);
        expect(updateResponse.statusCode).not.toBeGreaterThanOrEqual(400);

        const getResponse = await supertest(application.app)
          .get(`/todo-list/${id}`)
          .send(payload);
        expect(getResponse.body.todoList).toBeDefined();
        return fixTodoListIds(getResponse.body.todoList);
      }

      describe("change status back and forth", () => {
        it("should have expected status", async () => {
          async function updateStatusAndTestIt(
            id: string,
            items: Pick<ITodoItem, 'id'>[],
            status: ITodoItem['status'],
          ) {
            const updatedTodoList = await updateAndGetItems(
              id,
              items,
              status);
            for (const item of updatedTodoList.items) {
              expect(item.status).toBe(status);
            }
          }

          await updateStatusAndTestIt(todoList.id, todoList.items, 'complete');
          await updateStatusAndTestIt(todoList.id, todoList.items, 'pending');
          await updateStatusAndTestIt(todoList.id, todoList.items, 'complete');
        });
      });
    });
  });

  describe("Batch delete flow", () => {
    let testListId: string;
    let todoList: Required<ITodoList>;

    const ITEM_TOTAL_COUNT = 5;
    const ITEM_DELETE_COUNT = 3;
    const payloadItems = range(ITEM_TOTAL_COUNT).map(() => mockTodoItem());

    beforeAll(async () => {
      const createListPayload = mockTodoList();
      const createResponse = await supertest(application.app)
        .post('/todo-list')
        .send(createListPayload);
      expect(createResponse.body.todoList.id).toBeString();
      testListId = createResponse.body.todoList.id;

      const createItemsResponse = await supertest(application.app)
        .post(`/todo-list/${testListId}/item-batch`)
        .send(payloadItems);
      expect(createItemsResponse.statusCode)
        .not.toBeGreaterThanOrEqual(400);

      const getResponse = await supertest(application.app)
        .get(`/todo-list/${testListId}`);
      expect(getResponse.statusCode)
        .not.toBeGreaterThanOrEqual(400);
      expect(getResponse.body.todoList).toBeDefined();
      todoList = fixTodoListIds(getResponse.body.todoList);
    });

    describe("items", () => {
      it("should batch delete expected items", async () => {
        const deletePayloadItems = range(ITEM_DELETE_COUNT)
          .map((i) => todoList.items[i]);

        const deleteResponse = await supertest(application.app)
          .delete(`/todo-list/${testListId}/item-batch`)
          .send({ items: deletePayloadItems });
        expect(deleteResponse.statusCode).toBe(HttpStatus.OK);
        expect(deleteResponse.body.deleted).toBe(true);

        const getResponse = await supertest(application.app)
          .get(`/todo-list/${testListId}`);
        expect(getResponse.statusCode).toBe(HttpStatus.OK);
        const body = getResponse.body;
        expect(body.todoList.items)
          .toBeArrayOfSize(ITEM_TOTAL_COUNT - ITEM_DELETE_COUNT);

        const deletedItemIds = deletePayloadItems.map((it) => it.id);
        for (const item of body.todoList.items) {
          expect(item.id).not.toBeOneOf(deletedItemIds);
        }
      });
    });
  });
});
