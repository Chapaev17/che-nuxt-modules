import type { AsyncDataRequestStatus } from "#app"

function useFormApi<Form>(parameters: {
  url: string
  method?: "patch" | "post"
  blankForm?: Form
}) {
  type FormKeys = keyof Form
  type FormErrors = {
    [key in FormKeys | "non_field_errors"]?: string[] | undefined
  }

  const form = ref<Form>(
    parameters.blankForm ? cloneDeep(parameters.blankForm) : ({} as Form),
  )
  const sendFormStatus = ref<AsyncDataRequestStatus>("idle")
  const sendFormRequestErrors = ref()
  const formErrors = ref<FormErrors>()

  const showForm = computed(() => {
    if (sendFormStatus.value === "pending") return false
    if (sendFormStatus.value === "error" && formErrors.value === undefined)
      return false
    return true
  })

  async function clearFormErrorsForKey(formErrorsKey: keyof FormErrors) {
    if (formErrors.value?.[formErrorsKey])
      formErrors.value[formErrorsKey] = undefined
  }

  async function sendForm(fetchParameters?: {
    id?: string
    form: Form | {}
    onResponse?: () => void
  }) {
    try {
      sendFormStatus.value = "pending"
      sendFormRequestErrors.value = undefined
      formErrors.value = undefined

      const url = fetchParameters?.id
        ? `${parameters.url}/${fetchParameters.id}/`
        : parameters.url
      const fetchForm = $fetch.create({
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
          if (fetchParameters?.onResponse) fetchParameters.onResponse()
          sendFormStatus.value = "success"
        },
      })
      await fetchForm(url)
    } catch (catchedError) { }
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
    form,
    sendFormStatus,
    sendFormRequestErrors,
    formErrors,
    showForm,
    sendForm,
    clearFormErrorsForKey,
    reset,
  }
}

export default useFormApi
