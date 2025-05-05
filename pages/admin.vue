<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center text-green-700 mb-8">
        Add Compliments for Sophia
      </h1>
  
      <!-- Login Form -->
      <div v-if="!isAuthenticated" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-600">Login to Admin Panel</h2>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2" for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your password"
          />
        </div>
        <button 
          @click="login" 
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="mt-4 text-red-500 text-sm">{{ error }}</p>
      </div>
  
      <!-- Admin Panel -->
      <div v-else class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-green-600">Add New Compliment</h2>
          <button 
            @click="logout" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
  
        <!-- Add Compliment Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="message">Compliment Message</label>
            <textarea 
              id="message"
              v-model="newCompliment.message" 
              rows="4" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write a sweet message for Sophia..."
            ></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 mb-2" for="date">Date</label>
            <input 
              id="date"
              v-model="newCompliment.date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button 
            @click="addCompliment" 
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Adding...' : 'Add Compliment' }}
          </button>
        </div>
  
        <!-- Compliments List -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4 text-green-600">Your Compliments</h3>
          <div v-if="compliments.length === 0" class="text-gray-500 text-center py-4">
            No compliments added yet. Start adding some sweet messages for Sophia!
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="compliment in compliments" :key="compliment.id" class="py-4">
              <div class="flex justify-between">
                <div>
                  <p class="text-gray-700">{{ compliment.message }}</p>
                  <div class="flex items-center mt-1">
                    <p class="text-sm text-gray-500 mr-4">{{ formatDate(compliment.date) }}</p>
                    <span 
                      :class="compliment.viewed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" 
                      class="px-2 py-1 text-xs rounded-full"
                    >
                      {{ compliment.viewed ? 'Viewed' : 'Not viewed' }}
                    </span>
                  </div>
                </div>
                <button 
                  @click="deleteCompliment(compliment.id)" 
                  class="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
  
        <div class="mt-6 text-center">
          <NuxtLink 
            to="/" 
            class="text-green-600 hover:underline"
          >
            View Sophia's Tree
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
  } from 'firebase/auth'
  import { 
    ref as dbRef, 
    push, 
    remove, 
    onValue, 
    off 
  } from 'firebase/database'
  import { useNuxtApp } from '#app'
  
  const { $auth, $database } = useNuxtApp()
  
  // Authentication state
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref('')
  const email = ref('')
  const password = ref('')
  
  // Compliments state
  const compliments = ref([])
  const newCompliment = ref({
    message: '',
    date: new Date().toISOString().split('T')[0],
    viewed: false
  })
  const isSubmitting = ref(false)
  
  let unsubscribeAuth = null;
  let unsubscribeCompliments = null;
  
  // Check authentication state on mount
  onMounted(() => {
    unsubscribeAuth = onAuthStateChanged($auth, (user) => {
      isAuthenticated.value = !!user
      
      if (isAuthenticated.value) {
        loadCompliments()
      } else {
        if (unsubscribeCompliments) {
          unsubscribeCompliments()
        }
        compliments.value = []
      }
    })
    
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth()
      }
      if (unsubscribeCompliments) {
        unsubscribeCompliments()
      }
    }
  })
  
  // Load compliments from Firebase
  const loadCompliments = () => {
    const complimentsRef = dbRef($database, 'compliments')
    unsubscribeCompliments = onValue(complimentsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        compliments.value = Object.keys(data).map(key => ({
          id: key,
          viewed: data[key].viewed || false,
          ...data[key]
        }))
      } else {
        compliments.value = []
      }
    })
  }
  
  // Authentication methods
  const login = async () => {
    if (!email.value || !password.value) {
      error.value = 'Please enter both email and password'
      return
    }
    
    isLoading.value = true
    error.value = ''
    
    try {
      await signInWithEmailAndPassword($auth, email.value, password.value)
      isAuthenticated.value = true
    } catch (err) {
      error.value = err.message || 'Failed to login'
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await signOut($auth)
      isAuthenticated.value = false
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
  
  // Compliment methods
  const addCompliment = async () => {
    if (!newCompliment.value.message || !newCompliment.value.date) {
      alert('Please fill in both message and date')
      return
    }
    
    isSubmitting.value = true
    
    try {
      const complimentsRef = dbRef($database, 'compliments')
      await push(complimentsRef, {
        message: newCompliment.value.message,
        date: newCompliment.value.date,
        viewed: false,
        position: null // Initialize position as null
      })
      
      // Reset form
      newCompliment.value = {
        message: '',
        date: new Date().toISOString().split('T')[0],
        viewed: false
      }
    } catch (err) {
      console.error('Error adding compliment:', err)
      alert('Failed to add compliment')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const deleteCompliment = async (id) => {
    if (!confirm('Are you sure you want to delete this compliment?')) {
      return
    }
    
    try {
      const complimentRef = dbRef($database, `compliments/${id}`)
      await remove(complimentRef)
    } catch (err) {
      console.error('Error deleting compliment:', err)
      alert('Failed to delete compliment')
    }
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  </script>
  