<template>
    <div class="relative w-full h-[80vh] overflow-hidden tree-container bg-pink-50 rounded-xl shadow-lg">
      <!-- Cartoon Tree SVG based on reference image -->
      <svg class="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax meet">
        <!-- Grass at the base -->
        <path d="M300,600 C300,580 320,570 340,580 C360,590 380,580 400,570 C420,560 440,570 460,580 C480,590 500,580 500,600 Z" fill="#4ade80" />
        <path d="M350,600 C350,585 360,580 370,585 C380,590 390,585 400,580 C410,575 420,580 430,585 C440,590 450,585 450,600 Z" fill="#16a34a" />
        
        <!-- Tree trunk and roots -->
        <path d="M380,600 C360,550 350,500 370,450 C390,400 400,350 390,300 C380,250 370,200 380,150 C390,100 410,150 420,200 C430,250 440,300 430,350 C420,400 410,450 420,500 C430,550 440,600 440,600 Z" fill="#a87b6d" />
        <path d="M380,600 C370,580 360,560 350,550 C340,540 330,530 320,540 C310,550 300,560 290,570 C280,580 270,590 260,600 Z" fill="#8b5e4c" />
        <path d="M440,600 C450,580 460,560 470,550 C480,540 490,530 500,540 C510,550 520,560 530,570 C540,580 550,590 560,600 Z" fill="#8b5e4c" />
        
        <!-- Tree trunk details -->
        <path d="M390,500 C380,450 370,400 380,350 C390,300 400,250 390,200" fill="none" stroke="#8b5e4c" stroke-width="2" />
        <path d="M430,500 C420,450 410,400 420,350 C430,300 440,250 430,200" fill="none" stroke="#8b5e4c" stroke-width="2" />
      </svg>
      
      <!-- Leaves (compliments) -->
      <div>
        <div 
          v-for="(compliment, index) in compliments" 
          :key="compliment.id"
          class="absolute leaf cursor-grab transform transition-transform duration-300 hover:scale-110"
          :style="getLeafStyle(compliment, index)"
          @mousedown="(e) => startDrag(e, compliment)"
          @touchstart="(e) => startDrag(e, compliment)"
          @click="showCompliment(compliment)"
        >
          <div :class="getLeafSizeClass(index)" class="flex items-center justify-center">
            <!-- Leaf SVG -->
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <path 
                :d="getLeafShape(index)" 
                :fill="getLeafColor(index)" 
              />
              <!-- White vein in the middle -->
              <path 
                :d="getLeafVein(index)"
                fill="white" 
                opacity="0.6"
              />
            </svg>
            <!-- Only show date if leaf has been clicked -->
            <span v-if="compliment.viewed" class="absolute text-xs md:text-sm text-white font-semibold">
              {{ formatDate(compliment.date) }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Modal for displaying compliment -->
      <div v-if="selectedCompliment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
          <div class="bg-green-100 p-3 rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2 text-green-700">{{ formatDate(selectedCompliment.date) }}</h3>
            <p class="text-sm text-green-600">Leaf ID: {{ selectedCompliment.id.substring(0, 8) }}</p>
          </div>
          <p class="text-gray-700 mb-6 text-lg">{{ selectedCompliment.message }}</p>
          <div class="flex justify-end">
            <button 
              @click="closeCompliment" 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
  import { ref as dbRef, onValue, off, update } from 'firebase/database'
  import { useNuxtApp } from '#app'
  
  const { $database } = useNuxtApp()
  
  const compliments = ref([])
  const selectedCompliment = ref(null)
  const leafPositions = reactive({})
  const isDragging = ref(false)
  const activeLeaf = ref(null)
  
  // Define leaf attachment points within the foliage
  const leafAttachments = [
    // Main top cluster
    { x: 40, y: 10 },
    { x: 45, y: 8 },
    { x: 50, y: 10 },
    { x: 35, y: 12 },
    { x: 55, y: 12 },
    { x: 30, y: 15 },
    { x: 60, y: 15 },
    
    // Left cluster
    { x: 25, y: 20 },
    { x: 30, y: 22 },
    { x: 20, y: 25 },
    
    // Right cluster
    { x: 65, y: 20 },
    { x: 70, y: 22 },
    { x: 75, y: 25 },
    
    // Middle clusters
    { x: 40, y: 18 },
    { x: 50, y: 18 },
    { x: 45, y: 15 },
    
    // Additional points
    { x: 35, y: 20 },
    { x: 55, y: 20 },
    { x: 40, y: 25 },
    { x: 50, y: 25 },
    { x: 45, y: 22 },
    { x: 28, y: 18 },
    { x: 62, y: 18 },
  ]
  
  // Define different leaf shapes
  const leafShapes = [
    // Standard pointed leaf (like reference)
    "M50,10 C65,10 85,30 85,55 C85,80 65,90 50,90 C35,90 15,80 15,55 C15,30 35,10 50,10",
    
    // Rounder leaf
    "M50,15 C70,15 80,35 80,55 C80,75 65,85 50,85 C35,85 20,75 20,55 C20,35 30,15 50,15",
    
    // More elongated leaf
    "M50,5 C65,5 80,30 80,60 C80,85 65,95 50,95 C35,95 20,85 20,60 C20,30 35,5 50,5",
    
    // Heart-shaped leaf
    "M50,15 C60,5 75,15 80,30 C85,45 75,70 50,90 C25,70 15,45 20,30 C25,15 40,5 50,15",
    
    // Oval leaf
    "M50,20 C65,20 75,35 75,50 C75,65 65,80 50,80 C35,80 25,65 25,50 C25,35 35,20 50,20"
  ]
  
  // Define different leaf veins
  const leafVeins = [
    // Standard curved vein
    "M50,15 C55,30 60,50 50,85 C45,70 40,50 50,15",
    
    // Straight vein
    "M50,15 L50,85",
    
    // Y-shaped vein
    "M50,15 L50,50 M50,50 L40,85 M50,50 L60,85",
    
    // Curved vein (opposite direction)
    "M50,15 C45,30 40,50 50,85 C55,70 60,50 50,15",
    
    // Wavy vein
    "M50,15 C55,30 45,45 55,60 C45,75 50,85 50,85"
  ]
  
  // Function to initialize leaf position
  const initializeLeafPosition = (compliment, index) => {
    if (!leafPositions[compliment.id]) {
      // Get attachment point based on index
      const attachmentIndex = index % leafAttachments.length
      const attachment = leafAttachments[attachmentIndex]
      
      // Add small random offset for natural look
      const offsetX = (Math.random() - 0.5) * 5
      const offsetY = (Math.random() - 0.5) * 5
      
      leafPositions[compliment.id] = { 
        x: attachment.x + offsetX, 
        y: attachment.y + offsetY 
      }
    }
  }
  
  const complimentsRef = ref(null)
  
  // Initialize a ref to hold the onValue function
  const onValueRef = ref(null);
  
  // Connect to Firebase and listen for updates
  onMounted(() => {
    complimentsRef.value = dbRef($database, 'compliments')
    
    const updateCompliments = (snapshot) => {
      const data = snapshot.val()
      if (data) {
        compliments.value = Object.keys(data).map((key, index) => {
          const compliment = {
            id: key,
            viewed: data[key].viewed || false,
            ...data[key]
          }
          
          // Initialize position if not already set
          initializeLeafPosition(compliment, index)
          
          // If position exists in database, use it
          if (compliment.position) {
            leafPositions[compliment.id] = {
              x: compliment.position.x,
              y: compliment.position.y
            }
          }
          
          return compliment
        })
      } else {
        compliments.value = []
      }
    }
  
    // Assign the onValue function to the ref
    onValueRef.value = onValue(complimentsRef.value, updateCompliments)
  })
  
  onUnmounted(() => {
    if (complimentsRef.value && onValueRef.value) {
      off(complimentsRef.value, onValueRef.value)
    }
  })
  
  // Get a color for the leaf based on index
  const getLeafColor = (index) => {
    // Green color palette for leaves
    const colors = [
      '#4ade80', // green-400
      '#22c55e', // green-500
      '#16a34a', // green-600
      '#15803d', // green-700
      '#84cc16', // lime-500
      '#a3e635', // lime-400
    ]
    return colors[index % colors.length]
  }
  
  // Get a leaf shape based on index
  const getLeafShape = (index) => {
    return leafShapes[index % leafShapes.length]
  }
  
  // Get a leaf vein based on index
  const getLeafVein = (index) => {
    return leafVeins[index % leafVeins.length]
  }
  
  // Get a size class for the leaf based on index
  const getLeafSizeClass = (index) => {
    const sizes = [
      'w-14 h-14 md:w-20 md:h-20', // Small
      'w-16 h-16 md:w-24 md:h-24', // Medium
      'w-18 h-18 md:w-28 md:h-28', // Large
      'w-20 h-20 md:w-32 md:h-32', // Extra large
    ]
    return sizes[index % sizes.length]
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Show compliment and mark as viewed
  const showCompliment = (compliment) => {
    if (!isDragging.value) {
      selectedCompliment.value = compliment
      
      // Mark as viewed in Firebase if not already viewed
      if (!compliment.viewed) {
        const complimentRef = dbRef($database, `compliments/${compliment.id}`)
        update(complimentRef, { viewed: true })
        
        // Update local state
        const index = compliments.value.findIndex(c => c.id === compliment.id)
        if (index !== -1) {
          compliments.value[index].viewed = true
        }
      }
    }
  }
  
  // Close compliment modal
  const closeCompliment = () => {
    selectedCompliment.value = null
  }
  
  // Drag start handler
  const startDrag = (event, compliment) => {
    isDragging.value = true
    activeLeaf.value = compliment.id
    
    // Prevent default to avoid browser's native drag
    event.preventDefault()
    
    // Get initial mouse position
    const initialX = event.clientX || (event.touches && event.touches[0].clientX)
    const initialY = event.clientY || (event.touches && event.touches[0].clientY)
    
    // Get initial leaf position
    const initialLeafX = leafPositions[compliment.id].x
    const initialLeafY = leafPositions[compliment.id].y
    
    // Set up move and end handlers
    const moveHandler = (moveEvent) => {
      const currentX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX)
      const currentY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY)
      
      if (!currentX || !currentY) return
      
      // Calculate the difference
      const deltaX = currentX - initialX
      const deltaY = currentY - initialY
      
      // Calculate new position as percentage of container
      const container = document.querySelector('.tree-container')
      const containerRect = container.getBoundingClientRect()
      
      const newX = initialLeafX + (deltaX / containerRect.width) * 100
      const newY = initialLeafY + (deltaY / containerRect.height) * 100
      
      // Constrain to container bounds
      const constrainedX = Math.max(0, Math.min(100, newX))
      const constrainedY = Math.max(0, Math.min(100, newY))
      
      // Update position
      leafPositions[compliment.id] = {
        x: constrainedX,
        y: constrainedY
      }
      
      // Prevent default to avoid text selection during drag
      moveEvent.preventDefault()
    }
    
    const endHandler = () => {
      if (!isDragging.value) return
      
      isDragging.value = false
      activeLeaf.value = null
      
      // Save position to database
      const complimentRef = dbRef($database, `compliments/${compliment.id}`)
      update(complimentRef, {
        position: {
          x: leafPositions[compliment.id].x,
          y: leafPositions[compliment.id].y
        }
      }).catch(error => {
        console.error("Error saving position:", error)
      })
      
      // Remove event listeners
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('touchmove', moveHandler)
      window.removeEventListener('mouseup', endHandler)
      window.removeEventListener('touchend', endHandler)
    }
    
    // Add event listeners
    window.addEventListener('mousemove', moveHandler)
    window.addEventListener('touchmove', moveHandler)
    window.addEventListener('mouseup', endHandler)
    window.addEventListener('touchend', endHandler)
  }
  
  // Get leaf position and rotation style
  const getLeafStyle = (compliment, index) => {
    const position = leafPositions[compliment.id] || { x: 50, y: 50 }
    
    // Add slight random rotation for more natural look
    const rotation = (index * 30) % 360
    
    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `rotate(${rotation}deg)`,
      cursor: isDragging.value && activeLeaf.value === compliment.id ? 'grabbing' : 'grab',
      zIndex: isDragging.value && activeLeaf.value === compliment.id ? 10 : 1
    }
  }
  </script>
  
  <style scoped>
  .leaf {
    animation: float 5s ease-in-out infinite;
    transform-origin: center;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  
  /* Add different animation delays to create natural movement */
  .leaf:nth-child(2n) {
    animation-delay: 0.5s;
  }
  
  .leaf:nth-child(3n) {
    animation-delay: 1s;
  }
  
  .leaf:nth-child(4n) {
    animation-delay: 1.5s;
  }
  
  .leaf:nth-child(5n) {
    animation-delay: 2s;
  }
  </style>
  