import { AuthAPI } from '@api'
import { AUTH_TOKEN_KEY } from '@interface/constant'
import { User } from '@interface/entity.interface'
import { APIResponse, LoginResponse, ServiceResponse } from '@interface/http.interface'
import {
    getTokenCookie,
    getUserCookie,
    removeTokenCookie,
    removeUserCookie,
    setTokenCookie,
    setUserCookie
} from '@services/cookie.service'
import { getUTCTimestamp } from '@util'
import { AxiosResponse } from 'axios'
import { encryptPayload } from 'encryptor'
import { useRouter } from 'next/router'
import {
    ComponentType,
    createContext,
    FC,
    useContext,
    useEffect,
    useState
} from 'react'

const DefaultUser: User = {
    id: 0,
    name: '',
    email: '',
}

type AuthContextType = {
    isAuthenticated: boolean
    loading: boolean
    user: User
    login: (username: string, password: string) => Promise<ServiceResponse>
    logout: () => void
    register: (name: string, email: string, password: string) => Promise<ServiceResponse>
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: DefaultUser,
    loading: true,
    login: async (username: string, password: string) => {
        try {
            if (!username && !password) {
                throw new Error('Login failed')
            }
            return { success: true, message: '' }
        } catch (error: any) {
            return { success: false, message: error.message }
        }
    },
    logout: () => {
        // This function is purposely left blank
        // because it is only used for
        // the createContext default value
    },
    register: async (name: string, email: string, password: string) => {
        try {
            if (!name && !email && !password) {
                throw new Error('Register failed')
            }
            return { success: true, message: '' }
        } catch (error: any) {
            return { success: false, message: error.message }
        }
    }
})

export const AuthProvider: FC<{ children: any }> = ({ children }) => {
    const [user, setUser] = useState<User>(DefaultUser)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUserFromCookies() {
            const token = getTokenCookie()
            if (token) {
                const user = getUserCookie()
                if (user) setUser(JSON.parse(user))
            }
            setLoading(false)
        }
        loadUserFromCookies()
    }, [])

    const login = async (
        email: string,
        password: string
    ): Promise<ServiceResponse> => {
        // Login user
        try {
            // get server timestamp
            const resp: AxiosResponse<APIResponse<number>> = await AuthAPI.get('/login-state')

            // encrypt payload
            const encPassword = encryptPayload(password, resp.data.data || getUTCTimestamp())

            const { headers, data }: AxiosResponse<APIResponse<LoginResponse>> = await AuthAPI.post('/auth/login', {
                email,
                enc_password: encPassword
            })
            const loginResponse = data.data as LoginResponse
            const user: User = {
                id: loginResponse.id || 0,
                name: loginResponse.name,
                email: loginResponse.email,
            }
            const token: string = headers[AUTH_TOKEN_KEY] || ''
            if (token) {
                setTokenCookie(token)
                setUserCookie(user)
                setUser(user)
                window.location.pathname = '/'
            }
            return { success: true, message: 'Login success' }
        } catch (error: any) {
            if (error.response)
                return {
                    success: false,
                    message:
                        error.response.data.error
                            ? error.response.data.error
                            : error.response.data.message
                }
            return {
                success: false,
                message:
                    error.message ? error.message : "Error when login"
            }
        }
    }

    const logout = () => {
        removeTokenCookie()
        removeUserCookie()
        setUser(DefaultUser)
        window.location.pathname = '/login'
    }

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<ServiceResponse> => {
        try {
            const { data }: AxiosResponse<APIResponse<null>> = await AuthAPI.post('/auth/register', {
                name,
                email,
                password
            })
            return { success: true, message: data.message }
        } catch (error: any) {
            if (error.response)
                return {
                    success: false,
                    message:
                        error.response.data.error
                            ? error.response.data.error
                            : error.response.data.message
                }
            return {
                success: false,
                message:
                    error.message ? error.message : "Error when register"
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user.id, user, login, loading, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    const context = useContext(AuthContext)

    return context
}

export const ProtectRoute = (
    Page: ComponentType,
    isAuthRoute = false,
): (() => JSX.Element) => {
    return () => {
        const router = useRouter()
        const { isAuthenticated, loading, user } = useAuth()
        useEffect(() => {
            if (!isAuthenticated && !loading) router.push('/login')
            if (isAuthRoute && isAuthenticated) router.push('/')
        }, [loading, isAuthenticated, user])

        return <Page />
    }
}
