<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  tarefa: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["toggle", "delete"]);

const emitToggle = () => emit("toggle", props.tarefa);
const emitDelete = () => emit("delete", props.tarefa);

const prioridadeClasse = computed(() => {
  const classes = {
    1: 'prioridade-baixa',
    2: 'prioridade-media',
    3: 'prioridade-alta',
    4: 'prioridade-urgente'
  };
  return classes[props.tarefa.prioridade] || 'prioridade-media';
});

const vencimentoFormatado = computed(() => {
  if (!props.tarefa.vencimento) return null;
  const date = new Date(props.tarefa.vencimento);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const estaVencida = computed(() => {
  if (!props.tarefa.vencimento || props.tarefa.concluida) return false;
  return new Date(props.tarefa.vencimento) < new Date();
});
</script>

<template>
  <li class="tarefa-item" :class="{ concluida: tarefa.concluida, vencida: estaVencida }">
    <label class="checkbox-wrap">
      <input
        type="checkbox"
        :checked="tarefa.concluida"
        @change="emitToggle"
      />
      <span class="checkmark"></span>
    </label>

    <div class="conteudo">
      <div class="topo">
        <h3>{{ tarefa.titulo }}</h3>
        <div class="badges">
          <span class="prioridade-badge" :class="prioridadeClasse">
            {{ tarefa.prioridade_display }}
          </span>
          <span v-if="estaVencida" class="vencida-badge">
            Vencida
          </span>
        </div>
      </div>

      <p v-if="tarefa.descricao" class="descricao">
        {{ tarefa.descricao }}
      </p>

      <div v-if="vencimentoFormatado" class="vencimento">
        <span class="vencimento-label">Vence em:</span>
        <span class="vencimento-data" :class="{ 'text-vencida': estaVencida }">
          {{ vencimentoFormatado }}
        </span>
      </div>

      <div class="meta">
        <small class="data-criacao">
          Criada em {{ new Date(tarefa.criada_em).toLocaleDateString('pt-BR') }}
        </small>
      </div>
    </div>

    <button class="delete-btn" @click="emitDelete" title="Excluir tarefa">
      🗑️
    </button>
  </li>
</template>

<style scoped>
.tarefa-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
  transition: background 0.18s ease;
}

.tarefa-item:hover {
  background: #fafbfd;
}

.tarefa-item.concluida h3,
.tarefa-item.concluida .descricao {
  opacity: 0.72;
}

.checkbox-wrap {
  position: relative;
  margin-top: 2px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-wrap input {
  position: absolute;
  opacity: 0;
  inset: 0;
  cursor: pointer;
}

.checkmark {
  display: block;
  width: 20px;
  height: 20px;
  border: 1.5px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  transition: all 0.18s ease;
}

.checkbox-wrap input:checked + .checkmark {
  background: #2563eb;
  border-color: #2563eb;
  box-shadow: inset 0 0 0 4px #ffffff;
}

.conteudo {
  min-width: 0;
}

.topo {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.topo h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
}

.descricao {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: #64748b;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

.status.done {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.delete-btn {
  align-self: center;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.18s ease, color 0.18s ease;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 640px) {
  .tarefa-item {
    grid-template-columns: auto 1fr;
  }

  .delete-btn {
    grid-column: 2;
    justify-self: start;
    padding-left: 0;
  }
}
</style>
