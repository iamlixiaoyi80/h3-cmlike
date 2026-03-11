<template>
  <div class="map-container">
    <div class="map-wrapper">
      <svg class="map-svg" viewBox="0 0 380 400">
        <!-- 地图路径 -->
        <g class="tiles">
          <g
            v-for="(tile, index) in tiles"
            :key="tile.id"
            :transform="getTileTransform(index)"
          >
            <!-- 地格背景 -->
            <rect
              :class="['tile', tile.type, { active: index === playerPosition }]"
              x="-30" y="-30"
              width="60" height="60"
              rx="10"
            />
            <!-- 地格图标 -->
            <text
              class="tile-icon"
              text-anchor="middle"
              dominant-baseline="central"
              y="3"
            >
              {{ getTileIcon(tile.type) }}
            </text>
            <!-- 玩家标记 -->
            <circle
              v-if="index === playerPosition"
              class="player-marker"
              r="10"
              cy="38"
            />
          </g>
        </g>
      </svg>
    </div>
    
    <!-- 当前事件提示 -->
    <div v-if="currentTile" class="event-hint">
      <span class="event-icon">{{ getTileIcon(currentTile.type) }}</span>
      <span class="event-text">{{ getEventText(currentTile) }}</span>
    </div>

    <!-- 事件消息 -->
    <div v-if="eventMessage" class="event-message">
      {{ eventMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapTile } from '../stores/game'

defineProps<{
  tiles: MapTile[]
  playerPosition: number
  currentTile: MapTile
  eventMessage: string
}>()

// 计算地格位置（环形矩形布局 - 格子只在矩形边缘）
function getTileTransform(index: number): string {
  // 环形布局参数
  const cols = 5 // 外框宽度（格数）- 减少到5格让格子更大
  const rows = 4 // 外框高度（格数）
  const tileSize = 60 // 格子边长
  const gap = 72 // 间距（大于格子边长）

  // 计算环形路径的各边格子数
  const topEdge = cols      // 顶边格子数
  const rightEdge = rows - 1 // 右边格子数（去掉右上角）
  const bottomEdge = cols    // 底边格子数
  const leftEdge = rows - 2  // 左边格子数（去掉左上角和左下角）

  const totalTiles = topEdge + rightEdge + bottomEdge + leftEdge // 总格子数 = 5 + 3 + 5 + 2 = 15

  // 超出范围的格子放在中间
  if (index >= totalTiles) {
    const x = 190
    const y = 200
    return `translate(${x}, ${y})`
  }

  // 计算居中偏移
  const totalWidth = cols * gap
  const totalHeight = rows * gap
  const startX = (380 - totalWidth) / 2 + gap / 2
  const startY = (400 - totalHeight) / 2 + gap / 2

  let col = 0
  let row = 0

  // 根据索引计算在环形中的位置
  if (index < topEdge) {
    // 顶边：从左到右
    col = index
    row = 0
  } else if (index < topEdge + rightEdge) {
    // 右边：从上到下（去掉右上角）
    col = cols - 1
    row = (index - topEdge) + 1
  } else if (index < topEdge + rightEdge + bottomEdge) {
    // 底边：从右到左
    col = cols - 1 - (index - topEdge - rightEdge)
    row = rows - 1
  } else {
    // 左边：从下到上（去掉左下角和左上角）
    col = 0
    row = rows - 1 - (index - topEdge - rightEdge - bottomEdge)
  }

  const x = startX + col * gap
  const y = startY + row * gap

  return `translate(${x}, ${y})`
}

function getTileIcon(type: string): string {
  const icons: Record<string, string> = {
    resource: '💰',
    creature: '🐉',
    treasure: '📦',
    chest: '🎁',
    attack: '⚔️',
    special: '✨',
    empty: '·'
  }
  return icons[type] || '?'
}

function getEventText(tile: MapTile): string {
  switch (tile.type) {
    case 'resource':
      return `获得 ${tile.resource} +${tile.amount}`
    case 'creature':
      return `发现生物！`
    case 'chest':
      return '宝箱！'
    case 'treasure':
      return '发现宝物！'
    case 'attack':
      return '可以攻击！'
    case 'special':
      return '特殊事件！'
    default:
      return ''
  }
}
</script>

<style scoped>
.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a237e 0%, #0d1442 100%);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid #3a3a5a;
  min-height: 360px;
}

.map-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-svg {
  width: 100%;
  height: 100%;
  max-width: 340px;
  max-height: 360px;
}

.tile {
  fill: #2a2a4a;
  stroke: #3a3a5a;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.tile.active {
  stroke: #d4af37;
  stroke-width: 3;
  filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.6));
}

.tile.resource { fill: #2e4a2e; }
.tile.creature { fill: #4a2e4a; }
.tile.treasure { fill: #4a4a2e; }
.tile.chest { fill: #4a3a2e; }
.tile.attack { fill: #4a2e2e; }
.tile.special { fill: #2e3a4a; }

.tile-icon {
  font-size: 28px;
  fill: white;
  pointer-events: none;
}

.player-marker {
  fill: #d4af37;
  stroke: #fff;
  stroke-width: 3;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.event-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  margin-top: 8px;
}

.event-icon {
  font-size: 20px;
}

.event-text {
  color: #d4af37;
  font-weight: bold;
}

.event-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  margin-top: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
