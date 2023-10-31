import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const token = "007eJxTYMhZu3XHviczUrc8vC2V6pNT33uT2yozJvrhZ//VCdufuH1RYEi0SLIwMrJITjKwMDcxNU9MtDQxMUqzNDROTTQxTEtM43GzSm0IZGRY1bKRhZEBAkF8FobcxMw8BgYAAoQhQg==";
const appId = "a8b8228cb087457aa9442f913ea41faf";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
