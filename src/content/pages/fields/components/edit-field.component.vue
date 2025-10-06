<template>
  <div class="edit-crop">
    <h2 class="section-title">Tus Campos Agrícolas</h2>
    <button class="btn-return" @click="onReturn">
      <img src="/general-icons/return-icon.png" alt="Regresar"/>
    </button>
    <h3 class="sub-title">Editar Campo:</h3>
    <div class="form-card">
      <div class="card-header">
        <img src="/general-icons/field-icon.png" alt="Campo" class="field-icon"/>
      </div>
      <div class="form-body">
        <label>Nombre:</label>
        <input type="text" v-model="name" />
        <label>Hectáreas:</label>
        <input type="text" v-model="hectareas" />
        <label>Estado:</label>
        <input type="text" v-model="estado" />
      </div>
    </div>
    <button class="btn-submit" @click="onSubmit">
      <img src="/general-icons/check-icon.png" alt="Guardar"/>
    </button>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✓</div>
        <h3>¡Campo actualizado exitosamente!</h3>
        <button class="ok-btn" @click="closeSuccessModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const name = ref('')
const hectareas = ref('')
const estado = ref('')
const showSuccessModal = ref(false)

// Mock data - same as in all-fields component
const defaultCampos = [
  { id: 1, name: 'Campo Huancayo - 1', hectareas: 5, cultivos: 'Papa, Camote', estado: 'Activo' },
  { id: 2, name: 'Campo Huancayo - 2', hectareas: 12, cultivos: 'Lechuga', estado: 'Activo' },
  { id: 3, name: 'Campo Huancayo - 3', hectareas: 4, cultivos: 'Yuca, Papa', estado: 'Activo' }
]

onMounted(() => {
  console.log('Route params:', route.params)
  const fieldId = parseInt(route.params.id)
  console.log('Field ID:', fieldId)
  
  // Load data from localStorage first, fallback to default if nothing exists
  let campos = []
  try {
    const stored = localStorage.getItem('campos')
    if (stored) {
      campos = JSON.parse(stored)
      console.log('Loaded from localStorage:', campos)
    } else {
      // If no localStorage data, set defaults and save them
      campos = defaultCampos
      localStorage.setItem('campos', JSON.stringify(defaultCampos))
      console.log('Using default data and saving to localStorage')
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    campos = defaultCampos
    localStorage.setItem('campos', JSON.stringify(defaultCampos))
  }
  
  const field = campos.find(campo => campo.id === fieldId)
  console.log('Found field:', field)
  console.log('All available campos:', campos)
  
  if (field) {
    name.value = field.name
    hectareas.value = field.hectareas.toString()
    estado.value = field.estado
    console.log('Field data loaded:', { name: name.value, hectareas: hectareas.value, estado: estado.value })
  } else {
    console.log('Field not found for ID:', fieldId)
    console.log('Available IDs:', campos.map(c => c.id))
    // If field not found, redirect back to fields list
    alert('Campo no encontrado')
    router.push('/fields')
  }
})

const onReturn = () => router.push('/fields')
const onSubmit = () => {
  // Get the field ID from the route
  const fieldId = parseInt(route.params.id)
  
  // Get existing fields from localStorage or use default
  let existingFields = []
  try {
    const stored = localStorage.getItem('campos')
    if (stored) {
      existingFields = JSON.parse(stored)
    } else {
      // If no stored data, use the default campos
      existingFields = defaultCampos
    }
  } catch {
    existingFields = defaultCampos
  }
  
  // Find the current field to preserve cultivos
  const currentField = existingFields.find(c => c.id === fieldId)
  
  // Create updated field object
  const updatedField = {
    id: fieldId,
    name: name.value,
    hectareas: parseInt(hectareas.value),
    estado: estado.value,
    cultivos: currentField?.cultivos || ''
  }
  
  // Update the specific field
  const fieldIndex = existingFields.findIndex(campo => campo.id === fieldId)
  if (fieldIndex !== -1) {
    existingFields[fieldIndex] = updatedField
  }
  
  // Save back to localStorage
  localStorage.setItem('campos', JSON.stringify(existingFields))
  
  console.log('Field updated successfully:', updatedField)
  
  // Show success modal instead of alert
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Navigate back to fields list after closing modal
  router.push('/fields')
}
</script>

<style scoped>
.edit-crop {
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
  font-size: 25px;
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
  gap: 12px;
}
.form-body label {
  font-size: 20px;
  color: #004225;
}
.form-body input {
  border: 1px solid #004225;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}
.btn-submit {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 76px;
  height: 76px;
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

/* Success Modal Styles */
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
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.success-icon {
  width: 60px;
  height: 60px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: white;
  font-weight: bold;
  margin: 0 auto 20px auto;
}
.modal-content h3 {
  font-size: 20px;
  color: #004225;
  margin: 0 0 24px 0;
  font-weight: 600;
}
.ok-btn {
  padding: 12px 32px;
  background: #004225;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.ok-btn:hover {
  background: #005530;
}
</style>
