type RequestStatus = "error" | "idle" | "pending" | "success"

interface FormErrors {
  [key: string]: string[] | undefined
  non_field_errors?: string[]
}

export type { FormErrors, RequestStatus }
