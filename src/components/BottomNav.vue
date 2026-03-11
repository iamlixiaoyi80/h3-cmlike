<template>
  <div class="bottom-nav">
    <button
      v-for="item in navItems"
      :key="item.id"
      class="nav-btn"
      :class="{ active: activeTab === item.id }"
      @click="$emit('select', item.id)"
    >
      <span class="icon">{{ item.icon }}</span>
      <span class="label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  label: string
}

defineProps<{
  activeTab: string
}>()

defineEmits<{
  select: [tabId: string]
}>()

const navItems: NavItem[] = [
  { id: 'castle', icon: '🏰', label: '城堡' },
  { id: 'hero', icon: '👑', label: '英雄' },
  { id: 'army', icon: '⚔️', label: '部队' },
  { id: 'settings', icon: '⚙️', label: '设置' }
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(15, 15, 35, 0.98) 100%);
  border-top: 2px solid rgba(212, 175, 55, 0.3);
  padding: 8px 0;
  gap: 4px;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 60px;
}

.nav-btn:hover {
  background: rgba(212, 175, 55, 0.1);
}

.nav-btn.active {
  background: rgba(212, 175, 55, 0.2);
}

.nav-btn .icon {
  font-size: 24px;
  line-height: 1;
}

.nav-btn .label {
  font-size: 11px;
  color: #b8b8b8;
}

.nav-btn.active .label {
  color: #d4af37;
  font-weight: 600;
}
</style>
