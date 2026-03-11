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
      />
      
      <!-- 城堡信息 -->
      <CastleInfo v-if="castle" :castle="castle" @recruit="recruitCreature" />
      
      <!-- 英雄展示 -->
      <HeroBar :heroes="heroes" />
      
      <!-- 骰子区域 -->
      <DiceArea
        :diceCount="diceCount"
        :maxDice="maxDice"
        :diceValue="diceValue"
        :isRolling="isRolling"
        :canStop="canStop"
        @roll="startRoll"
        @stop="stopRoll"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from './stores/game'
import { storeToRefs } from 'pinia'
import RaceSelection from './components/RaceSelection.vue'
import ResourceBar from './components/ResourceBar.vue'
import MapView from './components/MapView.vue'
import CastleInfo from './components/CastleInfo.vue'
import HeroBar from './components/HeroBar.vue'
import DiceArea from './components/DiceArea.vue'

const store = useGameStore()
const { gamePhase, resources, power, mapTiles, playerPosition, castle, heroes, diceCount, maxDice, diceValue, isRolling, canStop } = storeToRefs(store)
const { selectRace, startRoll, stopRoll, recruitCreature } = store
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
  gap: 8px;
}
</style>
