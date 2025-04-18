export function useCallBeforeLeaveFromPages(
  pagesUsingData: string[],
  callback: () => void,
) {
  const router = useRouter()
  const pages = new Set(pagesUsingData)

  router.beforeEach((to, from) => {
    if (!isString(from.name) || !isString(to.name)) return
    if (pages.has(from.name) && !pages.has(to.name)) {
      callback()
    }
  })
}

export function useCallBeforeLeaveFromPage(
  pageUsingData: string,
  callback: () => void,
) {
  const router = useRouter()

  router.beforeEach((to, from) => {
    if (!isString(from.name) || !isString(to.name)) return
    if (pageUsingData === from.name && pageUsingData !== to.name) {
      callback()
    }
  })
}
