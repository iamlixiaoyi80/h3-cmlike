<template>
  <div class="dice-area">
    <!-- 骰子显示 -->
    <div class="dice-display">
      <div class="dice" :class="{ rolling: isRolling }">
        <div class="dice-face">{{ isRolling ? '?' : diceValue }}</div>
        <div v-if="isRolling" class="dice-glow"></div>
      </div>
    </div>

    <!-- 掷骰子按钮 -->
    <button
      v-if="!isRolling && !showResult && !readyToMove"
      class="roll-btn"
      :disabled="diceCount <= 0"
      @click="handleRoll"
    >
      <span class="btn-icon">🎲</span>
      <span class="btn-text">掷骰子</span>
    </button>

    <!-- 停止按钮 -->
    <button
      v-if="canStop"
      class="stop-btn"
      @click="handleStop"
    >
      <span class="btn-icon">⏹️</span>
      <span class="btn-text">点击停止</span>
    </button>

    <!-- 结果显示 -->
    <div v-if="showResult && readyToMove" class="result-display">
      <div class="result-text">
        <span class="result-label">你掷出了</span>
        <span class="result-value">{{ diceValue }}</span>
        <span class="result-label">点！</span>
      </div>
      <button class="move-btn" @click="handleConfirmMove">
        <span class="btn-icon">▶️</span>
        <span class="btn-text">开始移动</span>
      </button>
    </div>

    <!-- 操作提示 -->
    <div v-if="isRolling" class="action-hint">
      <span class="hint-text highlight">骰子滚动中...</span>
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
  showResult: boolean
  readyToMove: boolean
}>()

const emit = defineEmits<{
  roll: []
  stop: []
  confirmMove: []
}>()

function handleRoll() {
  if (props.diceCount > 0 && !props.isRolling && !props.readyToMove) {
    emit('roll')
  }
}

function handleStop() {
  if (props.canStop) {
    emit('stop')
  }
}

function handleConfirmMove() {
  emit('confirmMove')
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

.dice.rolling {
  animation: diceRoll 0.15s infinite;
  cursor: default;
}

@keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(90deg) rotateY(0deg); }
  50% { transform: rotateX(90deg) rotateY(90deg); }
  75% { transform: rotateX(0deg) rotateY(90deg); }
  100% { transform: rotateX(0deg) rotateY(0deg); }
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

/* 掷骰子按钮 */
.roll-btn, .move-btn, .stop-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  transition: all 0.2s ease;
}

.roll-btn:hover:not(:disabled), .move-btn:hover, .stop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
}

.roll-btn:active:not(:disabled), .move-btn:active, .stop-btn:active {
  transform: translateY(0);
}

.stop-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.stop-btn:hover {
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
}

.roll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.move-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.move-btn:hover {
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 16px;
}

/* 结果显示 */
.result-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-text {
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.result-label {
  font-size: 16px;
  color: #d4af37;
  font-weight: 500;
}

.result-value {
  font-size: 32px;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
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
