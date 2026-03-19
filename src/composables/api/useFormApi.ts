import { cloneDeep } from "lodash-es"
import { FetchError, ofetch } from "ofetch"
import { computed, ref } from "vue"

import type { RequestStatus } from "@/types"

const HTTP_STATUS_BAD_REQUEST = 400

function useFormApi<Form>(parameters: {
  blankForm?: Form
  method?: "patch" | "post"
  url: string
}) {
  type FormKeys = keyof Form
  type FormErrors = Partial<
    Record<"non_field_errors" | FormKeys, string[] | undefined>
  >

  const form = ref<Form>(
    parameters.blankForm ? cloneDeep(parameters.blankForm) : ({} as Form),
  )
  const sendFormStatus = ref<RequestStatus>("idle")
  const sendFormRequestErrors = ref()
  const formErrors = ref<FormErrors>()

  const showForm = computed(() => {
    if (sendFormStatus.value === "pending") return false
    if (sendFormStatus.value === "error" && formErrors.value === undefined)
      return false
    return true
  })

  function clearFormErrorsForKey(formErrorsKey: keyof FormErrors) {
    if (formErrors.value?.[formErrorsKey])
      formErrors.value[formErrorsKey] = undefined
  }

  async function sendForm(fetchParameters?: {
    form: Form | {}
    id?: string
    onResponse?: () => void
  }) {
    try {
      sendFormStatus.value = "pending"
      sendFormRequestErrors.value = undefined
      formErrors.value = undefined

      const url = fetchParameters?.id
        ? `${parameters.url}/${fetchParameters.id}/`
        : parameters.url
      const fetchForm = ofetch.create({
        body: fetchParameters?.form || form.value,
        method: parameters.method || "patch",
        onResponse() {
          if (fetchParameters?.onResponse) fetchParameters.onResponse()
          sendFormStatus.value = "success"
        },
        async onResponseError({ response }) {
          if (response.status === 400) {
            formErrors.value = response._data
          }
          sendFormRequestErrors.value = `Fetch data error`
          sendFormStatus.value = "error"
        },
      })
      await fetchForm(url)
    } catch {}
  }

  function reset() {
    form.value = parameters.blankForm
      ? cloneDeep(parameters.blankForm)
      : ({} as Form)
    sendFormStatus.value = "idle"
    sendFormRequestErrors.value = undefined
    formErrors.value = undefined
  }

  return {
    clearFormErrorsForKey,
    form,
    formErrors,
    reset,
    sendForm,
    sendFormRequestErrors,
    sendFormStatus,
    showForm,
  }
}

export { useFormApi }
