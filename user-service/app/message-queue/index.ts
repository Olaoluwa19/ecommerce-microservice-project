import axios from "axios";

const PRODUCT_URL =
  "https://vnfd2hrqu2.execute-api.us-east-1.amazonaws.com/prod/product-queue";

export const PullData = async (requestData: Record<string, unknown>) => {
  return axios.post(PRODUCT_URL, requestData);
};
