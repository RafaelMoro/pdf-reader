import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1
}

export const appStatusCheck = writable(APP_STATUS.INIT);

export const setAppStatusLoading = () => {
  appStatusCheck.set(APP_STATUS.LOADING);
}

export const setAppStautsError = () => {
  appStatusCheck.set(APP_STATUS.ERROR);
}

export const setAppStautsChatMode = () => {
  appStatusCheck.set(APP_STATUS.CHAT_MODE);
}