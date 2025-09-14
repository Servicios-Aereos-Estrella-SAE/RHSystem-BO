<template>
  <div class="error-container">
    <div class="error-content">
      <h1>{{ props.error.statusCode }}</h1>
      <h2>{{ title }}</h2>
      <p>{{ props.error.message }}</p>
      <NuxtLink class="back-link" :to="`/${$i18n.locale}`">← Go back home</NuxtLink>
      <button class="logout-button" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    error: {
      type: Object,
      required: true
    }
  })

  const router = useRouter()

  const title = computed(() => {
    switch (props.error.statusCode) {
      case 403:
        return 'Access Denied'
      case 404:
        return 'Page Not Found'
      case 500:
        return 'Internal Server Error'
      default:
        return 'Something Went Wrong'
    }
  })
  const logout = async () => {
    try {
      const { signOut } = useAuth()
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('🚀 ---------------------------------🚀')
      console.error('🚀 ~ handlerLogout ~ error:', error)
      console.error('🚀 ---------------------------------🚀')
    }
  }
</script>

<style scoped>
  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
    font-family: 'Segoe UI', sans-serif;
    color: #333;
  }

  .error-content {
    text-align: center;
    max-width: 500px;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 6rem;
    margin-bottom: 0.5rem;
    color: #1976d2;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #666;
  }

  .back-link,
  .logout-button {
    display: inline-block;
    margin-top: 2rem;
    margin-right: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-family: inherit;
    background-color: #1976d2;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .back-link:hover {
    background-color: #1565c0;
  }

  .logout-button {
    background-color: #d32f2f;
  }

  .logout-button:hover {
    background-color: #b71c1c;
  }
</style>
