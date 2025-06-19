<template>
  <div>
    <h2>Adminpanel - Tilldela roller</h2>
    <div v-if="loading">Laddar...</div>
    <div v-if="error" style="color:red">{{ error }}</div>
    <ul>
      <li v-for="user in users" :key="user._id">
        {{ user.email }} - Roll: {{ user.role }}
        <select v-model="selectedRoles[user._id]">
          <option value="none">Ingen</option>
          <option value="user">User</option>
          <option value="usp">USP</option>
          <option value="admin">Admin</option>
        </select>
        <button @click="assignRole(user._id)">Spara</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

interface IUser {
  _id: string;
  email: string;
  role: string;
}

const users = ref<IUser[]>([]);
const loading = ref(false);
const error = ref('');
const selectedRoles = reactive<Record<string, string>>({});

async function fetchPendingUsers() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.get('http://localhost:3001/api/admin/pending-users');
    users.value = res.data;
    users.value.forEach(user => {
      selectedRoles[user._id] = user.role;
    });
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid hämtning';
  } finally {
    loading.value = false;
  }
}

async function assignRole(userId: string) {
  error.value = '';
  try {
    await axios.post('http://localhost:3001/api/admin/assign-role', {
      userId,
      role: selectedRoles[userId]
    });
    alert('Roll uppdaterad!');
    fetchPendingUsers();
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid uppdatering';
  }
}

onMounted(() => {
  fetchPendingUsers();
});
</script>
