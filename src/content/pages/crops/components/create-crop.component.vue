<template>
  <div class="edit-crop">
    <button class="btn-return" @click="goBack">
      <img src="/general-icons/return-icon.png" alt="Regresar" />
    </button>
    <h2 class="section-title">Nuevo Cultivo</h2>
    <div class="edit-form">
      <img src="/general-icons/crop-icon.png" alt="Cultivo" class="crop-icon" />
      <div class="form-fields">
        <label>Fecha de Siembra:</label>
        <input v-model="crop.date" type="text" />

        <label>Etapa de crecimiento:</label>
        <input v-model="crop.stage" type="text" />

        <label>Cantidad:</label>
        <input v-model="crop.quantity" type="text" />

        <label>Nombre de Cultivo:</label>
        <input v-model="crop.name" type="text" />
      </div>
    </div>
    <button class="btn-save" @click="saveCrop">
      <img src="/general-icons/check-icon.png" alt="Guardar" />
    </button>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ modalMessage }}</h3>
        <button class="confirm-btn" @click="closeModal">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const crop = ref({
  date: '',
  stage: '',
  quantity: '',
  name: ''
});

const showModal = ref(false);
const modalMessage = ref('');

const goBack = () => router.push('/crops');

const saveCrop = () => {
  if (!crop.value.date || !crop.value.stage || !crop.value.quantity || !crop.value.name) {
    modalMessage.value = 'Por favor, completa todos los campos antes de guardar.';
    showModal.value = true;
    return;
  }

  const storedCrops = localStorage.getItem('cultivos');
  const crops = storedCrops ? JSON.parse(storedCrops) : [];

  const newCrop = {
    ...crop.value,
    id: crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1 // Generar un ID único incremental
  };
  crops.push(newCrop);

  localStorage.setItem('cultivos', JSON.stringify(crops));

  modalMessage.value = 'Cultivo guardado exitosamente.';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  if (modalMessage.value === 'Cultivo guardado exitosamente.') {
    router.push('/crops');
  }
};
</script>

<style scoped>
.edit-crop {
  position: relative;
  padding: 30px;
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
}
.btn-return img {
  width: 30px;
  height: 30px;
}
.section-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.crop-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}
.form-fields label {
  font-weight: bold;
}
.form-fields input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn-save {
  margin-top: 20px;
  background-color: #004225;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-save img {
  width: 30px;
  height: 30px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.confirm-btn {
  margin-top: 10px;
  background-color: #004225;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.confirm-btn:hover {
  background-color: #006837;
}
</style>
