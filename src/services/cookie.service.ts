import { User } from '@interface/entity.interface'
import Cookies from 'js-cookie'

// Token Name for JWT Token
const KEY_TOKEN = '32EML6C5fJYjrUFe'

// Token Name for user data
const KEY_USER = 'akszdrhh7Yz4GShe'

export const getTokenCookie = (): string => {
    return Cookies.get(KEY_TOKEN) || ''
}

export const setTokenCookie = (token = ''): void => {
    Cookies.set(KEY_TOKEN, token, { expires: 1 })
}

export const removeTokenCookie = (): void => {
    Cookies.remove(KEY_TOKEN)
}

export const getUserCookie = (): string => {
    return Cookies.get(KEY_USER) || ''
}

export const setUserCookie = (user: User): void => {
    Cookies.set(KEY_USER, JSON.stringify(user))
}

export const removeUserCookie = (): void => {
    Cookies.remove(KEY_USER)
}
