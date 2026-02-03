// @ts-ignore
import { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "test",
  // Big timeoute, becose pages in vpn open slow.
  timeout: 180_000,
  workers: 2,
  reportSlowTests: { max: 0, threshold: 60 * 1000 },
  use: {
    viewport: { width: 1280, height: 720 },
    headless: true,
    // video: {
    //   mode: "on",
    //   // size: { width: 640, height: 480 },
    // }
  },
}
export default config
