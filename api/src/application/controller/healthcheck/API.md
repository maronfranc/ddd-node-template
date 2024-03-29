# Api `/healthcheck`

<details>
  <summary> 
    <code>GET</code> <code>/healthcheck</code> <code><b>Healthcheck</b></code>
  </summary>

###### Example cURL
```sh
curl --location 'localhost:3000/healthcheck'
```
###### Response
```json
{
    "status": "OK",
    "date": "2024-03-29T19:43:46.301Z",
    "envbuild": "dev",
    "dbconnected": "TODO"
}
```
  </details>
</details>

This healthcheck being used in [~/docker](../../../../../docker/scripts/api.heatlhcheck.js).

--------------------------

<details>
  <summary> 
    <code>GET</code> <code>/healthcheck/ping</code> <code><b>Healthcheck ping use</b></code>
  </summary>

###### Example cURL
```sh
curl --location 'localhost:3000/healthcheck/ping'
```
###### Response
```json
{
    "status": "READY"
}
```
  </details>
</details>

--------------------------

