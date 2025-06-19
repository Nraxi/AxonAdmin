<template>
  <div class="container">
    <div class="left-side">
      <img src="https://placekitten.com/400/400" alt="Katt" />
    </div>
    <div class="right-side">
      <h2 class="WC">Välkommen!</h2>
      <component :is="activeTabComponent" />
      <br /><br />
      <div class="toggle-buttons">
        <button
          :class="{ active: activeTab === 'info' }"
          @click="activeTab = 'info'"
        >
          Om Appen
        </button>
        <button
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          Logga in
        </button>
        <button
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
        Registrera
      </button>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import AppInfo from './AppInfo.vue';

const activeTab = ref('login');

const activeTabComponent = computed(() => {
  if (activeTab.value === 'login') return LoginForm;
  if (activeTab.value === 'register') return RegisterForm;
  return AppInfo;
});
</script>

<style scoped>


.WC{
  font-size: 30px;
}

.container {
  display: flex;
  height: 100vh;
}

.left-side {
  flex: 1;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-side img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: #d0835c;
  padding: 20px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
}

.toggle-buttons button {
  padding: 10px 20px;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
}

.toggle-buttons button.active {
  background-color: #4caf50;
  color: white;
}
</style>
