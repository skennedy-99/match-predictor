<template>
  <section class="card">
    <h2>Leaderboard</h2>
    <div v-if="loading">Loading...</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Points</th>
          <th>Exact</th>
          <th>Outcome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in leaderboard" :key="row.user_id">
          <td>{{ idx + 1 }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.points }}</td>
          <td>{{ row.exact_count }}</td>
          <td>{{ row.outcome_count }}</td>
        </tr>
      </tbody>
    </table>
  </section>
  </template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSession, getLeaderboard } from '../shared/apiClient';

type Row = { user_id: string; name: string; points: number; exact_count: number; outcome_count: number };

const router = useRouter();
const leaderboard = ref<Row[]>([]);
const loading = ref(true);

onMounted(async () => {
  const session = await getSession();
  if (!session?.userId) {
    router.replace('/login');
    return;
  }
  leaderboard.value = await getLeaderboard();
  loading.value = false;
});
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.table { border-collapse: collapse; width: 100%; }
th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; }
th { background: #fafafa; }
</style>


