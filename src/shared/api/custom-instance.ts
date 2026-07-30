import Axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: '/api',
})

export const customInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE(config).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
