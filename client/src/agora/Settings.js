import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const token =
  "007eJxTYMh5bDTzXe9JwS9/N3BzqTdvasyUafgyWds85ZLlPHbptT4KDIkWSRZGRhbJSQYW5iam5omJliYmRmmWhsapiSaGaYlpZkfNUxsCGRk+blvBzMgAgSA+C0NuYmYeAwMAPO0fVg==";
const appId = "a8b8228cb087457aa9442f913ea41faf";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
