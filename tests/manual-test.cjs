const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://iamlixiaoyi80.github.io/h3-cmlike/';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  try {
    // TC-001: 种族选择界面
    console.log('🧪 TC-001: 种族选择界面显示...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.race-card', { timeout: 10000 });
    
    const title = await page.textContent('h1');
    const raceCards = await page.$$('.race-card');
    
    if (title?.includes('英雄无敌') && raceCards.length === 3) {
      results.push({ test: 'TC-001', status: '✅ 通过', detail: `标题: ${title}, 种族数: ${raceCards.length}` });
      console.log('✅ TC-001 通过');
    } else {
      results.push({ test: 'TC-001', status: '❌ 失败', detail: `标题或种族数不正确` });
    }
    
    // 截图
    await page.screenshot({ path: 'test-results/01-race-selection.png' });
    
    // TC-002: 选择骑士堡
    console.log('🧪 TC-002: 选择骑士堡进入游戏...');
    await page.click('.race-card.knight');
    await page.waitForSelector('.resource-bar', { timeout: 5000 });
    
    const resourceBar = await page.$('.resource-bar');
    if (resourceBar) {
      results.push({ test: 'TC-002', status: '✅ 通过', detail: '成功进入游戏界面' });
      console.log('✅ TC-002 通过');
    } else {
      results.push({ test: 'TC-002', status: '❌ 失败', detail: '资源栏未显示' });
    }
    
    await page.screenshot({ path: 'test-results/02-main-interface.png' });
    
    // TC-003: 骰子掷出和停止
    console.log('🧪 TC-003: 骰子掷出和停止...');
    await page.waitForSelector('.dice', { timeout: 5000 });
    
    // 点击掷出
    await page.click('.dice', { force: true });
    await page.waitForTimeout(200);
    
    let diceClass = await page.getAttribute('.dice', 'class');
    const isRolling = diceClass?.includes('rolling');
    
    if (isRolling) {
      console.log('  骰子正在旋转...');
      await page.screenshot({ path: 'test-results/03-dice-rolling.png' });
      
      // 点击停止
      await page.click('.dice', { force: true });
      await page.waitForTimeout(500);
      
      diceClass = await page.getAttribute('.dice', 'class');
      const isStopped = !diceClass?.includes('can-stop');
      
      if (isStopped) {
        results.push({ test: 'TC-003', status: '✅ 通过', detail: '骰子掷出和停止功能正常' });
        console.log('✅ TC-003 通过');
      } else {
        results.push({ test: 'TC-003', status: '❌ 失败', detail: '骰子停止功能异常' });
      }
    } else {
      results.push({ test: 'TC-003', status: '❌ 失败', detail: '骰子未开始旋转' });
    }
    
    await page.screenshot({ path: 'test-results/04-after-stop.png' });
    
    // TC-004: 资源显示
    console.log('🧪 TC-004: 资源显示...');
    const goldValue = await page.textContent('.resource-item.gold .value');
    const woodValue = await page.textContent('.resource-item.wood .value');
    
    if (parseInt(goldValue || '0') > 0 && parseInt(woodValue || '0') > 0) {
      results.push({ test: 'TC-004', status: '✅ 通过', detail: `金币: ${goldValue}, 木材: ${woodValue}` });
      console.log('✅ TC-004 通过');
    } else {
      results.push({ test: 'TC-004', status: '❌ 失败', detail: '资源值异常' });
    }
    
    // TC-005: 英雄显示
    console.log('🧪 TC-005: 英雄显示...');
    const heroCards = await page.$$('.hero-card');
    const heroName = await page.textContent('.hero-card:first-child .hero-name');
    
    if (heroCards.length >= 1 && heroName) {
      results.push({ test: 'TC-005', status: '✅ 通过', detail: `英雄数: ${heroCards.length}, 首位英雄: ${heroName}` });
      console.log('✅ TC-005 通过');
    } else {
      results.push({ test: 'TC-005', status: '❌ 失败', detail: '英雄显示异常' });
    }
    
    // TC-006: 生物列表
    console.log('🧪 TC-006: 生物列表显示...');
    const creatures = await page.$$('.creature-item');
    
    if (creatures.length === 7) {
      results.push({ test: 'TC-006', status: '✅ 通过', detail: `生物数: ${creatures.length} (7级)` });
      console.log('✅ TC-006 通过');
    } else {
      results.push({ test: 'TC-006', status: '❌ 失败', detail: `生物数: ${creatures.length}, 预期: 7` });
    }
    
    // TC-007: 骰子数量减少
    console.log('🧪 TC-007: 骰子数量减少...');
    let diceCount = await page.textContent('.dice-count .count');
    const beforeCount = parseInt(diceCount?.split('/')[0] || '0');
    
    await page.click('.dice', { force: true });
    await page.waitForTimeout(200);
    await page.click('.dice', { force: true });
    await page.waitForTimeout(500);
    
    diceCount = await page.textContent('.dice-count .count');
    const afterCount = parseInt(diceCount?.split('/')[0] || '0');
    
    if (afterCount === beforeCount - 1) {
      results.push({ test: 'TC-007', status: '✅ 通过', detail: `骰子从 ${beforeCount} 减少到 ${afterCount}` });
      console.log('✅ TC-007 通过');
    } else {
      results.push({ test: 'TC-007', status: '❌ 失败', detail: `骰子数量未正确减少: ${beforeCount} → ${afterCount}` });
    }
    
    // TC-008: 多次移动后截图
    console.log('🧪 TC-008: 多次移动测试...');
    for (let i = 0; i < 3; i++) {
      await page.click('.dice', { force: true });
      await page.waitForTimeout(200);
      await page.click('.dice', { force: true });
      await page.waitForTimeout(800);
    }
    
    await page.screenshot({ path: 'test-results/05-multiple-moves.png' });
    results.push({ test: 'TC-008', status: '✅ 通过', detail: '多次移动完成' });
    console.log('✅ TC-008 通过');
    
  } catch (error) {
    results.push({ test: 'ERROR', status: '❌ 错误', detail: error.message });
    console.error('❌ 测试错误:', error.message);
  } finally {
    await browser.close();
  }
  
  // 输出结果
  console.log('\n========== 测试结果 ==========');
  let passed = 0, failed = 0;
  results.forEach(r => {
    console.log(`${r.status} ${r.test}: ${r.detail}`);
    if (r.status.includes('✅')) passed++;
    else failed++;
  });
  console.log(`\n总计: ${passed} 通过, ${failed} 失败`);
  
  return { passed, failed, results };
}

runTests().catch(console.error);
