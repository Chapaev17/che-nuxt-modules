import type { MetaObject } from "nuxt/schema"

import { usePagesStore } from "../stores/pages"

export default async function useAppSeo(url: string) {
  const pageStore = usePagesStore()
  const route = useRoute()

  const { pageSeoData } = storeToRefs(pageStore)
  const { fetchPageSeoData } = pageStore

  const page = computed(() => pageSeoData.value)

  const head = computed<MetaObject>(() => {
    const canonical = getCanonical()
    const metaInfo = createMetaInfo(canonical)
    setMetaProperties(metaInfo)
    return metaInfo
  })

  watch(() => route.path, fetchApiSeoByRoutePath)

  await useVoidAsyncData({ fetchFunction: fetchApiSeoByRoutePath })

  function getCanonical() {
    const formatPath = route.path.toLowerCase().replace(/\/$/u, "")
    return `${url}${formatPath}`
  }

  async function fetchApiSeoByRoutePath() {
    await fetchPageSeoData(route.path)
  }

  function createMetaInfo(canonical: string): MetaObject {
    return {
      title: page.value ? page.value.seoTitle || page.value.title : undefined,
      htmlAttrs: {
        lang: "ru",
      },
      meta: [],
      link: [{ rel: "canonical", href: canonical }],
    }
  }

  function setMetaProperties(metaInfo: MetaObject) {
    if (page.value?.seoDescription) {
      const seoDescriptionMetaProperty: NonNullable<MetaObject["meta"]>["0"] =
      {
        hid: "description",
        name: "description",
        content: page.value.seoDescription,
      }
      metaInfo.meta?.push(seoDescriptionMetaProperty)
    }

    if (page.value?.seoKeywords) {
      const seoKeywordsMetaProperty: NonNullable<MetaObject["meta"]>["0"] = {
        name: "keywords",
        content: page.value.seoKeywords,
      }
      metaInfo.meta?.push(seoKeywordsMetaProperty)
    }
  }

  return { head }
}
