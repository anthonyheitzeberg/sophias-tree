<template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 py-20 md:py-32">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-pink-500 opacity-10"></div>
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div class="absolute -top-16 -left-16 w-64 h-64 bg-pink-200 rounded-full opacity-40"></div>
            <div class="absolute top-1/4 -right-16 w-80 h-80 bg-pink-300 rounded-full opacity-30"></div>
            <div class="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-100 rounded-full opacity-50"></div>
          </div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
              <span class="block">For Sophia</span>
              <span class="block text-pink-900">With Love</span>
            </h1>
            
            <p class="text-xl md:text-2xl font-medium text-white mb-10 drop-shadow">
              A growing collection of thoughts and memories, just for you.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button class="px-8 py-3 bg-white text-pink-600 font-bold rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-1">
                Explore Your Tree
              </button>
              <button class="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-pink-600 transition">
                About This Gift
              </button>
            </div>
          </div>
        </div>
        
        <!-- Animated leaves -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div v-for="i in 10" :key="i" 
               :class="`absolute animate-float-${i % 5 + 1}`"
               :style="{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 5}s`
               }">
            <svg class="w-6 h-6 text-pink-200 opacity-70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5,21.5C8.5,20.5 10.5,19.5 12.5,19.5C14.5,19.5 16.5,20.5 18.5,21.5C18.5,21.5 17,19 17,16C17,13 20,10 20,10C18,11 15,12 12,12C9,12 6,11 4,10C4,10 7,13 7,16C7,19 5.5,21.5 5.5,21.5M6,16A1,1 0 0,1 7,17A1,1 0 0,1 6,18A1,1 0 0,1 5,17A1,1 0 0,1 6,16M18,16A1,1 0 0,1 19,17A1,1 0 0,1 18,18A1,1 0 0,1 17,17A1,1 0 0,1 18,16Z" />
            </svg>
          </div>
        </div>
      </section>
  
      <!-- Introduction Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-green-800 mb-6">A Tree That Grows With Love</h2>
            <p class="text-lg text-gray-700 mb-8">
              Each leaf on this tree represents a special message for you. Click on any leaf to reveal the message and mark it as read.
              You can also drag the leaves to arrange them however you like!
            </p>
            <p class="text-lg text-gray-700 mb-8">
              This tree is a living symbol of my love for you, growing stronger and more beautiful each day.
              As time goes on, more leaves will appear, each with a new memory or thought.
            </p>
            <div class="inline-block bg-green-100 rounded-lg px-6 py-4 border-l-4 border-green-500">
              <p class="text-green-800 font-medium">
                Explore the tree by clicking on leaves to discover hidden messages!
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Tree Component -->
      <section class="py-10 bg-gradient-to-b from-green-50 to-green-100">
        <div class="container mx-auto px-4">
          <ComplimentTree />
        </div>
      </section>
  
      <!-- Footer -->
      <footer class="bg-green-900 text-white py-8">
        <div class="container mx-auto px-4 text-center">
          <p class="mb-2">Made with ❤️ for Sophia</p>
          <p class="text-green-200 text-sm">Happy Birthday my love, my Sophia!</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import ComplimentTree from '~/components/ComplimentTree.vue'
  </script>
  
  <style scoped>
  /* Animation classes for floating leaves */
  .animate-float-1 {
    animation: float1 8s ease-in-out infinite;
  }
  .animate-float-2 {
    animation: float2 10s ease-in-out infinite;
  }
  .animate-float-3 {
    animation: float3 7s ease-in-out infinite;
  }
  .animate-float-4 {
    animation: float4 12s ease-in-out infinite;
  }
  .animate-float-5 {
    animation: float5 9s ease-in-out infinite;
  }
  
  @keyframes float1 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-8deg); }
  }
  @keyframes float3 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(5deg); }
  }
  @keyframes float4 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(-12deg); }
  }
  @keyframes float5 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(15deg); }
  }
  </style>
  