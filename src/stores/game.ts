import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 资源类型
export interface Resources {
  gold: number
  wood: number
  ore: number
  crystal: number
  gems: number
}

// 生物
export interface Creature {
  id: string
  name: string
  upgradedName: string
  level: number
  tier: number
  count: number
  attack: number
  defense: number
  speed: number
  hp: number
  cost: number
}

// 英雄
export interface Hero {
  id: string
  name: string
  race: 'knight' | 'elf' | 'undead'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  skill: string
  stars: number
  level: number
  attack: number
  defense: number
  magicPower: number
  speed: number
  experience: number
  maxExperience: number
}

// 城堡
export interface Castle {
  race: 'knight' | 'elf' | 'undead'
  name: string
  level: number
  defense: number
  goldProduction: number
  buildings: Building[]
  creatures: Creature[]
  availableCreatures: Creature[]
}

// 建筑
export interface Building {
  id: string
  name: string
  type: 'resource' | 'creature' | 'special'
  level: number
  maxLevel: number
}

// 地格类型
export type TileType = 'resource' | 'creature' | 'treasure' | 'chest' | 'attack' | 'special' | 'empty'

// 地图格子
export interface MapTile {
  id: number
  type: TileType
  resource?: keyof Resources
  amount?: number
  creature?: Creature
}

// 游戏状态
export const useGameStore = defineStore('game', () => {
  // 游戏阶段
  const gamePhase = ref<'select-race' | 'playing'>('select-race')
  
  // 骰子状态
  const diceCount = ref(30)
  const maxDice = ref(50)
  const diceValue = ref(1)
  const isRolling = ref(false)
  const canStop = ref(false)
  const showResult = ref(false)      // 显示掷骰结果
  const readyToMove = ref(false)     // 准备移动（等待玩家确认）

  // 玩家位置
  const playerPosition = ref(0)
  const isMoving = ref(false)
  const eventMessage = ref<string>('')
  
  // 资源
  const resources = ref<Resources>({
    gold: 1000,
    wood: 100,
    ore: 50,
    crystal: 10,
    gems: 5
  })
  
  // 城堡
  const castle = ref<Castle | null>(null)
  
  // 英雄
  const heroes = ref<Hero[]>([])
  
  // 地图
  const mapTiles = ref<MapTile[]>(generateMap())
  
  // 战斗力
  const power = computed(() => {
    let total = 0
    heroes.value.forEach(h => {
      total += h.attack * 10 + h.defense * 5
    })
    if (castle.value) {
      castle.value.creatures.forEach(c => {
        total += c.count * (c.attack + c.defense)
      })
    }
    return total
  })
  
  // 选择种族
  function selectRace(race: 'knight' | 'elf' | 'undead') {
    const raceNames: Record<string, string> = {
      knight: '骑士堡',
      elf: '森林堡',
      undead: '墓园'
    }
    
    const creatures = getRaceCreatures(race)
    const firstCreature = creatures[0]
    
    castle.value = {
      race,
      name: raceNames[race] || '未知城堡',
      level: 1,
      defense: 100,
      goldProduction: 500,
      buildings: [
        { id: 'gold_mine', name: '金矿', type: 'resource', level: 1, maxLevel: 100 },
        { id: 'creature_1', name: (firstCreature?.name || '生物') + '巢穴', type: 'creature', level: 1, maxLevel: 100 },
      ],
      creatures: creatures.map(c => ({ ...c })),
      availableCreatures: creatures.map(c => ({ ...c, count: 0 }))
    }
    
    // 初始英雄
    // 初始英雄
    const raceHeroes = getRaceHeroes(race)
    heroes.value = raceHeroes.slice(0, 1).map(h => ({
      ...h,
      level: 1,
      magicPower: 2,
      speed: 5,
      experience: 0,
      maxExperience: 100
    }))
    
    gamePhase.value = 'playing'
  }
  
  // 掷骰子
  function startRoll() {
    if (diceCount.value <= 0 || isRolling.value || readyToMove.value) return
    diceCount.value--
    isRolling.value = true
    canStop.value = true
    showResult.value = false
    // 滚动期间不设置 diceValue，保持显示"?"
  }

  // 停止骰子
  function stopRoll() {
    if (!canStop.value) return
    // 生成最终点数
    diceValue.value = Math.floor(Math.random() * 6) + 1
    isRolling.value = false
    canStop.value = false
    showResult.value = true
    readyToMove.value = true
  }

  // 确认移动
  async function confirmMove() {
    if (!readyToMove.value) return
    readyToMove.value = false
    showResult.value = false

    // 移动玩家
    await movePlayer(diceValue.value)
  }
  
  // 移动玩家（逐步移动，每格300ms）
  async function movePlayer(steps: number) {
    if (isMoving.value) return
    isMoving.value = true

    const totalTiles = mapTiles.value.length

    for (let i = 0; i < steps; i++) {
      // 移动到下一格
      playerPosition.value = (playerPosition.value + 1) % totalTiles

      // 获取当前地格
      const tile = mapTiles.value[playerPosition.value]
      if (tile) {
        // 触发事件
        triggerTileEvent(tile)
        // 显示事件消息
        showEventMessage(tile)
      }

      // 等待300ms再移动下一格
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    isMoving.value = false
  }

  // 显示事件消息
  function showEventMessage(tile: MapTile) {
    switch (tile.type) {
      case 'resource':
        if (tile.resource && tile.amount) {
          eventMessage.value = `💰 获得了 ${tile.amount} ${getResourceName(tile.resource)}！`
        }
        break
      case 'creature':
        eventMessage.value = `🐉 发现了生物！已加入城堡。`
        break
      case 'chest':
        const gold = Math.floor(Math.random() * 500) + 100
        eventMessage.value = `🎁 打开宝箱，获得了 ${gold} 金币！`
        break
      case 'treasure':
        eventMessage.value = `📦 发现了宝物！`
        break
      case 'attack':
        eventMessage.value = `⚔️ 遭遇敌人！可以发起攻击！`
        break
      case 'special':
        eventMessage.value = `✨ 触发特殊事件！`
        break
      default:
        eventMessage.value = ''
    }

    // 3秒后清除消息
    setTimeout(() => {
      eventMessage.value = ''
    }, 3000)
  }

  // 获取资源名称
  function getResourceName(resource: keyof Resources): string {
    const names: Record<string, string> = {
      gold: '金币',
      wood: '木材',
      ore: '矿石',
      crystal: '水晶',
      gems: '宝石'
    }
    return names[resource] || resource
  }
  
  // 触发地格事件
  function triggerTileEvent(tile: MapTile) {
    switch (tile.type) {
      case 'resource':
        if (tile.resource && tile.amount) {
          resources.value[tile.resource] += tile.amount
        }
        break
      case 'creature':
        if (castle.value) {
          const existing = castle.value.creatures.find(c => c.level === 1)
          if (existing) {
            existing.count += Math.floor(Math.random() * 5) + 1
          }
        }
        break
      case 'chest':
        // 宝箱：经验或金币
        const gold = Math.floor(Math.random() * 500) + 100
        resources.value.gold += gold
        break
      case 'treasure':
        // 宝物
        break
      case 'attack':
        // 攻击
        break
    }
  }
  
  // 招募生物
  function recruitCreature(creatureId: string) {
    if (!castle.value) return

    const availableCreature = castle.value.availableCreatures.find(c => c.id === creatureId)
    const ownedCreature = castle.value.creatures.find(c => c.id === creatureId)

    if (!availableCreature || !ownedCreature || resources.value.gold < availableCreature.cost) return

    resources.value.gold -= availableCreature.cost
    ownedCreature.count++
  }
  
  // 恢复骰子
  function restoreDice() {
    if (diceCount.value < maxDice.value) {
      diceCount.value = Math.min(diceCount.value + 1, maxDice.value)
    }
  }
  
  return {
    gamePhase,
    diceCount,
    maxDice,
    diceValue,
    isRolling,
    canStop,
    showResult,
    readyToMove,
    playerPosition,
    isMoving,
    eventMessage,
    resources,
    castle,
    heroes,
    mapTiles,
    power,
    selectRace,
    startRoll,
    stopRoll,
    confirmMove,
    recruitCreature,
    restoreDice
  }
})

// 生成地图
function generateMap(): MapTile[] {
  const tiles: MapTile[] = []
  const types: TileType[] = ['resource', 'resource', 'creature', 'chest', 'treasure', 'attack', 'special', 'empty']
  const resourceTypes: (keyof Resources)[] = ['gold', 'wood', 'ore', 'crystal', 'gems']

  // 生成16个格子（完整闭环矩形环：顶边5格 + 右边3格 + 底边5格 + 左边3格）
  for (let i = 0; i < 16; i++) {
    const typeIndex = Math.floor(Math.random() * types.length)
    const type = types[typeIndex] || 'empty'
    const tile: MapTile = {
      id: i,
      type,
    }

    if (type === 'resource') {
      const resIndex = Math.floor(Math.random() * resourceTypes.length)
      tile.resource = resourceTypes[resIndex] || 'gold'
      tile.amount = Math.floor(Math.random() * 200) + 50
    }

    tiles.push(tile)
  }

  return tiles
}

// 获取种族生物
function getRaceCreatures(race: 'knight' | 'elf' | 'undead'): Creature[] {
  const creaturesByRace: Record<string, Creature[]> = {
    knight: [
      { id: 'knight_1', name: '枪兵', upgradedName: '长枪兵', level: 1, tier: 1, count: 20, attack: 6, defense: 5, speed: 4, hp: 10, cost: 60 },
      { id: 'knight_2', name: '弓箭手', upgradedName: '神射手', level: 2, tier: 2, count: 10, attack: 6, defense: 3, speed: 5, hp: 8, cost: 100 },
      { id: 'knight_3', name: '狮鹫', upgradedName: '皇家狮鹫', level: 3, tier: 3, count: 5, attack: 8, defense: 8, speed: 7, hp: 15, cost: 200 },
      { id: 'knight_4', name: '剑士', upgradedName: '十字军', level: 4, tier: 4, count: 3, attack: 10, defense: 12, speed: 5, hp: 20, cost: 300 },
      { id: 'knight_5', name: '僧侣', upgradedName: '狂热者', level: 5, tier: 5, count: 2, attack: 12, defense: 7, speed: 6, hp: 18, cost: 500 },
      { id: 'knight_6', name: '骑兵', upgradedName: '冠军骑士', level: 6, tier: 6, count: 1, attack: 15, defense: 15, speed: 8, hp: 25, cost: 1000 },
      { id: 'knight_7', name: '天使', upgradedName: '大天使', level: 7, tier: 7, count: 0, attack: 20, defense: 20, speed: 9, hp: 30, cost: 3000 },
    ],
    elf: [
      { id: 'elf_1', name: '半人马', upgradedName: '半人马首领', level: 1, tier: 1, count: 20, attack: 5, defense: 3, speed: 6, hp: 8, cost: 60 },
      { id: 'elf_2', name: '矮人', upgradedName: '战斗矮人', level: 2, tier: 2, count: 10, attack: 6, defense: 7, speed: 3, hp: 12, cost: 100 },
      { id: 'elf_3', name: '精灵', upgradedName: '大精灵', level: 3, tier: 3, count: 5, attack: 9, defense: 5, speed: 7, hp: 10, cost: 200 },
      { id: 'elf_4', name: '飞马', upgradedName: '银飞马', level: 4, tier: 4, count: 3, attack: 9, defense: 8, speed: 9, hp: 15, cost: 300 },
      { id: 'elf_5', name: '树精', upgradedName: '枯木卫士', level: 5, tier: 5, count: 2, attack: 11, defense: 13, speed: 4, hp: 22, cost: 500 },
      { id: 'elf_6', name: '独角兽', upgradedName: '战争独角兽', level: 6, tier: 6, count: 1, attack: 15, defense: 14, speed: 8, hp: 24, cost: 1000 },
      { id: 'elf_7', name: '绿龙', upgradedName: '金龙', level: 7, tier: 7, count: 0, attack: 18, defense: 19, speed: 10, hp: 35, cost: 3000 },
    ],
    undead: [
      { id: 'undead_1', name: '骷髅', upgradedName: '骷髅勇士', level: 1, tier: 1, count: 30, attack: 5, defense: 4, speed: 5, hp: 6, cost: 60 },
      { id: 'undead_2', name: '僵尸', upgradedName: '僵尸领主', level: 2, tier: 2, count: 15, attack: 5, defense: 5, speed: 3, hp: 10, cost: 100 },
      { id: 'undead_3', name: '幽灵', upgradedName: '怨灵', level: 3, tier: 3, count: 8, attack: 7, defense: 7, speed: 8, hp: 8, cost: 200 },
      { id: 'undead_4', name: '吸血鬼', upgradedName: '吸血鬼王', level: 4, tier: 4, count: 4, attack: 10, defense: 9, speed: 7, hp: 14, cost: 300 },
      { id: 'undead_5', name: '尸巫', upgradedName: '尸巫王', level: 5, tier: 5, count: 2, attack: 13, defense: 10, speed: 5, hp: 18, cost: 500 },
      { id: 'undead_6', name: '死骑', upgradedName: '地狱骑士', level: 6, tier: 6, count: 1, attack: 16, defense: 16, speed: 6, hp: 26, cost: 1000 },
      { id: 'undead_7', name: '骨龙', upgradedName: '幽灵龙', level: 7, tier: 7, count: 0, attack: 17, defense: 16, speed: 9, hp: 32, cost: 3000 },
    ]
  }
  
  return creaturesByRace[race] || []
}

// 获取种族英雄
function getRaceHeroes(race: 'knight' | 'elf' | 'undead'): Hero[] {
  const heroesByRace: Record<string, Omit<Hero, 'level' | 'magicPower' | 'speed' | 'experience' | 'maxExperience'>[]> = {
    knight: [
      { id: 'katherine', name: '凯瑟琳女王', race: 'knight', rarity: 'legendary', skill: '领袖光环：全军攻击+10%', stars: 3, attack: 2, defense: 2 },
      { id: 'christian', name: '克里斯丁', race: 'knight', rarity: 'epic', skill: '战斗狂热：攻击伤害+8%', stars: 2, attack: 3, defense: 1 },
      { id: 'lord', name: '罗德哈特', race: 'knight', rarity: 'rare', skill: '骑兵精通：骑兵攻击+15%', stars: 1, attack: 2, defense: 1 },
    ],
    elf: [
      { id: 'alissa', name: '艾丽莎', race: 'elf', rarity: 'legendary', skill: '资源精通：采集资源+15%', stars: 3, attack: 1, defense: 2 },
      { id: 'serena', name: '瑟琳娜', race: 'elf', rarity: 'epic', skill: '自然守护：精灵族防御+10%', stars: 2, attack: 1, defense: 3 },
      { id: 'gru', name: '格鲁', race: 'elf', rarity: 'rare', skill: '龙语者：龙族攻击+20%', stars: 1, attack: 2, defense: 1 },
    ],
    undead: [
      { id: 'vail', name: '维尔', race: 'undead', rarity: 'legendary', skill: '防御专家：城堡耐久+20%', stars: 3, attack: 1, defense: 3 },
      { id: 'sandro', name: '山德鲁', race: 'undead', rarity: 'epic', skill: '亡灵召唤：骷髅产出+50%', stars: 2, attack: 2, defense: 2 },
      { id: 'aisa', name: '艾莎', race: 'undead', rarity: 'rare', skill: '黑暗魔法：诅咒伤害+25%', stars: 1, attack: 3, defense: 1 },
    ]
  }

  return heroesByRace[race]?.map(h => ({
    ...h,
    level: 1,
    magicPower: 2,
    speed: 5,
    experience: 0,
    maxExperience: 100
  })) || []
}
