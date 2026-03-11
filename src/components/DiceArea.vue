<template>
  <div class="dice-area">
    <!-- 骰子显示 -->
    <div class="dice-display">
      <div 
        class="dice"
        :class="{ rolling: isRolling, 'can-stop': canStop }"
        @click="handleDiceClick"
      >
        <div class="dice-face">{{ diceValue }}</div>
        <div v-if="isRolling" class="dice-glow"></div>
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div class="action-hint">
      <template v-if="!isRolling && !canStop">
        <span class="hint-text">点击骰子掷出</span>
      </template>
      <template v-else-if="isRolling && canStop">
        <span class="hint-text highlight">点击停止！</span>
      </template>
      <template v-else>
        <span class="hint-text">移动中...</span>
      </template>
    </div>
    
    <!-- 骰子数量 -->
    <div class="dice-count">
      <span class="dice-icon">🎲</span>
      <span class="count">{{ diceCount }}/{{ maxDice }}</span>
      <div class="dice-bar">
        <div class="dice-bar-fill" :style="{ width: (diceCount / maxDice * 100) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  diceCount: number
  maxDice: number
  diceValue: number
  isRolling: boolean
  canStop: boolean
}>()

const emit = defineEmits<{
  roll: []
  stop: []
}>()

function handleDiceClick() {
  if (props.isRolling && props.canStop) {
    emit('stop')
  } else if (!props.isRolling && !props.canStop && props.diceCount > 0) {
    emit('roll')
  }
}
</script>

<style scoped>
.dice-area {
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #3a3a5a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.dice-display {
  perspective: 200px;
}

.dice {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  user-select: none;
}

.dice:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.dice.rolling {
  animation: diceRoll 0.15s infinite;
}

.dice.can-stop {
  animation: diceShake 0.1s infinite;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

@keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(90deg) rotateY(0deg); }
  50% { transform: rotateX(90deg) rotateY(90deg); }
  75% { transform: rotateX(0deg) rotateY(90deg); }
  100% { transform: rotateX(0deg) rotateY(0deg); }
}

@keyframes diceShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.dice-face {
  font-size: 36px;
  font-weight: bold;
  color: #1a1a2e;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.3);
}

.dice-glow {
  position: absolute;
  inset: -4px;
  border-radius: 16px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  animation: glow 0.5s infinite alternate;
}

@keyframes glow {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.action-hint {
  height: 24px;
  display: flex;
  align-items: center;
}

.hint-text {
  font-size: 14px;
  color: #888;
}

.hint-text.highlight {
  color: #d4af37;
  font-weight: bold;
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

.dice-count {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.dice-icon {
  font-size: 20px;
}

.count {
  font-size: 14px;
  color: #d4af37;
  min-width: 40px;
}

.dice-bar {
  flex: 1;
  height: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  overflow: hidden;
}

.dice-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37 0%, #f0d878 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
