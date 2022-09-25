import axios from "axios";
import { BASE_URL } from "@/lib/consts";

const instance = axios.create();
instance.defaults.baseURL = BASE_URL;

instance.interceptors.request.use(
  request => {
    console.log("发起请求 => ", request.url);
    console.log("请求参数=>", request.data);
    
    request.data = {
      reqData: request.data || {}
    };
    return request;
  },
  error => {
    return Promise.reject(error);
  }
)

instance.interceptors.response.use(
  async ({ data }) => {
    let { resCode, resMessage, subCode, subMessage, resData } = data;
    if (resCode === "0000" && subCode === "00000000") {
      return resData;
    } else {
      return Promise.reject(resMessage);
    }
  },
  error => {
    console.log("请求错误=>", error);
    return Promise.reject(error);
  }
)

export default instance