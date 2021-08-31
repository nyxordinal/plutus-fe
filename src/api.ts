import { getTokenCookie } from '@services/cookie.service'
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios'

const baseAPIv1 = process.env.NEXT_PUBLIC_API_V1

const handleRequestSend = (config: AxiosRequestConfig) => {
    // Set Auth Token
    const token = getTokenCookie()
    const modifiedconfig = config
    if (token) {
        modifiedconfig.headers.Authorization = `Bearer ${token}`
    }
    return modifiedconfig
}

const handleRequestError = (error: AxiosError) => {
    return Promise.reject(error)
}

const handleResponseReceive = (response: AxiosResponse) => {
    return response.data
}

const handleResponseError = (error: AxiosError) => {
    return error.response ? error.response.data : error
}

export const API: AxiosInstance = axios.create({
    baseURL: baseAPIv1 || '',
    headers: { Accept: 'application/json' }
})
export const AuthAPI: AxiosInstance = axios.create({
    baseURL: baseAPIv1 || '',
    headers: { Accept: 'application/json' }
})

API.interceptors.request.use(handleRequestSend, handleRequestError)
API.interceptors.response.use(handleResponseReceive, handleResponseError)