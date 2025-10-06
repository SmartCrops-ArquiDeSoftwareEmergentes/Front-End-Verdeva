<template>
  <div class="all-crops" @click="closeOptions">
    <h2 class="section-title">Tus Campos Agrícolas</h2>
    <div class="crops-list">
      <div
          v-for="campo in campos"
          :key="campo.id"
          class="crop-card"
          @click="goToIndividual"
      >
        <div class="card-header">
          <img
              src="/general-icons/field-icon.png"
              alt="Campo"
              class="field-icon"
          />
          <div class="edit-btn" @click.stop="toggleOptions(campo.id)">
            <img src="/general-icons/edit-icon.png" alt="Editar" />
            <div v-if="showOptions === campo.id" class="options-dropdown" @click.stop>
              <button class="option-btn edit-option" @click="editField(campo.id)">
                <img src="/general-icons/edit-icon.png" alt="Editar" />
                Editar
              </button>
              <button class="option-btn delete-option" @click="deleteField(campo.id)">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h3 class="crop-title">{{ campo.name }}</h3>
          <p>Hectáreas: {{ campo.hectareas }}</p>
          <p>Cultivos: {{ campo.cultivos }}</p>
          <p>Estado: {{ campo.estado }}</p>
        </div>
      </div>
    </div>
    <button class="add-button" @click="goToNew">+</button>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>¿Deseas eliminar el "{{ fieldToDelete?.name }}"?</h3>
        <p>Ten en cuenta que los cultivos y dispositivos conectados se eliminarán (Esta acción no puede deshacerse).</p>
        <div class="modal-buttons">
          <button class="cancel-btn" @click="closeDeleteModal">Cancelar</button>
          <button class="confirm-btn" @click="confirmDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showOptions = ref(null)
const showDeleteModal = ref(false)
const fieldToDelete = ref(null)

// Default data
const defaultCampos = [
  { id: 1, name: 'Campo Huancayo - 1', hectareas: 5, cultivos: 'Papa, Camote', estado: 'Activo' },
  { id: 2, name: 'Campo Huancayo - 2', hectareas: 12, cultivos: 'Lechuga', estado: 'Activo' },
  { id: 3, name: 'Campo Huancayo - 3', hectareas: 4, cultivos: 'Yuca, Papa', estado: 'Activo' }
]

const campos = ref([])

// Load data from localStorage or use default
const loadCampos = () => {
  try {
    const stored = localStorage.getItem('campos')
    if (stored) {
      campos.value = JSON.parse(stored)
      console.log('Loaded campos from localStorage:', campos.value)
    } else {
      campos.value = [...defaultCampos]
      localStorage.setItem('campos', JSON.stringify(defaultCampos))
      console.log('No localStorage data, using defaults:', campos.value)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    campos.value = [...defaultCampos]
    localStorage.setItem('campos', JSON.stringify(defaultCampos))
  }
}

onMounted(() => {
  loadCampos()
})

// Refresh data when component becomes active (e.g., when navigating back)
onActivated(() => {
  loadCampos()
})

const toggleOptions = (id) => {
  showOptions.value = showOptions.value === id ? null : id
}

const closeOptions = () => {
  showOptions.value = null
}

const editField = (id) => {
  closeOptions()
  router.push(`/edit-field/${id}`)
}

const deleteField = (id) => {
  const field = campos.value.find(campo => campo.id === id)
  fieldToDelete.value = field
  showDeleteModal.value = true
  closeOptions()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  fieldToDelete.value = null
}

const confirmDelete = () => {
  if (fieldToDelete.value) {
    campos.value = campos.value.filter(campo => campo.id !== fieldToDelete.value.id)
    // Save updated list to localStorage
    localStorage.setItem('campos', JSON.stringify(campos.value))
  }
  closeDeleteModal()
}

const goToNew = () => {
  router.push('/create-field')
}

// Navigate to the individual crop view
const goToIndividual = () => {
  router.push('/crops')
}
</script>

<style scoped>
.all-crops {
  position: relative;
  padding: 30px;
}
.section-title {
  font-size: 24px;
  color: #004225;
  margin-bottom: 16px;
}
.crops-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
/* make entire card clickable */
.crop-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 320px;
  padding: 16px;
  cursor: pointer;
}
.card-header {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}
.field-icon {
  width: 200px;
  height: 200px;
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

/* Options Dropdown Styles */
.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #004225;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.edit-option img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}
.delete-option {
  color: white;
}
.delete-option:hover {
  background: #dc3545;
}
.crop-title {
  font-size: 26px;
  color: #004225;
  margin-bottom: 8px;
}
.card-body p {
  font-size: 24px;
  color: #333;
  margin: 4px 0;
}
.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #004225;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Delete Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.modal-content h3 {
  font-size: 20px;
  color: #004225;
  margin: 0 0 16px 0;
  font-weight: 600;
}
.modal-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 24px 0;
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
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cancel-btn:hover {
  background: #f5f5f5;
}
.confirm-btn {
  padding: 12px 24px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.confirm-btn:hover {
  background: #c82333;
}
</style>
