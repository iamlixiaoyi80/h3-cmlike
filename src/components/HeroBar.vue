<template>
  <div class="hero-bar">
    <div 
      v-for="hero in heroes" 
      :key="hero.id"
      class="hero-card"
      :class="hero.rarity"
    >
      <div class="hero-avatar">{{ getHeroEmoji(hero.race) }}</div>
      <div class="hero-info">
        <span class="hero-name">{{ hero.name }}</span>
        <div class="hero-stars">
          <span v-for="i in hero.stars" :key="i" class="star">⭐</span>
        </div>
      </div>
      <div class="hero-stats">
        <span class="stat">⚔️{{ hero.attack }}</span>
        <span class="stat">🛡️{{ hero.defense }}</span>
      </div>
    </div>
    
    <!-- 空英雄槽位 -->
    <div v-for="i in (3 - heroes.length)" :key="'empty-' + i" class="hero-card empty">
      <div class="hero-avatar">?</div>
      <div class="hero-info">
        <span class="hero-name">空槽位</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hero } from '../stores/game'

defineProps<{
  heroes: Hero[]
}>()

function getHeroEmoji(race: string): string {
  const emojis: Record<string, string> = {
    knight: '👑',
    elf: '🧝',
    undead: '💀'
  }
  return emojis[race] || '👤'
}
</script>

<style scoped>
.hero-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.hero-card {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border-radius: 8px;
  padding: 8px;
  min-width: 140px;
  border: 1px solid #3a3a5a;
}

.hero-card.legendary {
  border-color: #d4af37;
  background: linear-gradient(135deg, #3a3a2a 0%, #2a2a1a 100%);
}

.hero-card.epic {
  border-color: #9c27b0;
  background: linear-gradient(135deg, #3a2a3a 0%, #2a1a2a 100%);
}

.hero-card.rare {
  border-color: #2196f3;
  background: linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 100%);
}

.hero-card.empty {
  opacity: 0.5;
  border-style: dashed;
}

.hero-avatar {
  width: 36px;
  height: 36px;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-name {
  font-size: 12px;
  color: #e0e0e0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 10px;
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  color: #aaa;
}

.stat {
  white-space: nowrap;
}
</style>
