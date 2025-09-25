<template>
  <section class="card">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <label>
        Your name
        <select v-model="selectedName" required>
          <option disabled value="">Select name</option>
          <option v-for="n in names" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <label>
        Family code
        <input v-model="familyCode" type="password" required />
      </label>
      <button :disabled="submitting">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
  </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getSession, login, fetchUserNames } from '../shared/apiClient';

const router = useRouter();
const names = ref<string[]>([]);
const selectedName = ref('');
const familyCode = ref('');
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  names.value = await fetchUserNames();
  const session = await getSession();
  if (session?.userId) {
    router.replace('/predict');
  }
});

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    await login(selectedName.value, familyCode.value);
    router.replace('/predict');
  } catch (e: any) {
    error.value = e?.message || 'Login failed';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
form { display: grid; gap: 12px; max-width: 360px; }
label { display: grid; gap: 6px; }
.error { color: #b00020; }
button { padding: 8px 12px; }
</style>


