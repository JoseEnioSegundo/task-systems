import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/token/', { username, password })
      token.value = response.data.access
      const refreshToken = response.data.refresh

      // Decodificar token para obter user info (simplificado)
      const payload = JSON.parse(atob(response.data.access.split('.')[1]))
      user.value = { id: payload.user_id, username: payload.username }

      localStorage.setItem('token', token.value)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user.value))

      // Configurar token no header padrão
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken')
      if (!refresh) throw new Error('No refresh token')

      const response = await api.post('/token/refresh/', { refresh })
      token.value = response.data.access
      localStorage.setItem('token', token.value)
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  // Inicializar token se existir
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    refreshToken
  }
})