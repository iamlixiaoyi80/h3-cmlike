<template>
  <div class="resource-bar">
    <div class="resources">
      <div class="resource-item gold">
        <span class="icon">💰</span>
        <span class="value">{{ formatNumber(resources.gold) }}</span>
      </div>
      <div class="resource-item wood">
        <span class="icon">🪵</span>
        <span class="value">{{ formatNumber(resources.wood) }}</span>
      </div>
      <div class="resource-item ore">
        <span class="icon">⛏️</span>
        <span class="value">{{ formatNumber(resources.ore) }}</span>
      </div>
      <div class="resource-item crystal">
        <span class="icon">💎</span>
        <span class="value">{{ formatNumber(resources.crystal) }}</span>
      </div>
    </div>
    <div class="power-display">
      <span class="power-icon">⚔️</span>
      <span class="power-value">{{ formatNumber(power) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resources } from '../stores/game'

defineProps<{
  resources: Resources
  power: number
}>()

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
</script>

<style scoped>
.resource-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #3a3a5a;
}

.resources {
  display: flex;
  gap: 12px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  font-size: 16px;
}

.value {
  font-size: 14px;
  font-weight: bold;
  color: #d4af37;
}

.power-display {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(139, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
}

.power-icon {
  font-size: 14px;
}

.power-value {
  font-size: 14px;
  font-weight: bold;
  color: #ff6b6b;
}
</style>
