import type { AsyncDataRequestStatus } from "#app"

export function useListApi<ListData = {}[]>(parameters: { url: string }) {
  const data = ref<ListData>()
  const fetchDataStatus = ref<AsyncDataRequestStatus>()
  const fetchDataErrors = ref()

  async function fetchData() {
    try {
      fetchDataStatus.value = "pending"
      data.value = undefined
      fetchDataErrors.value = undefined
      const response: ListData = await $fetch(`${parameters.url}/`)
      data.value = response
      fetchDataStatus.value = "success"
    } catch (catchedError) {
      const message = isString(catchedError)
        ? catchedError
        : isError(catchedError)
          ? catchedError.message
          : ""
      fetchDataErrors.value = `Fetch data error: ${message}`
    }
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}

export function useDetailApi<ResponseData = {}>(parameters?: {
  url?: string
  method?: "get" | "post"
}) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref<AsyncDataRequestStatus>()
  const fetchDataErrors = ref()

  async function fetchData(fetchParameters?: {
    id?: string
    url?: string
    onResponse?: (response: ResponseData) => void
    onResponseError?: () => void
  }) {
    fetchDataStatus.value = "pending"
    data.value = undefined
    fetchDataErrors.value = undefined

    const valideUrl = parameters?.url
      ? parameters.url
      : fetchParameters?.id && parameters?.url
        ? `${parameters.url}/${fetchParameters.id}/`
        : fetchParameters?.url || undefined
    if (valideUrl === undefined) {
      console.error("URL for fetching API details not found")
      return
    }

    $fetch(valideUrl, {
      method: parameters?.method || "get",
      onResponse({ response }) {
        data.value = response._data as ResponseData
        fetchDataStatus.value = "success"
        if (fetchParameters?.onResponse)
          fetchParameters.onResponse(response as ResponseData)
      },
      async onResponseError() {
        fetchDataErrors.value = `Fetch data error`
        fetchDataStatus.value = "error"
        if (fetchParameters?.onResponseError) fetchParameters.onResponseError()
        console.error(`Error fetch api detail for url: ${valideUrl}`)
      },
    })
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}

export function useFormApi<Form>(parameters: {
  url: string
  method?: "patch" | "post"
  blankForm?: Form
}) {
  type FormKeys = keyof Form
  type FormErrors = {
    [key in FormKeys | "non_field_errors"]?: string[] | undefined
  }
  const form = ref<Form>(
    parameters.blankForm ? useCloneDeep(parameters.blankForm) : ({} as Form),
  )
  const sendFormStatus = ref()
  const sendFormRequestErrors = ref()
  const formErrors = ref<FormErrors>()

  async function clearFormErrorsForKey(formErrorsKey: keyof FormErrors) {
    if (formErrors.value?.[formErrorsKey])
      formErrors.value[formErrorsKey] = undefined
  }

  async function sendForm(fetchParameters?: { id?: string; form: Form | {} }) {
    try {
      sendFormStatus.value = "pending"
      sendFormRequestErrors.value = undefined
      formErrors.value = undefined
      await $fetch(
        fetchParameters?.id
          ? `${parameters.url}/${fetchParameters.id}/`
          : parameters.url,
        {
          method: parameters.method || "patch",
          body: fetchParameters?.form || form.value,
          async onResponseError({ response }) {
            if (response.status === 400) {
              formErrors.value = response._data
            }
            sendFormRequestErrors.value = `Fetch data error`
            sendFormStatus.value = "error"
          },
          onResponse() {
            sendFormStatus.value = "success"
          },
        },
      )
    } catch (catchedError) {}
  }

  function reset() {
    form.value = parameters.blankForm
      ? useCloneDeep(parameters.blankForm)
      : ({} as Form)
    sendFormStatus.value = undefined
    sendFormRequestErrors.value = undefined
    formErrors.value = undefined
  }

  return {
    form,
    sendFormStatus,
    sendFormRequestErrors,
    formErrors,
    sendForm,
    clearFormErrorsForKey,
    reset,
  }
}
