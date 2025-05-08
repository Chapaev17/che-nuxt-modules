export async function useLoadStaticPage(parameters: {
  fetchStaticPage: (parameters: { path: string }) => Promise<void>
}) {
  const route = useRoute()

  await useVoidAsyncData({
    fetchFunction: async () => {
      await parameters.fetchStaticPage({ path: route.path })
    },
  })
}
