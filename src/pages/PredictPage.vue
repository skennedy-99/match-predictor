<template>
  <section class="card">
    <h2>Predictions</h2>
    <div v-if="loading">Loading fixtures...</div>
    <div v-else>
      <div class="fixture" v-for="f in fixtures" :key="f.id">
        <div class="info">
          <div class="teams">{{ f.home_team }} vs {{ f.away_team }}</div>
          <div class="date">{{ new Date(f.date).toLocaleString() }}</div>
          <div class="status">{{ f.status }}</div>
          <div v-if="f.home_goals != null && f.away_goals != null" class="score">Final: {{ f.home_goals }}-{{ f.away_goals }}</div>
        </div>
        <form class="pred" @submit.prevent="savePrediction(f.id)">
          <input type="number" min="0" v-model.number="predictions[f.id].pred_home_goals" :disabled="isLocked(f)" />
          <span>-</span>
          <input type="number" min="0" v-model.number="predictions[f.id].pred_away_goals" :disabled="isLocked(f)" />
          <button :disabled="isLocked(f)">Save</button>
          <span class="points" v-if="pointsMap[f.id] != null">{{ pointsMap[f.id] }} pts</span>
        </form>
      </div>
    </div>
  </section>
  </template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSession, listFixtures, getPredictions, upsertPrediction } from '../shared/apiClient';
import { computePoints } from '../shared/points';

type Fixture = {
  id: string;
  date: string;
  status: string;
  home_team: string;
  away_team: string;
  home_goals: number | null;
  away_goals: number | null;
};

const router = useRouter();
const loading = ref(true);
const fixtures = ref<Fixture[]>([]);
const predictions = reactive<Record<string, { pred_home_goals: number; pred_away_goals: number }>>({});
const pointsMap = reactive<Record<string, number>>({});
const userPredicted = new Set<string>();

onMounted(async () => {
  const session = await getSession();
  if (!session?.userId) {
    router.replace('/login');
    return;
  }
  const [fx, preds] = await Promise.all([listFixtures(), getPredictions()]);
  fixtures.value = fx;
  preds.forEach(p => {
    predictions[p.fixture_id] = { pred_home_goals: p.pred_home_goals, pred_away_goals: p.pred_away_goals };
    userPredicted.add(p.fixture_id);
  });
  fixtures.value.forEach(f => {
    if (!predictions[f.id]) {
      predictions[f.id] = { pred_home_goals: 0, pred_away_goals: 0 };
    }
    const p = predictions[f.id];
    if (userPredicted.has(f.id) && f.home_goals != null && f.away_goals != null) {
      pointsMap[f.id] = computePoints(p.pred_home_goals, p.pred_away_goals, f.home_goals, f.away_goals);
    }
  });
  loading.value = false;
});

function isLocked(f: Fixture) {
  return new Date(f.date).getTime() <= Date.now() || f.status !== 'SCHEDULED';
}

async function savePrediction(fixtureId: string) {
  const p = predictions[fixtureId];
  if (!p) return;
  await upsertPrediction(fixtureId, p.pred_home_goals, p.pred_away_goals);
}
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.fixture { display: grid; grid-template-columns: 1fr auto; align-items: center; border-bottom: 1px solid #eee; padding: 12px 0; }
.info { display: grid; gap: 4px; }
.pred { display: inline-flex; align-items: center; gap: 6px; }
input { width: 56px; padding: 6px; }
.points { margin-left: 8px; font-weight: 600; }
</style>


