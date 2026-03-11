import { test, expect } from '@playwright/test';

const BASE_URL = 'https://iamlixiaoyi80.github.io/h3-cmlike/';

test.describe('H3-CMlike 游戏测试', () => {
  
  test('TC-001: 种族选择界面显示', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // 等待页面加载
    await page.waitForSelector('.race-card', { timeout: 10000 });
    
    // 验证标题
    const title = await page.textContent('h1');
    expect(title).toContain('英雄无敌');
    
    // 验证三个种族选项
    const raceCards = await page.$$('.race-card');
    expect(raceCards.length).toBe(3);
    
    console.log('✅ TC-001 通过：种族选择界面正常显示');
  });

  test('TC-002: 选择骑士堡进入游戏', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    
    // 点击骑士堡
    await page.click('.race-card.knight');
    await page.waitForSelector('.resource-bar', { timeout: 5000 });
    
    // 验证进入游戏界面
    const resourceBar = await page.$('.resource-bar');
    expect(resourceBar).toBeTruthy();
    
    // 截图
    await page.screenshot({ path: 'test-results/tc-002-knight-selected.png', fullPage: true });
    
    console.log('✅ TC-002 通过：成功选择骑士堡进入游戏');
  });

  test('TC-003: 骰子掷出和停止', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.dice', { timeout: 5000 });
    
    // 点击骰子掷出
    await page.click('.dice');
    await page.waitForTimeout(200);
    
    // 验证骰子正在旋转
    const diceClass = await page.getAttribute('.dice', 'class');
    expect(diceClass).toContain('rolling');
    
    // 截图旋转状态
    await page.screenshot({ path: 'test-results/tc-003-dice-rolling.png', fullPage: true });
    
    // 点击停止
    await page.click('.dice');
    await page.waitForTimeout(500);
    
    // 验证骰子已停止
    const diceClassAfter = await page.getAttribute('.dice', 'class');
    expect(diceClassAfter).not.toContain('can-stop');
    
    // 截图停止状态
    await page.screenshot({ path: 'test-results/tc-003-dice-stopped.png', fullPage: true });
    
    console.log('✅ TC-003 通过：骰子掷出和停止功能正常');
  });

  test('TC-004: 资源显示', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.resource-bar', { timeout: 5000 });
    
    // 验证资源栏显示
    const goldValue = await page.textContent('.resource-item.gold .value');
    expect(parseInt(goldValue || '0')).toBeGreaterThan(0);
    
    const woodValue = await page.textContent('.resource-item.wood .value');
    expect(parseInt(woodValue || '0')).toBeGreaterThan(0);
    
    console.log('✅ TC-004 通过：资源显示正常');
  });

  test('TC-005: 英雄显示', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.hero-bar', { timeout: 5000 });
    
    // 验证英雄卡牌显示
    const heroCards = await page.$$('.hero-card');
    expect(heroCards.length).toBeGreaterThanOrEqual(1);
    
    // 验证英雄名称
    const heroName = await page.textContent('.hero-card:first-child .hero-name');
    expect(heroName).toBeTruthy();
    
    console.log('✅ TC-005 通过：英雄显示正常');
  });

  test('TC-006: 生物列表显示', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.castle-info', { timeout: 5000 });
    
    // 验证生物列表
    const creatures = await page.$$('.creature-item');
    expect(creatures.length).toBe(7); // 7级生物
    
    console.log('✅ TC-006 通过：生物列表显示正常（7级生物）');
  });

  test('TC-007: 骰子数量减少', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.dice-count', { timeout: 5000 });
    
    // 获取初始骰子数量
    const initialCount = await page.textContent('.dice-count .count');
    const initialNum = parseInt(initialCount?.split('/')[0] || '0');
    
    // 掷骰子
    await page.click('.dice');
    await page.waitForTimeout(200);
    await page.click('.dice');
    await page.waitForTimeout(500);
    
    // 获取新的骰子数量
    const newCount = await page.textContent('.dice-count .count');
    const newNum = parseInt(newCount?.split('/')[0] || '0');
    
    expect(newNum).toBe(initialNum - 1);
    
    console.log(`✅ TC-007 通过：骰子数量从 ${initialNum} 减少到 ${newNum}`);
  });

  test('TC-008: 三种种族选择', async ({ page }) => {
    test.setTimeout(90000);
    
    // 测试骑士堡
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.knight');
    await page.waitForSelector('.castle-name', { timeout: 5000 });
    let castleName = await page.textContent('.castle-name');
    expect(castleName).toContain('骑士堡');
    
    // 测试精灵堡
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.elf');
    await page.waitForSelector('.castle-name', { timeout: 5000 });
    castleName = await page.textContent('.castle-name');
    expect(castleName).toContain('森林堡');
    
    // 测试墓园
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    await page.click('.race-card.undead');
    await page.waitForSelector('.castle-name', { timeout: 5000 });
    castleName = await page.textContent('.castle-name');
    expect(castleName).toContain('墓园');
    
    console.log('✅ TC-008 通过：三种种族选择功能正常');
  });

  test('TC-009: 完整游戏流程截图', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    
    // 截图1: 种族选择界面
    await page.screenshot({ path: 'test-results/01-race-selection.png', fullPage: true });
    
    // 选择骑士堡
    await page.click('.race-card.knight');
    await page.waitForSelector('.resource-bar', { timeout: 5000 });
    
    // 截图2: 游戏主界面
    await page.screenshot({ path: 'test-results/02-main-interface.png', fullPage: true });
    
    // 掷骰子
    await page.click('.dice');
    await page.waitForTimeout(200);
    
    // 截图3: 骰子旋转
    await page.screenshot({ path: 'test-results/03-dice-rolling.png', fullPage: true });
    
    // 停止骰子
    await page.click('.dice');
    await page.waitForTimeout(1000);
    
    // 截图4: 移动后
    await page.screenshot({ path: 'test-results/04-after-move.png', fullPage: true });
    
    // 再掷一次
    await page.click('.dice');
    await page.waitForTimeout(200);
    await page.click('.dice');
    await page.waitForTimeout(1000);
    
    // 截图5: 多次移动后
    await page.screenshot({ path: 'test-results/05-multiple-moves.png', fullPage: true });
    
    console.log('✅ TC-009 通过：完整流程截图完成');
  });
});
