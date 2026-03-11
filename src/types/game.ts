// 游戏类型定义

import type {
  Resources,
  Creature,
  Hero,
  Castle,
  Building,
  TileType,
  MapTile
} from '../stores/game'

export type { Resources, Creature, Hero, Castle, Building, TileType, MapTile }

// 重新导出 ArmyUnit 作为 Creature 的别名
export type ArmyUnit = Creature
