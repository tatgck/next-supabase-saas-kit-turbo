import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  location?: {
    latitude: number
    longitude: number
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (provider: 'google' | 'github' | 'wechat') => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updateLocation: (location: { latitude: number; longitude: number }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (provider: 'google' | 'github' | 'wechat') => {
        set({ loading: true })
        
        try {
          // 模拟OAuth登录流程
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: provider === 'google' ? 'Google用户' : provider === 'github' ? 'GitHub用户' : '微信用户',
            email: `user@${provider}.com`,
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
          }
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            loading: false 
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ 
            user: { ...user, ...data } 
          })
        }
      },

      updateLocation: (location: { latitude: number; longitude: number }) => {
        const { user } = get()
        if (user) {
          set({ 
            user: { ...user, location } 
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)