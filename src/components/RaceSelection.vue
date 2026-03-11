<template>
  <div class="race-selection">
    <h1 class="title">🏰 英雄无敌：王国征服</h1>
    <p class="subtitle">选择你的种族，开始征服之旅</p>
    
    <div class="race-cards">
      <div 
        v-for="race in races" 
        :key="race.id"
        class="race-card"
        :class="race.id"
        @click="$emit('select', race.id)"
      >
        <div class="race-icon">{{ race.icon }}</div>
        <h2 class="race-name">{{ race.name }}</h2>
        <p class="race-desc">{{ race.description }}</p>
        <div class="race-features">
          <span v-for="feature in race.features" :key="feature" class="feature-tag">
            {{ feature }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  select: [race: 'knight' | 'elf' | 'undead']
}>()

const races = ref([
  {
    id: 'knight' as const,
    name: '骑士堡',
    icon: '⚔️',
    description: '均衡发展，天使压阵',
    features: ['攻防平衡', '天使终极', '新手友好']
  },
  {
    id: 'elf' as const,
    name: '森林堡',
    icon: '🌲',
    description: '资源加成，龙族后期',
    features: ['资源+20%', '绿龙终极', '经济优势']
  },
  {
    id: 'undead' as const,
    name: '墓园',
    icon: '💀',
    description: '复活机制，数量压制',
    features: ['复活生物', '骨龙终极', '数量优势']
  }
])
</script>

<style scoped>
.race-selection {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
}

.title {
  font-size: 24px;
  color: #d4af37;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  color: #888;
  margin-bottom: 30px;
  font-size: 14px;
}

.race-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
}

.race-card {
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border: 2px solid #3a3a5a;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.race-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.race-card.knight {
  border-color: #4a7c59;
}
.race-card.knight:hover {
  border-color: #6a9c79;
  box-shadow: 0 8px 24px rgba(74,124,89,0.3);
}

.race-card.elf {
  border-color: #2e7d32;
}
.race-card.elf:hover {
  border-color: #4caf50;
  box-shadow: 0 8px 24px rgba(46,125,50,0.3);
}

.race-card.undead {
  border-color: #6a1b9a;
}
.race-card.undead:hover {
  border-color: #9c27b0;
  box-shadow: 0 8px 24px rgba(106,27,154,0.3);
}

.race-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 8px;
}

.race-name {
  font-size: 20px;
  color: #d4af37;
  text-align: center;
  margin-bottom: 8px;
}

.race-desc {
  color: #aaa;
  text-align: center;
  font-size: 14px;
  margin-bottom: 12px;
}

.race-features {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(255,255,255,0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #ccc;
}
</style>
