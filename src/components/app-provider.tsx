'use client'
import { RoleType } from '@/app/types/jwt.types'
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import RefreshToken from './refresh-token'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, setRoleState] = useState<RoleType | undefined>()

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokenFromLocalStorage()
    }
  }, [])

  const isAuth = Boolean(role)

  return (
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
