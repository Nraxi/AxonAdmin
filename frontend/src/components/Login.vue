<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Logga in</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Lösenord" required />
        <button type="submit" class="primary-button">Logga in</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="button-row">
        <button class="small-button" @click="goToRegister">Registrera dig</button>
        <button class="small-button" @click="goBack">← Tillbaka</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');

async function login() {
  error.value = '';
  try {
    const res = await axios.post('http://localhost:4000/api/auth/login', {
      email: email.value,
      password: password.value
    });
    store.setUser(res.data.token, res.data.role, email.value);
    email.value = '';
    password.value = '';
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid inloggning';
  }
}

function goToRegister() {
  router.push('/register');
}

function goBack() {
  router.push('/');
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f4f8;
}

.login-box {
  background-color: white;
  padding: 3rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
}

.primary-button {
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #0056b3;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.small-button {
  padding: 10px;
  margin-top: 2rem;
  font-size: 1rem;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.small-button:hover {
  background-color: #c0c0c0;
}

.error {
  margin-top: 1rem;
  color: #e53935;
  font-weight: bold;
}
</style>
