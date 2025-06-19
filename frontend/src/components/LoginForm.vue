<template>
  <div class="card">
    <h3>Logga in</h3>
    <div class="form-body">
      <input v-model="username" type="text" placeholder="Användarnamn" />
      <input v-model="password" type="password" placeholder="Lösenord" />
      <button @click="login" :disabled="loading">
        {{ loading ? "Loggar in..." : "Logga in" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '../store'

const API_BASE_URL = 'http://localhost:3001/api/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const login = async () => {
  console.log('🔐 Startar inloggning...')
  error.value = ''
  loading.value = true

  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      username: username.value,
      password: password.value,
    })

    console.log('✅ Inloggning lyckades! Svar:', JSON.stringify(res.data, null, 2));

    const token = res.data.token;
    const role = res.data.role || 'none';
    const email = ''; // Backend skickar inte med email, lämna tomt eller ändra efter behov

    userStore.setUser(token, role, email);

    router.push('/dashboard');
  } catch (err: any) {
    console.error('❌ Inloggning misslyckades:', err);

    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Något gick fel. Försök igen.';
    }
  } finally {
    loading.value = false;
    console.log('🔁 Inloggning avslutad');
  }
}

</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  background: rgba(255, 255, 255, 0.368);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  min-height: 270px;
  color: #333;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h3 {
  font-size: 24px;
  text-align: center;
  color: #333;
  margin-bottom: 16px;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  padding: 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  padding: 14px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not([disabled]) {
  background-color: #0056b3;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  text-align: center;
  margin-top: 8px;
}
</style>