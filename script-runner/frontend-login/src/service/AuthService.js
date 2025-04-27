import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_BACKEND_API_URL;


export const loginUser = (values) =>
  axios
    .post(`${BASE_URL}api/v1/user/login`, values, {
      headers: { "X-App-Type": "WEB", "Content-Type": "application/json" },
    })
    .then((r) => r.data);

export const storeFcmToken = async (token, accessToken) => {
  const response = await axios.post(
    `${BASE_URL}api/v1/notification/store-fcm-token`,
    { token },
    {
      headers: {
        "X-App-Type": "WEB",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${BASE_URL}api/v1/user/forgot-password`,
    {},
    {
      params: { email },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const checkOtp = async (otp, email) => {
  const response = await axios.post(
    `${BASE_URL}api/v1/user/check-otp`,
    { otp, email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const resetPassword = async (email, password) => {
  const response = await axios.post(
    `${BASE_URL}api/v1/user/new-password`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
