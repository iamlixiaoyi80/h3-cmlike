<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <h2>🏰 城堡信息</h2>
            <button class="close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="modal-body castle-modal">
            <div v-if="castle" class="castle-details">
              <div class="castle-section">
                <h3>{{ castle.name }}</h3>
                <p class="castle-level">等级 {{ castle.level }}</p>
              </div>

              <div class="castle-section">
                <h4>🛡️ 防御</h4>
                <div class="stat-value">{{ castle.defense }}</div>
              </div>

              <div class="castle-section">
                <h4>⚡ 每日产出</h4>
                <div class="resource-production">
                  <div class="resource-item">
                    <span class="icon">💰</span>
                    <span>{{ castle.goldProduction }}/天</span>
                  </div>
                </div>
              </div>

              <div class="castle-section">
                <h4>👥 可招募生物</h4>
                <div class="creatures-list">
                  <div
                    v-for="creature in castle.availableCreatures"
                    :key="creature.id"
                    class="creature-item"
                  >
                    <div class="creature-info">
                      <span class="creature-name">{{ creature.name }}</span>
                      <span class="creature-cost">💰 {{ creature.cost }}</span>
                    </div>
                    <button
                      class="recruit-btn"
                      :disabled="resources.gold < creature.cost"
                      @click="$emit('recruit', creature.id)"
                    >
                      招募
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="no-castle">
              <p>暂无城堡信息</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Castle } from '../stores/game'

defineProps<{
  show: boolean
  castle: Castle | null
  resources: { gold: number }
}>()

defineEmits<{
  close: []
  recruit: [creatureId: string]
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

.castle-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.castle-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
}

.castle-section h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #d4af37;
}

.castle-section h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #b8b8b8;
  font-weight: 600;
}

.castle-level {
  margin: 0;
  color: #888;
  font-size: 13px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #d4af37;
}

.resource-production {
  display: flex;
  gap: 12px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.creatures-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.creature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 6px;
}

.creature-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.creature-name {
  font-weight: 600;
  font-size: 13px;
}

.creature-cost {
  font-size: 12px;
  color: #d4af37;
}

.recruit-btn {
  background: linear-gradient(180deg, #d4af37 0%, #b8962e 100%);
  border: none;
  color: #1a1a2e;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.recruit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.recruit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.no-castle {
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
