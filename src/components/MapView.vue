<template>
  <div class="map-container">
    <div class="map-wrapper">
      <svg class="map-svg" viewBox="0 0 300 320">
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
              x="-20" y="-20"
              width="40" height="40"
              rx="6"
            />
            <!-- 地格图标 -->
            <text 
              class="tile-icon"
              text-anchor="middle"
              dominant-baseline="central"
              y="2"
            >
              {{ getTileIcon(tile.type) }}
            </text>
            <!-- 玩家标记 -->
            <circle 
              v-if="index === playerPosition"
              class="player-marker"
              r="8"
              cy="28"
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

// 计算地格位置（矩形网格布局）
function getTileTransform(index: number): string {
  const cols = 5 // 每行5个格子
  const rows = 4 // 共4行
  const tileSize = 40 // 格子边长
  const gap = 50 // 间距（大于格子边长，确保不重叠）

  const col = index % cols
  const row = Math.floor(index / cols)

  // 计算居中偏移
  const totalWidth = cols * gap
  const totalHeight = rows * gap
  const offsetX = (300 - totalWidth) / 2 + gap / 2
  const offsetY = (300 - totalHeight) / 2 + gap / 2

  const x = offsetX + col * gap
  const y = offsetY + row * gap

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
  min-height: 280px;
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
  max-width: 280px;
  max-height: 280px;
}

.tile {
  fill: #2a2a4a;
  stroke: #3a3a5a;
  stroke-width: 1;
  transition: all 0.3s ease;
}

.tile.active {
  stroke: #d4af37;
  stroke-width: 2;
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
}

.tile.resource { fill: #2e4a2e; }
.tile.creature { fill: #4a2e4a; }
.tile.treasure { fill: #4a4a2e; }
.tile.chest { fill: #4a3a2e; }
.tile.attack { fill: #4a2e2e; }
.tile.special { fill: #2e3a4a; }

.tile-icon {
  font-size: 18px;
  fill: white;
  pointer-events: none;
}

.player-marker {
  fill: #d4af37;
  stroke: #fff;
  stroke-width: 2;
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
