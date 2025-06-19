<template>
  <div class="dashboard">
    <!-- Column 1 -->
    <div class="column column-1">
      <h2>Adminpanel</h2>
      <br />

      <div v-if="user?.role === 'admin'">
        <!-- Tabs -->
        <div class="admin-tabs">
          <div :class="{ active: activeTab === 'todo' }" @click="activeTab = 'todo'">Todo</div>
          <div :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Användare</div>
        </div>

        <!-- Todo-vy -->
        <div class="admin-controls" v-if="activeTab === 'todo'">
          <div class="admin-section">
            <h3>Skapa Todo</h3>
            <input v-model="task" placeholder="Ny uppgift" />
            <label style="cursor: pointer;">
              <input type="checkbox" v-model="done" style="display: none;" />
              {{ done ? '✅ Klar' : '❌ Ej Klar' }}
            </label>
            <button @click="postTodo">POST</button>
          </div>

          <div class="admin-section">
            <h3>Hämta Todos</h3>
            <div class="GetBtns">
              <button @click="getAll">GET ALL</button>
              <button @click="getMine">GET MINE</button>
            </div>
            <br />
            <input v-model="id" placeholder="ID..." />
            <button @click="getById">GET BY ID</button>
          </div>

          <div class="admin-section">
            <h3>Uppdatera Todo</h3>
            <input v-model="id" placeholder="ID..." />
            <input v-model="updatedTask" placeholder="Ny text" />
            <label @click="updatedDone = !updatedDone" style="cursor: pointer;">
              {{ updatedDone ? '✅ Klar' : '❌ Ej Klar' }}
            </label>
            <button @click="putById">PUT</button>
          </div>

          <div class="admin-section">
            <h3>Ta bort</h3>
            <input v-model="id" placeholder="ID..." />
            <div class="Delbuttons">
              <button @click="deleteById">DELETE BY ID</button>
              <button @click="deleteAll">DELETE ALL</button>
            </div>
          </div>
        </div>

        <!-- Användare-vy -->
        <div class="users-grid" v-else-if="activeTab === 'users'">
          <div class="admin-section container1">
            <h3>➕ Lägg till ny användare</h3>
            <input v-model="newUser.username" placeholder="Användarnamn" />
            <input v-model="newUser.password" placeholder="Lösenord" type="password" />
            
            <button @click="registerUser">Registrera</button>
          </div>

          <div class="admin-section container2">
            <h3>📜 Admin-logg</h3>
            <ul>
              <li v-for="(msg, index) in logMessages" :key="index">{{ msg }}</li>
            </ul>
            <button @click="logMessages = []">Rensa logg</button>
          </div>

          <div class="admin-section container3">
  <h3>🔍 Hantera Roller - Sök användare</h3>
  <input
    v-model="searchUserId"
    placeholder="Skriv användar-ID att söka"
    @keyup.enter="searchUserById"
    style="margin-bottom: 10px; padding: 8px; border-radius: 6px; border: 1px solid #ccc;"
  />
  <button @click="searchUserById" style="margin-bottom: 20px;">Sök</button>

  <div v-if="searchPerformed">
    <div v-if="searchedUser">
  <p><strong>ID:</strong> {{ searchedUser.id }}</p>
  <p><strong>Användarnamn:</strong> {{ searchedUser.username }}</p>
  <p>
    <strong>Roll:</strong>
    <template v-if="searchedUser.id === '1'">
      {{ searchedUser.role }}
    </template>
    <template v-else>
      <select v-model="searchedUser.role">
        <option value="none">none</option>
        <option value="user">user</option>
        <option value="usp">usp</option>
        <option value="dataadmin">dataadmin</option>
        <option value="admin">admin</option>
      </select>
    </template>
  </p>
  <template v-if="searchedUser.id === '1'">
  <button @click="cancelSearch" style="background-color: gray; color: white;">Avbryt</button>
</template>

  <template v-else>
    <button @click="saveSearchedUserRole">Spara ändring</button> <br />
    <button @click="cancelSearch" style="background-color: gray; color: white;">Avbryt</button>

  </template>
</div>

    <div v-else>
      <p style="color: red;">Användare med ID "{{ searchUserId }}" hittades inte.</p>
    </div>
  </div>
</div>


<div class="admin-section container4">
  <h3>🗑️ Ta bort användare med ID</h3>
  <input
    v-model="deleteUserId"
    placeholder="Skriv användar-ID att ta bort"
    @keyup.enter="searchUserToDelete"
    style="margin-bottom: 10px; padding: 8px; border-radius: 6px; border: 1px solid #ccc;"
  />
  <button @click="searchUserToDelete" style="margin-bottom: 20px;">Sök</button>

  <div v-if="deleteSearchPerformed">
    <div v-if="userToDelete">
      <p><strong>ID:</strong> {{ userToDelete.id }}</p>
      <p><strong>Användarnamn:</strong> {{ userToDelete.username }}</p>
      <p><strong>Roll:</strong> {{ userToDelete.role }}</p>

      <template v-if="userToDelete.id === '1'">
        <button disabled style="background-color: gray; color: white; cursor: not-allowed;">Ta bort</button>
      </template>
      <template v-else>
        <button @click="confirmDeleteUser(userToDelete.id)" style="background-color: red; color: white;">Ta bort</button>
      </template>
      <button @click="cancelDeleteSearch" style="margin-left: 10px;">Avbryt</button>
    </div>

    <div v-else>
      <p style="color: red;">Användare med ID "{{ deleteUserId }}" hittades inte.</p>
      <button @click="cancelDeleteSearch">Avbryt</button>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>

    <!-- Column 2 -->
    <div class="column column-2">
      <img class="profile-pic" src="https://i.pravatar.cc/100" alt="Profilbild" />
      <div class="user-info" v-if="user">
        <p><strong>Användarnamn:</strong> {{ user.username }}</p>
        <p>
          <strong>Roll:</strong>
          {{ user?.role && user.role !== 'none' ? user.role : 'Väntar på admins godkännande' }}
        </p>
      </div>
      <button @click="logout" class="logout-btn">Logga ut</button>
    </div>

    <!-- Column 3 -->
    <div class="column column-3">
      <!-- Todo-tabben -->
      <div v-if="activeTab === 'todo'">
        <table v-if="todos.length" class="todo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Done</th>
              <th>Owner</th>
              <th>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="todo in todos" :key="todo.id">
              <td>{{ todo.id }}</td>
              <td>
                <template v-if="editingId === todo.id">
                  <input v-model="todo.task" />
                </template>
                <template v-else>
                  {{ todo.task }}
                </template>
              </td>
              <td>
                <template v-if="editingId === todo.id">
                  <input type="checkbox" v-model="todo.done" />
                </template>
                <template v-else>
                  {{ todo.done ? '✅' : '❌' }}
                </template>
              </td>
              <td>{{ todo.ownerId }}</td>
              <td class="actions">
                <button @click="startEditing(todo)">
                  {{ editingId === todo.id ? 'Spara' : 'Redigera' }}
                </button>
                <button @click="deleteTodo(todo.id)">Ta bort</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Här kan du lägga till mer information eller annat innehåll.</p>
      </div>

      <!-- Users-tabben -->
      <div v-else-if="activeTab === 'users'">
        <h3>👥 Användare</h3>
        <table class="todo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Användarnamn</th>
              <th>Roll</th>
              <th>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
  <tr v-for="u in users" :key="u.id">
    <td>{{ u.id }}</td>
    <td>{{ u.username }}</td>
    <td>
      <template v-if="editingUserId === u.id && u.id !== '1'">
        <select v-model="u.role" class="role-select">
          <option value="none">none</option>
          <option value="user">user</option>
          <option value="usp">usp</option>
          <option value="dataadmin">dataadmin</option>
          <option value="admin">admin</option>
        </select>
      </template>
      <template v-else>
        {{ u.role }}
      </template>
    </td>
    <td>
      <template v-if="u.id === '1'">
        <span style="color: gray; font-style: italic;">Ej ändringsbar</span>
      </template>
      <template v-else>
        <template v-if="editingUserId === u.id">
          <button class="btn save" @click="saveRole(u)">Spara</button>
          <button class="btn cancel" @click="cancelEdit()">Avbryt</button>
        </template>
        <template v-else>
          <button class="btn edit" @click="startEdit(u.id)">Ändra</button>
          <button class="btn delete" @click="deleteUser(u.id)">🗑️</button>
        </template>
      </template>
    </td>
  </tr>
</tbody>



        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface User {
  username: string;
  role: string;
}

interface Todo {
  id: number;
  task: string;
  done: boolean;
  ownerId: string;
}

const user = ref<User | null>(null);
const todos = ref<Todo[]>([]);
const editingId = ref<number | null>(null);

const task = ref('');
const done = ref(false);
const id = ref('');
const updatedTask = ref('');
const updatedDone = ref(false);

const activeTab = ref<'todo' | 'users'>('todo');

const newUser = ref({ username: '', password: '', role: 'user' });
const logMessages = ref<string[]>([]);
const users = ref<Array<{ id: string; username: string; role: string }>>([]);

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ------------------ AUTH ------------------

async function fetchUser() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const res = await fetch('http://localhost:3001/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) user.value = await res.json();
}

async function fetchUsers() {
  const res = await fetch('http://localhost:3001/api/auth/users', {
    headers: headers(),
  });
  users.value = await res.json();
}

async function registerUser() {
  await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(newUser.value),
  });
  logMessages.value.unshift(`➕ Ny användare tillagd: ${newUser.value.username}`);
  newUser.value = { username: '', password: '', role: 'user' };
  await fetchUsers();
}

function logout() {
  localStorage.clear();
  alert('Du är utloggad!');
  window.location.reload();
}

// ------------------ TODO ------------------

async function postTodo() {
  await fetch('http://localhost:3002/api/data/todos', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ task: task.value, done: done.value }),
  });
  await getAll();
}

async function getAll() {
  const res = await fetch('http://localhost:3002/api/data/todos', {
    headers: headers(),
  });
  todos.value = await res.json();
}

async function getMine() {
  const res = await fetch('http://localhost:3002/api/data/todos/mine', {
    headers: headers(),
  });
  todos.value = await res.json();
}

async function getById() {
  const res = await fetch(`http://localhost:3002/api/data/todos/${id.value}`, {
    headers: headers(),
  });
  const single = await res.json();
  todos.value = Array.isArray(single) ? single : [single];
}

async function putById() {
  await fetch(`http://localhost:3002/api/data/todos/${id.value}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ task: updatedTask.value, done: updatedDone.value }),
  });
  await getAll();
}

async function deleteById() {
  await fetch(`http://localhost:3002/api/data/todos/${id.value}`, {
    method: 'DELETE',
    headers: headers(),
  });
  await getAll();
}

async function deleteAll() {
  await fetch('http://localhost:3002/api/data/delall', {
    method: 'DELETE',
    headers: headers(),
  });
  todos.value = [];
}

function startEditing(todo: Todo) {
  if (editingId.value === todo.id) {
    fetch(`http://localhost:3002/api/data/todos/${todo.id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ task: todo.task, done: todo.done }),
    }).then(() => getAll());
    editingId.value = null;
  } else {
    editingId.value = todo.id;
  }
}

function deleteTodo(todoId: number) {
  fetch(`http://localhost:3002/api/data/todos/${todoId}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(() => getAll());
}

// ------------------ USER ROLLER ------------------

const editingUserId = ref<string | null>(null);

function startEdit(userId: string) {
  if (userId !== '1') editingUserId.value = userId;
}

function cancelEdit() {
  editingUserId.value = null;
}

async function saveRole(user: { id: string; role: string }) {
  if (!user.id || user.id === '1') return;

  try {
    const res = await fetch(`http://localhost:3001/api/auth/users/${user.id}/role`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ role: user.role }),
    });

    if (res.ok) {
      logMessages.value.unshift(`🛠️ Roll uppdaterad för ${user.id} till ${user.role}`);
      await fetchUsers();
      editingUserId.value = null;
      alert('Roll uppdaterad!');
    } else {
      alert('Misslyckades att uppdatera rollen.');
    }
  } catch (error) {
    console.error('Fel vid sparning:', error);
    alert('Fel vid sparning av roll.');
  }
}

async function updateRole(userId: string, newRole: string) {
  if (userId === '1') return;
  await fetch(`http://localhost:3001/api/auth/users/${userId}/role`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ role: newRole }),
  });
  logMessages.value.unshift(`🛠️ Roll uppdaterad för ${userId} till ${newRole}`);
  await fetchUsers();
}

async function deleteUser(userId: string) {
  if (userId === '1') return;
  await fetch(`http://localhost:3001/api/auth/users/${userId}`, {
    method: 'DELETE',
    headers: headers(),
  });
  logMessages.value.unshift(`🗑️ Användare ${userId} borttagen`);
  await fetchUsers();
}

// ------------------ SÖK ------------------

const searchUserId = ref('');
const searchedUser = ref<{ id: string; username: string; role: string } | null>(null);
const searchPerformed = ref(false);

async function searchUserById() {
  if (!searchUserId.value.trim()) {
    alert('Ange ett användar-ID att söka.');
    return;
  }

  await fetchUsers();
  const found = users.value.find(u => u.id === searchUserId.value.trim());

  searchedUser.value = found ? { ...found } : null;
  searchPerformed.value = true;
}

async function saveSearchedUserRole() {
  if (!searchedUser.value || searchedUser.value.id === '1') return;

  try {
    const res = await fetch(`http://localhost:3001/api/auth/users/${searchedUser.value.id}/role`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ role: searchedUser.value.role }),
    });

    if (res.ok) {
      logMessages.value.unshift(`🛠️ Roll uppdaterad för ${searchedUser.value.id} till ${searchedUser.value.role}`);
      await fetchUsers();
      alert('Roll uppdaterad!');
      searchedUser.value = null;
      searchUserId.value = '';
      searchPerformed.value = false;
    } else {
      alert('Misslyckades att uppdatera rollen.');
    }
  } catch (error) {
    console.error('Fel vid sparning:', error);
    alert('Fel vid sparning av roll.');
  }
}
function cancelSearch() {
  searchedUser.value = null;
  searchUserId.value = '';
  searchPerformed.value = false;
}

// ------------------ INIT ------------------
//_________CONTINAER 4 
const deleteUserId = ref('');
const userToDelete = ref<{ id: string; username: string; role: string } | null>(null);
const deleteSearchPerformed = ref(false);

async function searchUserToDelete() {
  if (!deleteUserId.value.trim()) {
    alert('Ange ett ID att ta bort.');
    return;
  }

  await fetchUsers(); // ser till att vi har senaste listan
  const found = users.value.find(u => u.id === deleteUserId.value.trim());

  userToDelete.value = found ? { ...found } : null;
  deleteSearchPerformed.value = true;
}

function cancelDeleteSearch() {
  deleteUserId.value = '';
  userToDelete.value = null;
  deleteSearchPerformed.value = false;
}

async function confirmDeleteUser(userId: string) {
  if (!userId || userId === '1') return;

  const confirmed = confirm(`Är du säker på att du vill ta bort användaren med ID ${userId}?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:3001/api/auth/users/${userId}`, {
      method: 'DELETE',
      headers: headers(),
    });

    if (res.ok) {
      logMessages.value.unshift(`🗑️ Användare ${userId} borttagen`);
      await fetchUsers();
      cancelDeleteSearch();
      alert(`Användare med ID ${userId} har tagits bort.`);
    } else {
      alert('Kunde inte ta bort användaren.');
    }
  } catch (err) {
    console.error(err);
    alert('Något gick fel vid borttagning.');
  }
}

onMounted(() => {
  fetchUser();
  fetchUsers();
});
</script>


<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, auto);
  gap: 20px;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.column-1 {
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  font-size: 1.2rem;
  gap: 20px;
}

.GetBtns,
.Delbuttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.admin-section {
  background-color: #f9fafb;
  border: 1.5px solid #d3d9df;
  border-radius: 10px;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin: 10px;
  box-sizing: border-box;
}

.admin-section h3 {
  margin: 0 0 10px 0;
  font-weight: 700;
  font-size: 1.3rem;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #fefefe;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
select:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.admin-controls button {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border: none;
  font-weight: bold;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  width: fit-content;
  max-width: 140px;
}

.admin-controls button:hover {
  background-color: #45a049;
}

.column-2 {
  grid-column: 4 / span 2;
  grid-row: 1 / span 3;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px auto;
  border: 2px solid #4caf50;
}

.user-info {
  width: 100%;
  text-align: left;
  margin-top: 10px;
}

.user-info p {
  margin: 5px 0;
  font-size: 1.2rem;
}

.logout-btn {
  position: absolute;
  top: 12px;
  right: 20px;
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.column-3 {
  grid-column: 1 / span 5;
  grid-row: 4 / span 2;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  font-size: 1.1rem;
  color: #555;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  min-height: 300px;
}

.todo-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.todo-table th,
.todo-table td {
  border: 1px solid #ccc;
  padding: 14px 18px;
  text-align: left;
  font-size: 1rem;
  background-color: #fff;
}

.todo-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 14px;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.actions button:first-child {
  background-color: #007bff;
  color: white;
}

.actions button:last-child {
  background-color: #dc3545;
  color: white;
}

.actions button:hover:first-child {
  background-color: #0056b3;
}

.actions button:hover:last-child {
  background-color: #b02a37;
}

.admin-tabs {
  grid-column: 1 / -1;
  display: flex;
  gap: 5px;
  margin-bottom: -9px;
  margin-left: 16px;
}

.admin-tabs div {
  padding: 10px 16px;
  cursor: pointer;
  background: #eee;
  border-radius: 8px 8px 0 0;
  border: 1px solid #ccc;
  font-weight: bold;
}

.admin-tabs .active {
  background: rgb(19, 155, 214);
  border-bottom: none;
}

.users-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 20px;
}

.container1 {
  grid-column: 1;
  grid-row: 1;
}

.container2 {
  grid-column: 2;
  grid-row: 1 / span 3;
  max-height: 100%;
  overflow-y: auto;
}

.container2 ul {
  list-style: disc inside;
  padding-left: 0;
  font-size: 1.4rem; /* <-- större text */
  line-height: 1.8; 
  max-height: 580px;
  overflow-y: auto;
}

.container2 button {
  background-color: #f44336;
  color: white;
  padding: 8px 14px;
  font-weight: bold;
  font-size: 0.95rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  width: fit-content;
  border: none;
}

.container2 button:hover {
  background-color: #d32f2f;
}

.container3 {
  grid-column: 1;
  grid-row: 2;
}

.container4 {
  grid-column: 1;
  grid-row: 3;
}

.btn {
  padding: 6px 14px;
  margin-right: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
  color: white;
  user-select: none;
}

.btn.edit {
  background-color: #007bff;
}

.btn.edit:hover {
  background-color: #0056b3;
}

.btn.delete {
  background-color: #dc3545;
}

.btn.delete:hover {
  background-color: #b02a37;
}

.btn.save {
  background-color: #28a745;
}

.btn.save:hover {
  background-color: #1e7e34;
}

.btn.cancel {
  background-color: #9e9e9e;
}

.btn.cancel:hover {
  background-color: #7e7e7e;
}

.role-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

/* Justerade sök- & registerknappar */
.container1 button,
.container3 button,
.container4 button {
  background-color: #2196f3;
  color: white;
  padding: 8px 14px;
  font-weight: bold;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: fit-content;
  border: none;
}

.container1 button:hover,
.container3 button:hover,
.container4 button:hover {
  background-color: #1976d2;
}

.container3 button[style*="gray"],
.container4 button[style*="gray"],
.container4 button:disabled {
  background-color: #9e9e9e !important;
  cursor: not-allowed;
  opacity: 0.85;
}

.container3 button[style*="gray"]:hover,
.container4 button[style*="gray"]:hover {
  background-color: #7e7e7e !important;
}

.container3 input,
.container4 input,
.container1 input,
.container1 select {
  margin-bottom: 10px;
}
</style>
