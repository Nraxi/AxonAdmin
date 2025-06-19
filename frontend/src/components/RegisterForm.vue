<template>
  <div class="card">
    <h3>Registrera</h3>
    <div class="form-body">
      <input v-model="username" type="text" placeholder="Användarnamn" />
      <input v-model="password" type="password" placeholder="Lösenord" />
      <button @click="register" :disabled="loading">
        {{ loading ? "Registrerar..." : "Registrera" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="responseMessage" class="success">{{ responseMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

// API-basen (ändra till din server-url om annan port/domän)
const API_BASE_URL = 'http://localhost:3001/api/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const responseMessage = ref('')

const register = async () => {
  console.log('📝 Startar registrering...')
  error.value = ''
  responseMessage.value = ''
  loading.value = true

  try {
    const res = await axios.post(`${API_BASE_URL}/register`, {
      username: username.value,
      password: password.value,
    })

    console.log('✅ Registrering lyckades! Backend-svar:', res.data)

    // Visa backend-svar i UI
    responseMessage.value = res.data.message || JSON.stringify(res.data)
  } catch (err: any) {
    console.error('❌ Registrering misslyckades:', err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Något gick fel. Försök igen.'
    }
  } finally {
    loading.value = false
    console.log('🔁 Registrering avslutad')
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
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not([disabled]) {
  background-color: #1976d2;
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

.success {
  color: green;
  text-align: center;
  margin-top: 8px;
}
</style>
