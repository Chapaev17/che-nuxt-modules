export async function useLoadStaticPage(parameters: {
  fetchStaticPage: (parameters: { path: string }) => Promise<void>
}) {
  const route = useRoute()

  await useVoidAsyncData(async () => {
    await parameters.fetchStaticPage({ path: route.path })
  })
}
