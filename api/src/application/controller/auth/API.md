# Api `/auth`

<details>
  <summary> 
    <code>POST</code> <code>/auth/register</code> <code><b>Create user login</b></code> 
  </summary>

##### Body schema
> | Name            |  Type      |  Nullable         |  Description            |
> |-----------------|------------|-------------------|-------------------------|
> | email           |  string    |  required(unique) | Valid email.            |
> | password        |  string    |  required         | Login password          |
> | firstName       |  string    |  required         | First name              |
> | lastName        |  string    |  required         | Last name               |
> | bithDate        | ISO string |  required         | Birth date              |
###### Example cURL
```sh
curl --location 'localhost:3000/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test.user0@example.com",
    "password": "test-password",
    "firstName": "Dev",
    "lastName": "Test",
    "birthDate": "2000-01-01T02:00:00.000Z"
}'
```
###### Response
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOiIyMDI0LTAzLTI5VDE5OjU2OjIzLjcxN1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTAzLTI5VDE5OjU2OjM5LjY5OVoiLCJlbWFpbCI6InRlc3QudXNlcjBAZXhhbXBsZS5jb20iLCJwZXJzb24iOnsiZmlyc3ROYW1lIjoiRGV2IiwibGFzdE5hbWUiOiJUZXN0IiwiYmlydGhEYXRlIjoiMjAwMC0wMS0wMVQwMjowMDowMC4wMDBaIiwiY3JlYXRlZEF0IjoiMjAyNC0wMy0yOVQxOTo1NjoyMy43MTdaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0yOVQxOTo1NjoyMy43MTdaIn0sIl9pZCI6IjY2MDcxY2Y3NWViYzE2NTFmZTIyYjhiNSIsIl9fdiI6MCwiaWQiOiI2NjA3MWNmNzVlYmMxNjUxZmUyMmI4YjUiLCJpYXQiOjE3MTE3NDIxOTksImV4cCI6MTcxMTgyODU5OX0.l5d81ODBxRVAq9iIP1lLktH9ViYVX3xHTxZ1gJxiMW4",
    "user": {
        "createdAt": "2024-03-29T19:56:23.717Z",
        "updatedAt": "2024-03-29T19:56:39.699Z",
        "email": "test.user0@example.com",
        "person": {
            "firstName": "Dev",
            "lastName": "Test",
            "birthDate": "2000-01-01T02:00:00.000Z",
            "createdAt": "2024-03-29T19:56:23.717Z",
            "updatedAt": "2024-03-29T19:56:23.717Z"
        },
        "_id": "66071cf75ebc1651fe22b8b5",
        "__v": 0,
        "id": "66071cf75ebc1651fe22b8b5"
    }
}
```
  </details>
</details>

----------------------------

<details>
  <summary> 
    <code>POST</code> <code>/auth/login</code> <code><b>Create user login</b></code> 
  </summary>

##### Body schema.
> | Name            |  Type      |  Nullable |  Description                    |
> |-----------------|------------|-----------|---------------------------------|
> | email           |  string    |  required | Valid email.                    |
> | password        |  string    |  required | Login password                  |
###### Example cURL
```sh
curl --location 'localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test.user0@example.com",
    "password": "test-password"
}'
```
###### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjA3MWNmNzVlYmMxNjUxZmUyMmI4YjUiLCJlbWFpbCI6InRlc3QudXNlcjBAZXhhbXBsZS5jb20iLCJwZXJzb24iOnsiZmlyc3ROYW1lIjoiRGV2IiwibGFzdE5hbWUiOiJUZXN0In0sIl9fdiI6MCwiaWQiOiI2NjA3MWNmNzVlYmMxNjUxZmUyMmI4YjUiLCJpYXQiOjE3MTE3NDI1MTMsImV4cCI6MTcxMTgyODkxM30.I2_QnnT4p9cyEzW80isc87Dk_D-0HXgMp8Dr9HTVT8k"
}
```
  </details>
</details>

----------------------------

<details>
  <summary> 
    <code>GET</code> <code>/auth/token</code> <code><b>Get user token data</b></code> 
  </summary>

##### Header schema.
> | Header           |  Type             |  Nullable |  Description            |
> |------------------|-------------------|-----------|-------------------------|
> | Authorization    | `Bearer ${token}` |  required | Login token header.     |
###### Example cURL
```sh
curl --location 'localhost:3000/auth/token' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjA3MWNmNzVlYmMxNjUxZmUyMmI4YjUiLCJlbWFpbCI6InRlc3QudXNlcjBAZXhhbXBsZS5jb20iLCJwZXJzb24iOnsiZmlyc3ROYW1lIjoiRGV2IiwibGFzdE5hbWUiOiJUZXN0In0sIl9fdiI6MCwiaWQiOiI2NjA3MWNmNzVlYmMxNjUxZmUyMmI4YjUiLCJpYXQiOjE3MTE3NDI1MTMsImV4cCI6MTcxMTgyODkxM30.I2_QnnT4p9cyEzW80isc87Dk_D-0HXgMp8Dr9HTVT8k'
```
###### Response
```json
{
    "user": {
        "_id": "66071cf75ebc1651fe22b8b5",
        "email": "test.user0@example.com",
        "person": {
            "firstName": "Dev",
            "lastName": "Test"
        },
        "__v": 0,
        "id": "66071cf75ebc1651fe22b8b5",
        "iat": 1711742513,
        "exp": 1711828913
    }
}
```
  </details>
</details>
