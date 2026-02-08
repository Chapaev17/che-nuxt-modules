import { useDetailApi } from "../composables/api"

import type { PageSeoData } from "@/types/base"

export const usePagesStore = defineStore("pages", () => {
  const {
    public: { backendApiUrl },
  } = useRuntimeConfig()
  const {
    data: apiPageSeoData,
    fetchData: fetchApiPageSeoDataBase,
    fetchDataStatus: fetchApiPageSeoDataStatus,
  } = useDetailApi<ApiStaticPage>()

  const pageSeoData = computed(() => {
    if (!apiPageSeoData.value) { return }
    const { breadcrumbs, ...otherFields } = apiPageSeoData.value
    return otherFields
  })

  const breadcrumbs = computed(() => {
    const breadcrumbsFromApi = apiPageSeoData.value?.breadcrumbs
    if (breadcrumbsFromApi === undefined) { return }
    const mainPage = {
      path: "/",
      slug: "index",
      title: "Главная",
    }
    const breadcrumbsFromApiWithPath = breadcrumbsFromApi.map(
      (breadcrumbsElement, index) => ({
        ...breadcrumbsElement,
        path: breadcrumbsFromApi
          .slice(0, index + 1)
          .map(
            (slicedBreadcrumbsElement) => `/${slicedBreadcrumbsElement.slug}`,
          )
          .join(""),
      }),
    )
    return [mainPage, ...breadcrumbsFromApiWithPath]
  })

  async function fetchPageSeoData(path: PageSeoData["path"]): Promise<void> {
    const arrayPath = path.split("/")
    const slug = arrayPath.at(-1)
    const slugOrMain = slug || "index"
    const url = `${backendApiUrl}/page/static/${slugOrMain}/`

    await fetchApiPageSeoDataBase({
      onResponseError: () => {
        console.error(`Failed to load seo data list for "${slugOrMain}" page`)
      },
      url,
    })
  }

  return {
    apiPageSeoData,
    breadcrumbs,
    fetchApiPageSeoDataStatus,
    fetchPageSeoData,
    pageSeoData,
  }
})
