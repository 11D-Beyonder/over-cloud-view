// 与用户相关的接口
import {getRequest, postRequest} from "@/requests/http";
// 登录接口
export const login = (_) => postRequest("/login", _);
// 注册接口
export const install = (_) => postRequest("/install", _);
// 获取登录状态和用户信息
export const checkUserLoginInfo = (_) => getRequest("/who", _);