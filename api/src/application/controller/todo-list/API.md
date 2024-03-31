# Api: `/api/todo-list`
Todo list controller API implmentation.
## Endpoints
### Todo list

<details>
  <summary> 
    <code>POST</code> <code>/api/todo-list</code> <code><b>Create new todo list</b></code> 
  </summary>

##### Body schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | title           |  string   |  required | Todo list title.                             |
> | description     |  string   |  optional | Todo list description.                       |
###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Documentation dev test",
    "description": "Documentation description"
}'
```
###### Response
```json
{
    "todoList": {
        "createdAt": "2024-03-29T14:13:36.874Z",
        "updatedAt": "2024-03-29T14:44:45.861Z",
        "title": "Documentation dev test",
        "description": "Documentation description",
        "_id": "6606d3dda6fe938b7a64f9cf",
        "items": [],
        "__v": 0,
        "id": "6606d3dda6fe938b7a64f9cf"
    }
}
```
  </details>
</details>

----------------------------

<details>
  <summary> 
    <code>PATCH</code> <code>/api/todo-list/${ID}</code> <code><b>Update todo list</b></code> 
  </summary>

##### Body schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | title           |  string   |  optional | Todo list title.                             |
> | description     |  string   |  optional | Todo list description.                       |
###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Documentation dev test",
    "description": "Documentation description"
}'
```
###### Response
```json
{
    "todoList": {
        "id": "6606d3dda6fe938b7a64f9cf"
    },
    "updated": true
}
```
  </details>
</details>

----------------------------

<details>
  <summary> 
    <code>GET</code> <code>/api/todo-list</code> <code><b>Get many lists</b></code> 
  </summary>

###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list'
```
###### Response
```json
{
  "todoLists": [
    {
      "_id": "6606d3dda6fe938b7a64f9cf",
      "createdAt": "2024-03-29T14:13:36.874Z",
      "updatedAt": "2024-03-29T14:44:45.861Z",
      "title": "Updated postman dev test",
      "description": "Updated Documentation description",
      "items": [],
      "__v": 0,
      "id": "6606d3dda6fe938b7a64f9cf"
    }
  ]
}
```
  </details>
</details>

----------------------------

<details>
  <summary> 
    <code>GET</code> <code>/api/todo-list/${ID}</code> <code><b>Get list by id</b></code> 
  </summary>

##### Parameters schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | id              |  string   |  required | Todo list id                             |
###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list/6606d3dda6fe938b7a64f9cf'
```
###### Response
```json
{
    "todoList": {
        "_id": "6606d3dda6fe938b7a64f9cf",
        "createdAt": "2024-03-29T14:13:36.874Z",
        "updatedAt": "2024-03-29T14:44:45.861Z",
        "title": "Updated postman dev test",
        "description": "Updated Documentation description",
        "items": [],
        "__v": 0,
        "id": "6606d3dda6fe938b7a64f9cf"
    }
}
```
  </details>
</details>

--------------------------

### Todo list items

<details>
  <summary> 
    <code>POST</code> <code>/api/todo-list/${ID}/item-batch</code> <code><b>Batch create todo items</b></code>
  </summary>

##### Parameters schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | id              |  string   |  required | Todo list id                             |
###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list/6606d3dda6fe938b7a64f9cf/item-batch' \
--header 'Content-Type: application/json' \
--data '{
    "items": [
        { "description": "Documentation item description 1" },
        { "description": "Documentation item description 2" },
        { "description": "Documentation item description 3" }
    ]
}'
```
###### Response
```json
{
    "todoList": {
        "id": "6606d3dda6fe938b7a64f9cf",
        "items": [
            {
                "_id": "6606e835d297535f905cf746",
                "description": "Documentation item description 1",
                "id": "6606e835d297535f905cf746"
            },
            {
                "_id": "6606e835d297535f905cf747",
                "description": "Documentation item description 2",
                "id": "6606e835d297535f905cf747"
            },
            {
                "_id": "6606e835d297535f905cf748",
                "description": "Documentation item description 3",
                "id": "6606e835d297535f905cf748"
            }
        ]
    }
}
```
  </details>
</details>

--------------------------

<details>
  <summary> 
    <code>PATCH</code> <code>/api/todo-list/${ID}/item-batch/status</code> <code><b>Batch update todo items status</b></code>
  </summary>

##### Parameters schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | id              |  string   |  required | Todo list id                             |
###### Example cURL
```sh
curl --location --request PATCH 'localhost:3000/api/todo-list/6606d3dda6fe938b7a64f9cf/item-batch/status' \
--header 'Content-Type: application/json' \
--data '{
    "items": [
        { "id": "6606e835d297535f905cf746" },
        { "id": "6606e835d297535f905cf747" }
    ],
    "status": "complete"
}'
```
###### Response
```json
{
    "todoList": {
        "id": "6606d3dda6fe938b7a64f9cf",
        "itemIds": [
            "6606e835d297535f905cf746",
            "6606e835d297535f905cf747"
        ]
    },
    "updated": true
}
```
  </details>
</details>

--------------------------

<details>
  <summary> 
    <code>GET</code> <code>/api/todo-list/${ID}/item/count</code> <code><b>Get todo list count of pending and complete items</b></code>
  </summary>

##### Parameters schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | id              |  string   |  required | Todo list id                             |
###### Example cURL
```sh
curl --location 'localhost:3000/api/todo-list/6606d3dda6fe938b7a64f9cf/item/count'
```
###### Response
```json
{
    "count": {
        "complete": 2,
        "pending": 1
    }
}
```
  </details>
</details>

--------------------------

<details>
  <summary> 
    <code>DELETE</code> <code>/api/todo-list/${ID}/item-batch</code> <code><b>Batch delete todo items</b></code>
  </summary>

##### Parameters schema
> | Name            |  Type     |  Nullable |  Description                                       |
> |-----------------|-----------|-----------|----------------------------------------------------|
> | id              |  string   |  required | Todo list id                             |
###### Example cURL
```sh
curl --location --request DELETE 'localhost:3000/api/todo-list/6606d3dda6fe938b7a64f9cf/item-batch' \
--header 'Content-Type: application/json' \
--data '{
    "items": [
        { "id": "6606e835d297535f905cf746" }
    ]
}'
```
###### Response
```json
{
    "todoList": {
        "id": "6606d3dda6fe938b7a64f9cf",
        "itemIds": [
            "6606e835d297535f905cf746"
        ]
    },
    "deleted": true
}
```
  </details>
</details>
