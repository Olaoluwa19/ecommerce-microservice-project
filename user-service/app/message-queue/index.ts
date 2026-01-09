import axios from "axios";

const PRODUCT_URL =
  "https://wvuocjmqdd.execute-api.us-east-1.amazonaws.com/prod/product-queue";

// "http://127.0.0.1:3000/product-queue";

export const PullData = async (requestData: Record<string, unknown>) => {
  return axios.post(PRODUCT_URL, requestData);
};
