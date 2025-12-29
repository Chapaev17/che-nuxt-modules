import schemaJson from "../../../src/data/api_schema.json"
import { OpenAPIV3 } from "openapi-types"
import { ref, computed, watch } from "vue"
import { ofetch } from "ofetch"
import { defineStore } from "pinia"

interface MySecurityRequirement {
  cookieAuth?: string[]
  basicAuth?: string[]
}
type MyOpenAPIDocument = Omit<OpenAPIV3.Document, "security"> & {
  security?: MySecurityRequirement[]
}
const apiSchema: MyOpenAPIDocument = schemaJson as any

interface ApiEndpoint {
  path: string
  cleanPath: string
  getOperation?: OpenAPIV3.OperationObject
  postOperation?: OpenAPIV3.OperationObject
  listResponseSchema?: string
  createRequestSchema?: string
}

// Type guard to check if response is a ResponseObject (not ReferenceObject)
function isResponseObject(
  response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject,
): response is OpenAPIV3.ResponseObject {
  return "content" in response
}

// Type guard to check if request body is a RequestBodyObject (not ReferenceObject)
function isRequestBodyObject(
  requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
): requestBody is OpenAPIV3.RequestBodyObject {
  return "content" in requestBody
}

function extractAllEndpoints(schema: MyOpenAPIDocument): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = []

  if (!schema.paths) return endpoints

  for (const [path, pathItem] of Object.entries(schema.paths)) {
    if (!pathItem) continue

    // Remove namespace (e.g., /api/v1/)
    const cleanPath = path.replace(/^\/api\/v\d+\//, "/")

    const endpoint: ApiEndpoint = {
      path,
      cleanPath,
    }

    // Check for GET operation (list)
    if (pathItem.get) {
      endpoint.getOperation = pathItem.get

      // Extract list response schema
      const getResponse = pathItem.get.responses?.["200"]
      if (getResponse && isResponseObject(getResponse)) {
        const getContent = getResponse.content?.["application/json"]
        if (getContent?.schema) {
          if ("$ref" in getContent.schema) {
            endpoint.listResponseSchema = getContent.schema.$ref
          } else if (
            "items" in getContent.schema &&
            getContent.schema.items &&
            "$ref" in getContent.schema.items
          ) {
            endpoint.listResponseSchema = getContent.schema.items.$ref
          }
        }
      }
    }

    // Check for POST operation (create)
    if (pathItem.post) {
      endpoint.postOperation = pathItem.post

      // Extract create request schema
      const postRequestBody = pathItem.post.requestBody
      if (postRequestBody && isRequestBodyObject(postRequestBody)) {
        const postContent = postRequestBody.content?.["application/json"]
        if (postContent?.schema && "$ref" in postContent.schema) {
          endpoint.createRequestSchema = postContent.schema.$ref
        }
      }
    }

    endpoints.push(endpoint)
  }

  return endpoints
}

function groupEndpointsByCleanPath(
  endpoints: ApiEndpoint[],
): Map<string, ApiEndpoint> {
  const grouped = new Map<string, ApiEndpoint>()

  for (const endpoint of endpoints) {
    const existing = grouped.get(endpoint.cleanPath)

    if (existing) {
      // Merge operations
      if (endpoint.getOperation && !existing.getOperation) {
        existing.getOperation = endpoint.getOperation
        existing.listResponseSchema = endpoint.listResponseSchema
      }
      if (endpoint.postOperation && !existing.postOperation) {
        existing.postOperation = endpoint.postOperation
        existing.createRequestSchema = endpoint.createRequestSchema
      }
    } else {
      grouped.set(endpoint.cleanPath, { ...endpoint })
    }
  }

  return grouped
}

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const schema = ref(apiSchema)
  const activeEndpoint = ref<ApiEndpoint>()
  const activeList = ref()

  const showListModal = computed(() => activeEndpoint.value !== undefined)

  const apiEndpoints = computed(() => {
    if (!schema.value.paths) return []

    const endpoints = extractAllEndpoints(schema.value)
    const grouped = groupEndpointsByCleanPath(endpoints)

    // Filter to include endpoints that have GET operation (POST is optional)
    return Array.from(grouped.values()).filter(
      (endpoint) => endpoint.getOperation,
    )
  })

  watch(activeEndpoint, async () => {
    if (activeEndpoint.value?.path) {
      activeList.value = await ofetch(
        `https://api.tula-term.ru${activeEndpoint.value.path}`,
      )
    }
  })

  return {
    schema,
    apiEndpoints,
    showListModal,
    activeEndpoint,
    activeList,
  }
})
