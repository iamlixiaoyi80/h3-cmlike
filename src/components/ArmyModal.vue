<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <h2>⚔️ 部队信息</h2>
            <button class="close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="modal-body army-modal">
            <div v-if="army.length > 0" class="army-list">
              <div
                v-for="unit in army"
                :key="unit.id"
                class="unit-card"
              >
                <div class="unit-header">
                  <span class="unit-name">{{ unit.name }}</span>
                  <span class="unit-count">× {{ unit.count }}</span>
                </div>

                <div class="unit-stats">
                  <div class="stat">
                    <span class="stat-icon">⚔️</span>
                    <span class="stat-value">{{ unit.attack }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">🛡️</span>
                    <span class="stat-value">{{ unit.defense }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💨</span>
                    <span class="stat-value">{{ unit.speed }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-value">{{ unit.hp }}</span>
                  </div>
                </div>

                <div class="unit-tier">
                  <span class="tier-label">等级:</span>
                  <span class="tier-value">{{ unit.tier }}</span>
                </div>
              </div>
            </div>

            <div v-else class="no-army">
              <p>暂无部队</p>
              <p class="hint">前往城堡招募生物</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Creature } from '../stores/game'

defineProps<{
  show: boolean
  army: Creature[]
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

.army-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.army-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.unit-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.unit-name {
  font-size: 15px;
  font-weight: 600;
  color: #d4af37;
}

.unit-count {
  font-size: 14px;
  color: #f0d55e;
  font-weight: 600;
}

.unit-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 4px;
  border-radius: 6px;
}

.stat-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.unit-tier {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.1);
  padding: 6px;
  border-radius: 6px;
}

.tier-label {
  font-size: 11px;
  color: #b8b8b8;
}

.tier-value {
  font-size: 12px;
  font-weight: 600;
  color: #d4af37;
}

.no-army {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.no-army .hint {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
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
