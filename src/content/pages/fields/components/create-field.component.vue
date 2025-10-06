<template>
  <div class="create-crop">
    <h2 class="section-title">Tus Campos Agrícolas</h2>
    <button class="btn-return" @click="goBack">
      <img src="/general-icons/return-icon.png" alt="Regresar"/>
    </button>
    <h3 class="sub-title">Nuevo Campo:</h3>
    <div class="form-card">
      <div class="card-header">
        <img src="/general-icons/field-icon.png" alt="Campo" class="field-icon"/>
      </div>
      <div class="form-body">
        <div class="form-row">
          <label>Nombre:</label>
          <input type="text" v-model="name"/>
        </div>
        <div class="form-row">
          <label>Hectáreas:</label>
          <input type="text" v-model="hectareas"/>
        </div>
        <div class="form-row">
          <label>Estado:</label>
          <input type="text" v-model="estado"/>
        </div>
      </div>
    </div>
    <button class="btn-submit" @click="saveCrop">
      <img src="/general-icons/check-icon.png" alt="Guardar"/>
    </button>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✓</div>
        <h3>¡Campo creado exitosamente!</h3>
        <button class="ok-btn" @click="closeSuccessModal">OK</button>
      </div>
    </div>

    <!-- Validation Error Modal -->
    <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
      <div class="modal-content" @click.stop>
        <div class="error-icon">⚠️</div>
        <h3>Error de Validación</h3>
        <p>{{ errorMessage }}</p>
        <button class="ok-btn" @click="closeErrorModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const name = ref('')
const hectareas = ref('')
const estado = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Default data for consistency
const defaultCampos = [
  { id: 1, name: 'Campo Huancayo - 1', hectareas: 5, cultivos: 'Papa, Camote', estado: 'Activo' },
  { id: 2, name: 'Campo Huancayo - 2', hectareas: 12, cultivos: 'Lechuga', estado: 'Activo' },
  { id: 3, name: 'Campo Huancayo - 3', hectareas: 4, cultivos: 'Yuca, Papa', estado: 'Activo' }
]

const goBack = () => router.push('/fields')

const validateFields = () => {
  if (!name.value || !hectareas.value || !estado.value) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    showErrorModal.value = true
    return false
  }

  if (!/^[a-zA-Z\s]+$/.test(name.value)) {
    errorMessage.value = 'El nombre solo debe contener letras.'
    showErrorModal.value = true
    return false
  }

  if (isNaN(parseFloat(hectareas.value))) {
    errorMessage.value = 'Las hectáreas deben ser un número válido.'
    showErrorModal.value = true
    return false
  }

  if (!/^[a-zA-Z\s]+$/.test(estado.value)) {
    errorMessage.value = 'El estado solo debe contener letras.'
    showErrorModal.value = true
    return false
  }

  return true
}

const saveCrop = () => {
  if (!validateFields()) {
    return
  }

  // Get existing fields from localStorage or use default
  let existingFields = []
  try {
    const stored = localStorage.getItem('campos')
    if (stored) {
      existingFields = JSON.parse(stored)
      console.log('Existing fields from localStorage:', existingFields)
    } else {
      // If no localStorage data, start with defaults
      existingFields = [...defaultCampos]
      localStorage.setItem('campos', JSON.stringify(existingFields))
      console.log('No localStorage data, using defaults:', existingFields)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    existingFields = [...defaultCampos]
    localStorage.setItem('campos', JSON.stringify(existingFields))
  }
  
  // Generate new ID (highest existing ID + 1)
  const newId = existingFields.length > 0 ? Math.max(...existingFields.map(campo => campo.id)) + 1 : 1
  console.log('Generated new ID:', newId)
  
  // Create new field object
  const newField = {
    id: newId,
    name: name.value,
    hectareas: parseInt(hectareas.value),
    estado: estado.value,
    cultivos: '' // Empty cultivos for new field
  }
  
  // Add new field to existing fields
  existingFields.push(newField)
  
  // Save to localStorage
  localStorage.setItem('campos', JSON.stringify(existingFields))
  
  console.log('New field created:', newField)
  console.log('All fields after creation:', existingFields)
  
  // Show success modal
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Navigate back to fields list after closing modal
  router.push('/fields')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}
</script>

<style scoped>
.create-crop {
  position: relative;
  padding: 70px;
}
.section-title {
  font-size: 30px;
  color: #004225;
  margin-bottom: 16px;
}
.btn-return {
  position: absolute;
  top: 20px;
  left: 20px;
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
.sub-title {
  font-size: 20px;
  color: #004225;
  margin: 16px 0;
}
.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  padding: 16px;
}
.card-header {
  padding-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.field-icon {
  width: 320px;
  height: 320px;
}
.form-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 42px;
}
.form-row {
  display: flex;
  align-items: center;
}
.form-row label {
  width: 140px;
  font-size: 26px;
  color: #004225;
}
.form-row input {
  flex: 1;
  border: 1px solid #004225;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}
.btn-submit {
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
.btn-submit img {
  width: 24px;
  height: 24px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  padding-bottom: 48px; /* Add extra padding to push the button lower */
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.success-icon {
  font-size: 48px;
  color: #22c55e;
  margin-bottom: 16px;
}

.error-icon {
  font-size: 48px;
  color: #e63946;
  margin-bottom: 16px;
}

.modal-content h3 {
  color: #004225;
  margin-bottom: 24px;
  font-size: 20px;
}

.ok-btn {
  background: #004225;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 16px; /* Add margin to separate the button from the content */
}

.ok-btn:hover {
  background: #005a2f;
}
</style>
