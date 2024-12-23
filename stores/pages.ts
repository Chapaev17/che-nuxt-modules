import type { PageSeoData } from "@/types/base"

import { useDetailApi } from "../composables/api"

export const usePagesStore = defineStore("pages", () => {
  const {
    public: { backendApiUrl },
  } = useRuntimeConfig()
  const {
    data: apiPageSeoData,
    fetchDataStatus: fetchApiPageSeoDataStatus,
    fetchData: fetchApiPageSeoDataBase,
  } = useDetailApi<ApiStaticPage>()

  const pageSeoData = computed(() => {
    if (!apiPageSeoData.value) return
    const { breadcrumbs, ...otherFields } = apiPageSeoData.value
    return otherFields
  })

  const breadcrumbs = computed(() => {
    const breadcrumbsFromApi = apiPageSeoData.value?.breadcrumbs
    if (breadcrumbsFromApi === undefined) return
    const mainPage = {
      path: "/",
      title: "Главная",
      slug: "index",
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
      url,
      onResponseError: () => {
        console.error(`Failed to load seo data list for "${slugOrMain}" page`)
      },
    })
  }

  return {
    apiPageSeoData,
    fetchApiPageSeoDataStatus,
    pageSeoData,
    breadcrumbs,
    fetchPageSeoData,
  }
})
