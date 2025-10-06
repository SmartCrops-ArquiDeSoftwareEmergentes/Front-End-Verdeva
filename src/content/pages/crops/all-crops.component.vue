<template>
  <div class="individual-crop" @click="closeOptions">
    <button class="btn-return" @click="goBack">
      <img src="/general-icons/return-icon.png" alt="Regresar"/>
    </button>
    <h2 class="section-title">
      Cultivos de <span class="crop-name">{{ campoName }}</span>
    </h2>
    <div class="cultivation-list">
      <div
        v-for="cultivo in cultivos"
        :key="cultivo.id"
        class="cultivation-card"
        @click="goToDetail(cultivo.id)"
      >
        <div class="card-header">
          <img src="/general-icons/crop-icon.png" alt="Cultivo" class="crop-icon"/>
          <div class="edit-btn" @click.stop="toggleOptions(cultivo.id)">
            <img src="/general-icons/edit-icon.png" alt="Editar" />
            <div v-if="showOptions === cultivo.id" class="options-dropdown" @click.stop>
              <button class="option-btn edit-option" @click="editCultivo(cultivo.id)">
                <img src="/general-icons/edit-icon.png" alt="Editar" />
                Editar
              </button>
              <button class="option-btn delete-option" @click="deleteCultivo(cultivo.id)">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="cultivation-info">
            <h3 class="cultivation-title">{{ cultivo.name }}</h3>
            <p>Fecha de siembra: {{ cultivo.date }}</p>
            <p>Días desde siembra: {{ cultivo.days }} días</p>
            <p>Dispositivos IoT: {{ cultivo.devices }} conectados</p>
          </div>
        </div>
      </div>
    </div>
    <button class="add-button" @click="goToAdd">
      <img src="/general-icons/add-icon.png" alt="Agregar"/>
    </button>

    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>¿Deseas eliminar el cultivo "{{ cultivoToDelete?.name }}"?</h3>
        <p>Esta acción no puede deshacerse.</p>
        <div class="modal-buttons">
          <button class="cancel-btn" @click="closeDeleteModal">Cancelar</button>
          <button class="confirm-btn" @click="confirmDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const campoName = 'Campo Huancayo - 1';
const cultivos = ref([]);
const showOptions = ref(null);
const showDeleteModal = ref(false);
const cultivoToDelete = ref(null);

const loadCrops = () => {
  const storedCrops = localStorage.getItem('cultivos');
  cultivos.value = storedCrops ? JSON.parse(storedCrops) : [];
  console.log('Cultivos cargados:', cultivos.value);
};

onMounted(() => {
  loadCrops();
});

const toggleOptions = id => {
  showOptions.value = showOptions.value === id ? null : id
}

const closeOptions = () => {
  showOptions.value = null
}

const editCultivo = id => {
  const selectedCrop = cultivos.value.find(c => c.id === id);
  if (selectedCrop) {
    router.push(`/edit-crop/${id}`);
  }
};

const deleteCultivo = id => {
  cultivoToDelete.value = cultivos.value.find(c => c.id === id)
  showDeleteModal.value = true
  closeOptions()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  cultivoToDelete.value = null
}

const confirmDelete = () => {
  if (cultivoToDelete.value) {
    const updatedCrops = cultivos.value.filter(c => c.id !== cultivoToDelete.value.id);
    localStorage.setItem('cultivos', JSON.stringify(updatedCrops));
    cultivos.value = updatedCrops; // Actualizar la UI
  }
  closeDeleteModal()
}

const goBack = () => {
  router.push('/fields')
}

const goToAdd = () => {
  router.push('/crops/create');
}

const goToDetail = id => {
  router.push(`/individual-crop/${id}`);
};
</script>

<style scoped>
.individual-crop {
  position: relative;
  padding: 70px;
}
.btn-return {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 50px;
  height: 50px;
  background-color: #004225;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-return img {
  width: 20px;
  height: 20px;
}
.section-title {
  font-size: 30px;
  color: #004225;
  margin: 16px 0;
}
.crop-name {
  color: #917529;
}
.cultivation-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.cultivation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 520px;
  cursor: pointer;
  position: relative;
}
.card-header {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 16px;
}
.crop-icon {
  width: 150px;
  height: 150px;
}
.card-body {
  padding: 16px;
}
.cultivation-info {
  display: flex;
  flex-direction: column;
}
.cultivation-title {
  font-size: 25px;
  color: #004225;
  margin-bottom: 4px;
}
.cultivation-info p {
  font-size: 18px;
  color: #333;
  margin: 2px 0;
}
.edit-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background-color: #004225;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
}
.edit-btn img {
  width: 20px;
  height: 20px;
}
.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #004225;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid #004225;
  overflow: hidden;
  margin-top: 8px;
  min-width: 140px;
  z-index: 100;
}
.option-btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: #004225;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s;
}
.option-btn:hover {
  background: #005530;
}
.edit-option {
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.delete-option:hover {
  background: #dc3545;
}
.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background-color: #004225;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.add-button img {
  width: 24px;
  height: 24px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  text-align: center;
}
.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.cancel-btn {
  padding: 12px 24px;
  border: 2px solid #004225;
  background: white;
  color: #004225;
  border-radius: 8px;
  cursor: pointer;
}
.confirm-btn {
  padding: 12px 24px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
