import {
  HTTP_STATUS_UNAUTHORIZED,
  PUBLIC_API_PATHS,
} from "@interface/constant";
import { APIError } from "@interface/http.interface";
import { getTokenCookie, hasValidTokenCookie } from "@service/cookie.service";
import { expireSession } from "@service/session.service";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const baseAPIv1 = process.env.NEXT_PUBLIC_API_V1;

const SESSION_EXPIRED_MESSAGE = "your session has expired, please login again";

export type APIRequestError = Error & { status?: number };

const buildRequestError = (
  message: string,
  status?: number
): APIRequestError => {
  const error: APIRequestError = new Error(message);
  error.status = status;
  return error;
};

// `API` also serves endpoints that work without a session, those must not be
// able to log the user out
const isPublicPath = (url = ""): boolean =>
  PUBLIC_API_PATHS.some((path) => url.startsWith(path));

const handleRequestSend = (config: AxiosRequestConfig) => {
  const modifiedconfig = config;

  // Every other endpoint needs a token, so a missing or expired one is an
  // expired session: end it now instead of waiting for the 401
  if (!isPublicPath(config.url) && !hasValidTokenCookie()) {
    expireSession();
    return Promise.reject(
      buildRequestError(SESSION_EXPIRED_MESSAGE, HTTP_STATUS_UNAUTHORIZED)
    );
  }

  // Set Auth Token
  const token = getTokenCookie();
  if (token) {
    modifiedconfig.headers!!.Authorization = `Bearer ${token}`;
  }
  return modifiedconfig;
};

const handleRequestError = (error: AxiosError) => {
  return Promise.reject(error);
};

const handleResponseReceive = (response: AxiosResponse) => {
  return response.data;
};

const handleResponseError = (errorResp: AxiosError<APIError>) => {
  const status = errorResp.response?.status;

  // The server rejected our token, stop trusting the local session
  if (
    status === HTTP_STATUS_UNAUTHORIZED &&
    !isPublicPath(errorResp.config?.url)
  ) {
    expireSession();
    throw buildRequestError(SESSION_EXPIRED_MESSAGE, status);
  }

  if (errorResp.response)
    throw buildRequestError(errorResp.response.data.message, status);
  else throw buildRequestError("there is an error");
};

export const API: AxiosInstance = axios.create({
  baseURL: baseAPIv1 || "",
  headers: { Accept: "application/json" },
});
export const AuthAPI: AxiosInstance = axios.create({
  baseURL: baseAPIv1 || "",
  headers: { Accept: "application/json" },
});

API.interceptors.request.use(handleRequestSend, handleRequestError);
API.interceptors.response.use(handleResponseReceive, handleResponseError);
