import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const token =
  "007eJxTYFj79kHtgdPF2fHrGC1KWCtvrulM9nRYbTEr4bfM3ek3XvQrMCRaJFkYGVkkJxlYmJuYmicmWpqYGKVZGhqnJpoYpiWmcR52SG0IZGRY/ukCCyMDBIL4LAy5iZl5DAwA1wkhfA==";
const appId = "a8b8228cb087457aa9442f913ea41faf";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
