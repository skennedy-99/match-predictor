<template>
  <div class="app">
    <header class="header">
      <h1>Match Predictor</h1>
      <nav>
        <router-link to="/predict">Predict</router-link>
        <router-link to="/leaderboard">Leaderboard</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
  </template>

<script setup lang="ts">
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  color: #111;
  background: #f6f7f9;
}
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
nav a {
  margin-right: 12px;
}
main { margin-top: 16px; }
</style>


