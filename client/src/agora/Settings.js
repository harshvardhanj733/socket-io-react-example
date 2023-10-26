import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const token =
  "007eJxTYLhpuGFu4MVKs/RW81dqx499XO9at//ik/K8mua1j+6mHGpRYEi0SLIwMrJITjKwMDcxNU9MtDQxMUqzNDROTTQxTEtMS/CxSm0IZGTY/OktEyMDBIL4LAy5iZl5DAwAP8gi7Q==";
const appId = "a8b8228cb087457aa9442f913ea41faf";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
