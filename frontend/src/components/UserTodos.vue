<template>
  <div>
    <h2>Dina Todos</h2>
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Ny todo" required />
      <button type="submit">Lägg till</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo._id">{{ todo.content }}</li>
    </ul>
    <div v-if="error" style="color:red">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface ITodo {
  _id: string;
  content: string;
}

const todos = ref<ITodo[]>([]);
const newTodo = ref('');
const error = ref('');

async function fetchTodos() {
  error.value = '';
  try {
    const res = await axios.get('http://localhost:4000/api/todos');
    todos.value = res.data;
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid hämtning';
  }
}

async function addTodo() {
  error.value = '';
  try {
    await axios.post('http://localhost:4000/api/todos', { content: newTodo.value });
    newTodo.value = '';
    fetchTodos();
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid tillägg';
  }
}

onMounted(() => {
  fetchTodos();
});
</script>
