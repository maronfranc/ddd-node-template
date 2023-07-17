export const openApi = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "DDD node template",
    "description": "Sample DDD structure",
    "termsOfService": "http://localhost:4001/terms/",
    "contact": {
      "name": "Máron França",
      "email": "maron.franca@gmail.com"
    },
    "license": {
      "name": "MIT License",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "servers": [
    {
      "url": "http://localhost:4001/",
      "description": "Local server"
    }
  ],
  "security": [{ "bearerAuth": ["token"] }],
  "paths": {
    "/auth/register": {
      "post": {
        "tags": ["Auth"],
        "description": "Register new user",
        "operationId": "register",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/RegisterUserDto" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Register user"
          },
          "400": {
            "description": "Bad Request example",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DomainException" },
                "example": {
                  "detail": "Email or password are incorrect",
                  "code": "auth-0001",
                  "statusName": "BAD_REQUEST",
                  "errors": [
                    {
                      "name": "email",
                      "type": "string",
                      "pattern": "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
                    },
                    {
                      "name": "password",
                      "type": "string",
                      "minLength": 6
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "description": "Internal server exception",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DomainException" },
                "example": {
                  "detail": "Internal server error",
                  "code": "internal-0001",
                  "statusName": "INTERNAL_SERVER_ERROR"
                }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      "post": {
        "tags": ["Auth"],
        "description": "User login",
        "operationId": "login",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": { "$ref": "#/components/schemas/email" },
                  "password": { "$ref": "#/components/schemas/password" }
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "New users were created",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/CreateExampleBody" }
              }
            }
          },
          "400": {
            "description": "Bad Request example",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DomainException" },
                "example": {
                  "detail": "Email or password are incorrect",
                  "code": "auth-0001",
                  "statusName": "BAD_REQUEST",
                  "errors": [
                    {
                      "name": "email",
                      "type": "string",
                      "pattern": "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
                    },
                    {
                      "name": "password",
                      "type": "string",
                      "minLength": 6
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "description": "Internal server exception",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DomainException" },
                "example": {
                  "detail": "Internal server error",
                  "code": "internal-0001",
                  "statusName": "INTERNAL_SERVER_ERROR"
                }
              }
            }
          }
        }
      }
    },
    "/auth/token": {
      "get": {
        "tags": ["Auth"],
        "description": "Get token data",
        "operationId": "token",
        "responses": {
          "200": {
            "description": "Get token data"
          },
          "400": {
            "description": "Bad Request example",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/AuthorizationException" }
              }
            }
          },
          "500": {
            "description": "Internal server exception",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DomainException" },
                "example": {
                  "detail": "Internal server error",
                  "code": "internal-0001",
                  "statusName": "INTERNAL_SERVER_ERROR"
                }
              }
            }
          }
        }
      }
    },
    "/example": {
      "get": {
        "tags": ["Example"],
        "description": "Example",
        "operationId": "example",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Example array",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Example"
                  }
                },
                "example": [
                  {
                    "_id": "614bd6484e2d74f216bf0c8a",
                    "createdAt": "2021-09-23T01:16:01.534Z",
                    "updatedAt": "2021-09-23T01:20:08.746Z",
                    "title": "Open api responses example"
                  }
                ]
              }
            }
          }
        }
      }
    },
    "/example/create": {
      "post": {
        "tags": ["Example"],
        "description": "Create example",
        "operationId": "create",
        "parameters": [],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateExampleBody" }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Created example",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Example" },
                "example": {
                  "title": "Open api responses example"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "id": {
        "type": "string",
        "description": "Infrastructure schema id",
        "example": "614bd7284e2d74f216bf0c8e"
      },
      "email": {
        "type": "string",
        "description": "Email with validation",
        "pattern": "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/",
        "example": "email@example.com"
      },
      "password": {
        "type": "string",
        "format": "password",
        "example": "password123"
      },
      "date": {
        "type": "string",
        "example": "2001-01-01T01:01:01.746Z"
      },
      "jwtToken": {
        "type": "string",
        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFmMjUzZTU5OTE4NDY1YThiYWJjZjciLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwicGVyc29uIjp7ImZpcnN0TmFtZSI6IkZpcnN0IiwibGFzdE5hbWUiOiJMYXN0In0sIl9fdiI6MCwiaWF0IjoxNjIyMDkxMjY3LCJleHAiOjE2MjIxNzc2Njd9.dYQLxCC4_Xj5IOWLvPmKFZfsvCC1zKTUgdOx0BHsb2M"
      },
      "User": {
        "type": "object",
        "properties": {
          "_id": {
            "$ref": "#/components/schemas/id"
          },
          "createdAt": {
            "$ref": "#/components/schemas/date"
          },
          "updatedAt": {
            "$ref": "#/components/schemas/date"
          },
          "email": {
            "$ref": "#/components/schemas/email"
          },
          "person": {
            "$ref": "#/components/schemas/Person"
          }
        }
      },
      "Person": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "birthDate": {
            "$ref": "#/components/schemas/date"
          }
        }
      },
      "RegisterUserDto": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "$ref": "#/components/schemas/email"
          },
          "password": {
            "$ref": "#/components/schemas/password"
          },
          "birthDate": {
            "$ref": "#/components/schemas/date"
          }
        }
      },
      "RegisterUseResponse": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          },
          "user": {
            "$ref": "#/components/schemas/User"
          }
        }
      },
      "Example": {
        "type": "object",
        "properties": {
          "createdAt": {
            "$ref": "#/components/schemas/date"
          },
          "updatedAt": {
            "$ref": "#/components/schemas/date"
          },
          "title": {
            "type": "string"
          }
        }
      },
      "CreateExampleBody": {
        "properties": {
          "title": {
            "type": "string",
            "example": "Create title example"
          }
        }
      },
      "DomainException": {
        "type": "object",
        "properties": {
          "detail": {
            "type": "string"
          },
          "code": {
            "type": "string"
          },
          "statusName": {
            "type": "string"
          }
        }
      },
      "AuthorizationException": {
        "type": "object",
        "properties": {
          "detail": {
            "type": "string",
            "example": "Route is protected, please provide an authorization token"
          },
          "code": {
            "type": "string",
            "example": "header-0001"
          },
          "errors": {
            "type": "array",
            "items": {
              "name": {
                "type": "string",
                "example": "authorization"
              },
              "type": {
                "type": "string"
              },
              "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFmMjUzZTU5OTE4NDY1YThiYWJjZjciLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwicGVyc29uIjp7ImZpcnN0TmFtZSI6IkZpcnN0IiwibGFzdE5hbWUiOiJMYXN0In0sIl9fdiI6MCwiaWF0IjoxNjIyMDkxMjY3LCJleHAiOjE2MjIxNzc2Njd9.dYQLxCC4_Xj5IOWLvPmKFZfsvCC1zKTUgdOx0BHsb2M"
            }
          },
          "statusName": {
            "type": "string",
            "example": "BAD_REQUEST"
          }
        }
      }
    }
  }
}