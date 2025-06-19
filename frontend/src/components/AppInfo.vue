<template>
  <div class="card">
    <h3>Om Appen</h3>
    <div class="form-body">
      <p>
        Den här applikationen låter dig registrera ett konto och logga in för att hantera dina uppgifter. 
        Den är byggd med Vue 3 och har ett enkelt, modernt gränssnitt med säker hantering av användarinformation.
      </p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 9px;
  background: rgba(255, 255, 255, 0.368); /* Lägre alpha ger mer glas-effekt */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  min-height: 100px;
  color: #333;
  border: 1px solid rgba(255, 255, 255, 0.2); /* tunt vitt glas-aktigt kant */
}


h3 {
  margin-top: 20px;
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
}

.form-body {
  margin-bottom: 36px;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
}
</style>
