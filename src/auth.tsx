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
import { AxiosResponse } from 'axios'
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
        } catch (error) {
            return { success: false, message: error.message }
        }
    },
    logout: () => {
        // This function is purposely left blank
        // because it is only used for
        // the createContext default value
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
            const {
                data,
                headers,
                status
            }: AxiosResponse<APIResponse<LoginResponse>> = await AuthAPI.post('/auth/login', {
                email,
                password
            })
            if (status !== 200) throw new Error('Login failed')
            const { data: userData } = data
            const loginResponse = userData as LoginResponse
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
        } catch (error) {
            return {
                success: false,
                message:
                    error.response.data.error === null
                        ? error.response.data.message
                        : error.response.data.error
            }
        }
    }

    const logout = () => {
        removeTokenCookie()
        removeUserCookie()
        setUser(DefaultUser)
        window.location.pathname = '/login'
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user.id, user, login, loading, logout }}
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
