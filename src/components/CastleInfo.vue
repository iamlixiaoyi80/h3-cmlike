<template>
  <div class="castle-info">
    <div class="castle-header">
      <span class="castle-icon">{{ getRaceIcon(castle.race) }}</span>
      <span class="castle-name">{{ castle.name }}</span>
      <span class="castle-level">Lv.{{ castle.level }}</span>
    </div>
    
    <div class="creatures-list">
      <div 
        v-for="creature in castle.creatures" 
        :key="creature.id"
        class="creature-item"
        :class="{ 'has-units': creature.count > 0 }"
      >
        <div class="creature-info">
          <span class="creature-level">Lv{{ creature.level }}</span>
          <span class="creature-name">{{ creature.name }}</span>
          <span class="creature-count">×{{ creature.count }}</span>
        </div>
        <button 
          v-if="creature.count === 0"
          class="recruit-btn"
          :disabled="!canRecruit(creature)"
          @click="$emit('recruit', creature.id)"
        >
          招募 ({{ creature.cost }}💰)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Castle, Creature } from '../stores/game'

defineProps<{
  castle: Castle
}>()

defineEmits<{
  recruit: [creatureId: string]
}>()

function getRaceIcon(race: string): string {
  const icons: Record<string, string> = {
    knight: '⚔️',
    elf: '🌲',
    undead: '💀'
  }
  return icons[race] || '🏰'
}

function canRecruit(creature: Creature): boolean {
  // 这里需要检查金币是否足够
  return creature.cost <= 1000 // 简化判断
}
</script>

<style scoped>
.castle-info {
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #3a3a5a;
  max-height: 180px;
  overflow-y: auto;
}

.castle-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #3a3a5a;
}

.castle-icon {
  font-size: 24px;
}

.castle-name {
  font-size: 16px;
  font-weight: bold;
  color: #d4af37;
  flex: 1;
}

.castle-level {
  background: rgba(212, 175, 55, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #d4af37;
}

.creatures-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.creature-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.creature-item.has-units {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.creature-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.creature-level {
  font-size: 10px;
  background: rgba(255,255,255,0.1);
  padding: 2px 4px;
  border-radius: 3px;
  color: #888;
}

.creature-name {
  font-size: 13px;
  color: #e0e0e0;
}

.creature-count {
  font-size: 13px;
  font-weight: bold;
  color: #d4af37;
}

.recruit-btn {
  background: linear-gradient(135deg, #4a7c59 0%, #3a5c49 100%);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recruit-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.recruit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
