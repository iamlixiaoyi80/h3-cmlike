<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <h2>👑 英雄信息</h2>
            <button class="close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="modal-body hero-modal">
            <div v-if="heroes.length > 0" class="heroes-list">
              <div
                v-for="hero in heroes"
                :key="hero.id"
                class="hero-card"
              >
                <div class="hero-header">
                  <span class="hero-name">{{ hero.name }}</span>
                  <span class="hero-level">Lv.{{ hero.level }}</span>
                </div>

                <div class="hero-stats">
                  <div class="stat">
                    <span class="stat-label">⚔️ 攻击</span>
                    <span class="stat-value">{{ hero.attack }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">🛡️ 防御</span>
                    <span class="stat-value">{{ hero.defense }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">✨ 魔力</span>
                    <span class="stat-value">{{ hero.magicPower }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">💨 速度</span>
                    <span class="stat-value">{{ hero.speed }}</span>
                  </div>
                </div>

                <div class="hero-experience">
                  <div class="exp-bar">
                    <div class="exp-fill" :style="{ width: (hero.experience / hero.maxExperience * 100) + '%' }"></div>
                  </div>
                  <span class="exp-text">{{ hero.experience }} / {{ hero.maxExperience }} XP</span>
                </div>
              </div>
            </div>

            <div v-else class="no-heroes">
              <p>暂无英雄</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Hero } from '../stores/game'

defineProps<{
  show: boolean
  heroes: Hero[]
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  background: rgba(212, 175, 55, 0.05);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #d4af37;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.hero-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.heroes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hero-name {
  font-size: 16px;
  font-weight: 600;
  color: #d4af37;
}

.hero-level {
  font-size: 12px;
  color: #b8b8b8;
  background: rgba(212, 175, 55, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
}

.hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: #b8b8b8;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.hero-experience {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exp-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37 0%, #f0d55e 100%);
  transition: width 0.3s ease;
}

.exp-text {
  font-size: 11px;
  color: #888;
  text-align: center;
}

.no-heroes {
  text-align: center;
  padding: 40px;
  color: #888;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}
</style>
