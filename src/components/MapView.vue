<template>
  <div class="map-container">
    <div class="map-wrapper">
      <svg class="map-svg" viewBox="0 0 300 300">
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
  </div>
</template>

<script setup lang="ts">
import type { MapTile } from '../stores/game'

defineProps<{
  tiles: MapTile[]
  playerPosition: number
  currentTile: MapTile
}>()

// 计算地格位置（环形布局）
function getTileTransform(index: number): string {
  const total = 24
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  const radius = 110
  const cx = 150
  const cy = 150
  const x = cx + radius * Math.cos(angle)
  const y = cy + radius * Math.sin(angle)
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
</style>
