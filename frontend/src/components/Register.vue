<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Registrera dig</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Lösenord" required />
        <button type="submit">Registrera</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <button class="back-button" @click="goBack">← Tillbaka</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function register() {
  error.value = '';
  try {
    await axios.post('http://localhost:4000/api/auth/register', {
      email: email.value,
      password: password.value,
    });
    alert('Registrering lyckades! Vänta på admin-godkännande.');
    email.value = '';
    password.value = '';
    router.push('/');
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Fel vid registrering';
  }
}

function goBack() {
  router.push('/');
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f4f8;
}

.register-box {
  background-color: white;
  padding: 4.5rem 3.5rem;
  border-radius: 12px;
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

button {
  
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.back-button {
  padding: 10px;
  margin-top: 2rem;
  background-color: #e0e0e0;
  color: #333;
}

.back-button:hover {
  background-color: #c0c0c0;
}

.error {
  margin-top: 1rem;
  color: #e53935;
  font-weight: bold;
}
</style>
