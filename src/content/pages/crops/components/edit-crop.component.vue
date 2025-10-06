<template>
  <div class="edit-crop">
    <button class="btn-return" @click="goBack">
      <img src="/general-icons/return-icon.png" alt="Regresar" />
    </button>
    <h2 class="section-title">Editar Cultivo</h2>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const cropId = parseInt(route.params.id, 10);
const crop = ref({});

onMounted(() => {
  const storedCrops = localStorage.getItem('cultivos');
  const crops = storedCrops ? JSON.parse(storedCrops) : [];
  crop.value = crops.find(c => c.id === cropId) || {};
});

const goBack = () => router.push('/crops');

const saveCrop = () => {
  const storedCrops = localStorage.getItem('cultivos');
  const crops = storedCrops ? JSON.parse(storedCrops) : [];
  const index = crops.findIndex(c => c.id === crop.value.id);
  if (index !== -1) {
    crops[index] = { ...crop.value };
    localStorage.setItem('cultivos', JSON.stringify(crops));
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
  cursor: pointer;
}
.btn-return img {
  width: 20px;
  height: 20px;
}
.section-title {
  font-size: 30px;
  color: #004225;
  margin: 50px 0 16px 0;
}
.edit-form {
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.crop-icon {
  width: 100px;
  height: 100px;
}
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%; /* Asegura que el contenedor de los inputs sea suficientemente ancho */
}
label {
  font-size: 18px;
  color: #004225;
}
input {
  padding: 8px;
  border: 1px solid #004225;
  border-radius: 8px;
  font-size: 16px;
  width: 80%; /* Ajusta el ancho de los inputs para que ocupen menos espacio */
}
.btn-save {
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.btn-save img {
  width: 24px;
  height: 24px;
}
</style>
