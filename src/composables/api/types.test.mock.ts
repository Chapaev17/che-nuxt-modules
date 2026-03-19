/**
 * Mock data and constants for type testing
 * Contains HTTP status code constants and MockPaths interface for testing type utilities
 */

// HTTP status code constants to avoid magic numbers
const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204

// Mock paths type for testing
interface MockPaths {
  "/api/v1/test/": {
    get: {
      parameters: {
        query?: {
          ordering?: string
          page?: number
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
          "multipart/form-data": {
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
              id: number
              name: string
            }
          }
        }
      }
    }
  }
  [path: `/api/v1/test/${number}/`]: {
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
              details: string
              id: number
              name: string
            }
          }
        }
      }
    }
    patch: {
      requestBody: {
        content: {
          "multipart/form-data": {
            details?: string
            name?: string
          }
        }
      }
      responses: {
        [HTTP_OK]: {
          content: {
            "application/json": {
              details: string
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

export type { HTTP_CREATED, HTTP_NO_CONTENT, HTTP_OK, MockPaths }
