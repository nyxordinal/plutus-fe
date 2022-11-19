import { API, AuthAPI } from "@api";
import { APIResponse, ServiceResponse } from "@interface/http.interface";
import { getUTCTimestamp, logErrorResponse } from "@util";
import { AxiosResponse } from "axios";
import { encryptPayload } from "encryptor";

export const sendForgotPasswordEmail = async (
  email: string
): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<null> = await API.post("/auth/forgot", {
      email,
    });
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

export const resetPassword = async (
  email: string,
  resetToken: string,
  password: string
): Promise<ServiceResponse> => {
  try {
    // get server timestamp
    const resp: AxiosResponse<APIResponse<number>> = await AuthAPI.get(
      "/login-state"
    );

    // encrypt payload
    const encPassword = encryptPayload(
      password,
      resp.data.data || getUTCTimestamp()
    );

    const r: APIResponse<null> = await API.post("/auth/reset", {
      email,
      token: resetToken,
      enc_password: encPassword,
    });
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};
