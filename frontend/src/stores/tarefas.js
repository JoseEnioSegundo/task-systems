import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTarefasStore = defineStore('tarefas', () => {
  const tarefas = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filtros = ref({
    concluida: null,
    prioridade: null,
    search: '',
    ordering: '-prioridade'
  })

  const tarefasFiltradas = computed(() => {
    let filtered = [...tarefas.value]

    if (filtros.value.concluida !== null) {
      filtered = filtered.filter(t => t.concluida === filtros.value.concluida)
    }

    if (filtros.value.prioridade) {
      filtered = filtered.filter(t => t.prioridade === filtros.value.prioridade)
    }

    if (filtros.value.search) {
      const search = filtros.value.search.toLowerCase()
      filtered = filtered.filter(t =>
        t.titulo.toLowerCase().includes(search) ||
        t.descricao.toLowerCase().includes(search)
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      const order = filtros.value.ordering.startsWith('-') ? -1 : 1
      const field = filtros.value.ordering.replace('-', '')

      if (field === 'prioridade') {
        return (a.prioridade - b.prioridade) * order
      }

      const aVal = new Date(a[field])
      const bVal = new Date(b[field])
      return (aVal - bVal) * order
    })

    return filtered
  })

  const tarefasPendentes = computed(() =>
    tarefas.value.filter(t => !t.concluida)
  )

  const tarefasConcluidas = computed(() =>
    tarefas.value.filter(t => t.concluida)
  )

  const carregarTarefas = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const queryParams = {
        ...filtros.value,
        ...params
      }

      // Remover valores null/undefined
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key]
        }
      })

      const response = await api.get('/tarefas/', { params: queryParams })
      tarefas.value = response.data.results || response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Erro ao carregar tarefas'
      console.error('Erro ao carregar tarefas:', err)
    } finally {
      loading.value = false
    }
  }

  const criarTarefa = async (tarefaData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/tarefas/', tarefaData)
      tarefas.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erro ao criar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  const atualizarTarefa = async (id, tarefaData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/tarefas/${id}/`, tarefaData)
      const index = tarefas.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tarefas.value[index] = { ...tarefas.value[index], ...response.data }
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erro ao atualizar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletarTarefa = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/tarefas/${id}/`)
      tarefas.value = tarefas.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.response?.data?.detail || 'Erro ao deletar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleConcluida = async (id) => {
    const tarefa = tarefas.value.find(t => t.id === id)
    if (tarefa) {
      return atualizarTarefa(id, { concluida: !tarefa.concluida })
    }
  }

  const setFiltros = (novosFiltros) => {
    filtros.value = { ...filtros.value, ...novosFiltros }
  }

  return {
    tarefas,
    loading,
    error,
    filtros,
    tarefasFiltradas,
    tarefasPendentes,
    tarefasConcluidas,
    carregarTarefas,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    toggleConcluida,
    setFiltros
  }
})