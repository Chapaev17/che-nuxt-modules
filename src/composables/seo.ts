import type { MetaObject } from "nuxt/schema"

import type { Seo } from "../types/pages"

export default function useSeo(seo: Ref<Seo | undefined>) {
  const route = useRoute()

  const {
    public: { backendUrl },
  } = useRuntimeConfig()

  const head = computed<MetaObject>(() => {
    const canonical = getCanonical()
    const metaInfo = createMetaInfo(canonical)
    setMetaProperties(metaInfo)
    return metaInfo
  })

  function getCanonical() {
    const formatPath = route.path.toLowerCase().replace(/\/$/u, "")
    return `${backendUrl}${formatPath}`
  }

  function createMetaInfo(canonical: string): MetaObject {
    return {
      title: seo.value ? seo.value.seoTitle || seo.value.title : undefined,
      htmlAttrs: {
        lang: "ru",
      },
      meta: [],
      link: [{ rel: "canonical", href: canonical }],
    }
  }

  function setMetaProperties(metaInfo: MetaObject) {
    if (seo.value?.seoDescription) {
      const seoDescriptionMetaProperty: NonNullable<MetaObject["meta"]>["0"] =
      {
        hid: "description",
        name: "description",
        content: seo.value.seoDescription,
      }
      metaInfo.meta?.push(seoDescriptionMetaProperty)
    }

    if (seo.value?.seoKeywords) {
      const seoKeywordsMetaProperty: NonNullable<MetaObject["meta"]>["0"] = {
        name: "keywords",
        content: seo.value.seoKeywords,
      }
      metaInfo.meta?.push(seoKeywordsMetaProperty)
    }
  }

  useHead(head)
}
