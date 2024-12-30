import { useDetailApi } from "../api"

export default function useStaticPage<StaticPage>(parameters: {
  path: string
}) {
  const {
    public: { backendApiUrl },
  } = useRuntimeConfig()

  const {
    data: staticPage,
    fetchDataStatus: fetchStaticPageStatus,
    fetchData: fetchStaticPageBase,
  } = useDetailApi<StaticPage>({ url: parameters.path })

  async function fetchStaticPage(fetchParameters: { path: string }) {
    const arrayPath = fetchParameters.path.split("/")
    const slug = arrayPath.at(-1)
    const slugOrMain = slug || "index"
    const url = `${backendApiUrl}${parameters.path}/${slugOrMain}/`

    await fetchStaticPageBase({
      url,
      onResponseError: () => {
        console.error(`Failed to load seo data list for "${slugOrMain}" page`)
      },
    })
  }

  return { staticPage, fetchStaticPageStatus, fetchStaticPage }
}
