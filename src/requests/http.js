// 对接口的 baseURL、超时时间、请求和响应拦截、接口类型封装等都将在此文件中。

import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

// 请求超时时间
axios.defaults.timeout = 50000;
// 基地址
axios.defaults.baseURL = "/api";
// 自定义post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

/**
 * 请求拦截器
 * @author Joe
 * @since 2022-04-23
 */
axios.interceptors.request.use(
    config => {
        // 请求头携带cookie
        config.headers["Authorization"] = "Bearer " + localStorage.getItem("cloud-token");
        return config;
    },
    error => {
        // 请求错误时
        return Promise.reject(error);
    }
);

/**
 * @author Joe
 * @since 2022-04-23
 * 响应拦截器
 */
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // 正常访问
            return Promise.resolve(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                case 500:
                    Message.error("后台服务发生错误");
                    break;
                case 401:
                    router.push("/login");
                    break;
                case 404:
                    Message.error("当前接口不存在");
                    break;
                default:
                    Message.error(error.response.message);
                    return Promise.reject(error.response);
            }
        }
    }
);

/**
 * @author Joe
 * @since 2022-04-23
 *
 * 封装get请求。
 * params是查询参数，
 * 接口中的表现形式为 & 符号连接的 key=value 形式的字符串，
 * 统一用?符号拼接在接口后，
 * 例如常用的分页查询接口 getFileList?page=1&pageSize=10；
 * info 参数直接拼接在 url 中，
 * 例如某些查询接口 get 请求，需要把 id 拼接在 url 中
 */
export function getRequest(url, params, info = "") {
    return new Promise((resolve, reject) => {
        axios
            .get(url + info, {
                params: params
            })
            .then((res) => {
                // 返回接口响应结果
                resolve(res.data);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
}

/**
 * @author Joe
 * @since 2022-04-23
 *
 * 封装Post请求。
 * info为true，formData格式；
 * info 为 undefined 或 false，json 格式。
 */
export function postRequest(url, data = {}, info) {
    return new Promise((resolve, reject) => {
        let newData = data;
        if (info) {
            // 转formData格式
            newData = new FormData();
            for (let i in data) {
                newData.append(i, data[i]);
            }
        }
        axios
            .post(url, newData)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
}

/**
 * @author Joe
 * @since 2022-04-23
 *
 * 封装Put请求。
 */
export function putRequest(url, params = {}, info = "") {
    return new Promise((resolve, reject) => {
        axios
            .put(url + info, params)
            .then((res) => {
                    resolve(res.data);
                }, (err) => {
                    reject(err.data);
                }
            );
    });
}

/**
 * 封装delete请求
 */
export function deleteRequest(url, params = {}, info = "") {
    return new Promise((resolve, reject) => {
        axios
            .delete(url + info, {
                params: params,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
}