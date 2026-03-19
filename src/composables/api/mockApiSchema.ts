/**
 * Mock OpenAPI schema for testing type definitions
 * This provides a minimal schema to test the type utilities without external dependencies
 */

// HTTP status code constants
const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204

interface Paths {
  "/api/v1/mock/non-paginated/": {
    get: {
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              active: boolean
              id: number
              title: string
            }[]
          }
        }
      }
    }
  }
  "/api/v1/mock/query-only/": {
    get: {
      parameters: {
        query: {
          filter: "active" | "all" | "inactive"
          sort?: "asc" | "desc"
        }
      }
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              data: {
                id: number
                value: string
              }[]
            }
          }
        }
      }
    }
  }
  "/api/v1/mock/resource/": {
    get: {
      parameters: {
        query?: {
          ordering?: string
          page?: number
          search?: string
        }
      }
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              count: number
              next: null | string
              previous: null | string
              results: {
                created_at: string
                description?: string
                id: number
                name: string
              }[]
            }
          }
        }
      }
    }
    post: {
      requestBody: {
        content: {
          "application/json": {
            description?: string
            name: string
          }
          "multipart/form-data": {
            description?: string
            file?: File
            name: string
          }
        }
      }
      responses: {
        [HTTP_CREATED]: {
          content: {
            "application/json": {
              created_at: string
              description?: string
              id: number
              name: string
            }
          }
        }
      }
    }
  }
  [path: `/api/v1/mock/resource/${number}/`]: {
    delete: {
      responses: {
        [HTTP_NO_CONTENT]: never
      }
    }
    get: {
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              created_at: string
              description?: string
              id: number
              name: string
              updated_at: string
            }
          }
        }
      }
    }
    patch: {
      requestBody: {
        content: {
          "application/json": {
            description?: string
            name?: string
          }
          "multipart/form-data": {
            description?: string
            file?: File
            name?: string
          }
        }
      }
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              created_at: string
              description?: string
              id: number
              name: string
              updated_at: string
            }
          }
        }
      }
    }
    put: {
      requestBody: {
        content: {
          "application/json": {
            description?: string
            name: string
          }
          "multipart/form-data": {
            description?: string
            file?: File
            name: string
          }
        }
      }
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              created_at: string
              description?: string
              id: number
              name: string
              updated_at: string
            }
          }
        }
      }
    }
  }
}

interface Components {
  schemas: {
    MockData: {
      readonly id: number
      value: string
    }
    MockItem: {
      active: boolean
      readonly id: number
      title: string
    }
    MockResource: {
      readonly created_at: string
      description?: string
      readonly id: number
      name: string
      readonly updated_at: string
    }
  }
}

type operations = Record<string, never>

type webhooks = Record<string, never>

type $defs = Record<string, never>

export type { $defs, Components, operations, Paths, webhooks }
