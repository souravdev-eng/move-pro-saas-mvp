import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined

export const http = axios.create({
    baseURL: baseURL ?? 'http://localhost:4000',
    withCredentials: false,
})

http.interceptors.request.use((config) => {
    return config
})

http.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

export default http


