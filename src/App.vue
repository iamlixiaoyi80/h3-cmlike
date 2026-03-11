<template>
  <div class="game">
    <!-- 种族选择界面 -->
    <RaceSelection v-if="gamePhase === 'select-race'" @select="selectRace" />

    <!-- 主游戏界面 -->
    <div v-else class="game-container">
      <!-- 顶部资源栏 -->
      <ResourceBar :resources="resources" :power="power" />

      <!-- 地图区域 -->
      <MapView
        :tiles="mapTiles"
        :playerPosition="playerPosition"
        :currentTile="mapTiles[playerPosition]!"
        :eventToasts="eventToasts"
      />

      <!-- 骰子区域 -->
      <DiceArea
        :diceCount="diceCount"
        :maxDice="maxDice"
        :diceValue="diceValue"
        :isRolling="isRolling"
        :canStop="canStop"
        :showResult="showResult"
        :isMoving="isMoving"
        @roll="startRoll"
        @stop="stopRoll"
      />

      <!-- 底部导航栏 -->
      <BottomNav :active-tab="activeTab" @select="handleNavSelect" />
    </div>

    <!-- 城堡弹窗 -->
    <CastleModal
      :show="showCastleModal"
      :castle="castle"
      :resources="resources"
      @close="showCastleModal = false"
      @recruit="recruitCreature"
    />

    <!-- 英雄弹窗 -->
    <HeroModal
      :show="showHeroModal"
      :heroes="heroes"
      @close="showHeroModal = false"
    />

    <!-- 部队弹窗 -->
    <ArmyModal
      :show="showArmyModal"
      :army="castle?.creatures || []"
      @close="showArmyModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from './stores/game'
import { storeToRefs } from 'pinia'
import RaceSelection from './components/RaceSelection.vue'
import ResourceBar from './components/ResourceBar.vue'
import MapView from './components/MapView.vue'
import DiceArea from './components/DiceArea.vue'
import BottomNav from './components/BottomNav.vue'
import CastleModal from './components/CastleModal.vue'
import HeroModal from './components/HeroModal.vue'
import ArmyModal from './components/ArmyModal.vue'

const store = useGameStore()
const {
  gamePhase,
  resources,
  power,
  mapTiles,
  playerPosition,
  castle,
  heroes,
  diceCount,
  maxDice,
  diceValue,
  isRolling,
  canStop,
  showResult,
  isMoving,
  eventToasts
} = storeToRefs(store)
const { selectRace, startRoll, stopRoll, recruitCreature } = store

// 弹窗状态
const activeTab = ref('')
const showCastleModal = ref(false)
const showHeroModal = ref(false)
const showArmyModal = ref(false)

// 处理导航选择
function handleNavSelect(tabId: string) {
  activeTab.value = tabId

  // 关闭所有弹窗
  showCastleModal.value = false
  showHeroModal.value = false
  showArmyModal.value = false

  // 根据选择的标签打开对应弹窗
  switch (tabId) {
    case 'castle':
      showCastleModal.value = true
      break
    case 'hero':
      showHeroModal.value = true
      break
    case 'army':
      showArmyModal.value = true
      break
    case 'settings':
      // 设置功能待实现
      break
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  min-height: 100vh;
  color: #e0e0e0;
}

.game {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 8px;
  padding-bottom: 70px;
  gap: 8px;
}
</style>
