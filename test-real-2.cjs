const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true
  });
  
  const page = await context.newPage();
  
  const screenshotsDir = path.join(__dirname, 'test-real-screenshots');
  
  // 收集控制台错误
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // 收集页面错误
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  console.log('📱 访问页面...');
  await page.goto('https://iamlixiaoyi80.github.io/h3-cmlike/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  await page.waitForTimeout(2000);
  
  // 截图1: 种族选择
  console.log('📸 截图1: 种族选择界面');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '01-race-selection.png'),
    fullPage: true 
  });
  
  // 检查种族卡片
  const raceCards = await page.locator('.race-card').all();
  console.log('🏰 种族卡片数量:', raceCards.length);
  
  // 点击第一个种族（骑士堡）
  console.log('👆 点击骑士堡...');
  await raceCards[0].click();
  
  await page.waitForTimeout(1500);
  
  // 截图2: 进入游戏后
  console.log('📸 截图2: 进入游戏后');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '02-after-select-race.png'),
    fullPage: true 
  });
  
  // 检查是否进入游戏界面
  const diceArea = await page.locator('.dice-area, .game-interface, .main-game').count();
  console.log('🎮 游戏界面元素:', diceArea > 0 ? '存在' : '不存在');
  
  // 查找骰子相关元素
  const diceElements = await page.locator('[class*="dice"], [class*="roll"]').count();
  console.log('🎲 骰子相关元素:', diceElements);
  
  // 获取当前页面内容
  const bodyText = await page.locator('body').textContent();
  console.log('📝 当前内容:', bodyText?.substring(0, 300));
  
  // 查找可点击的骰子按钮
  const rollButton = await page.locator('button:has-text("掷骰"), button:has-text("投掷"), .dice-button, .roll-btn').first();
  const rollButtonExists = await rollButton.count() > 0;
  console.log('🎲 掷骰按钮:', rollButtonExists ? '存在' : '不存在');
  
  if (rollButtonExists) {
    console.log('👆 点击掷骰...');
    await rollButton.click();
    await page.waitForTimeout(2000);
    
    // 截图3: 掷骰后
    console.log('📸 截图3: 掷骰后');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '03-after-roll.png'),
      fullPage: true 
    });
  }
  
  // 检查资源显示
  const resources = await page.locator('.resource, .resources, [class*="resource"]').count();
  console.log('💰 资源显示元素:', resources);
  
  // 检查英雄显示
  const heroes = await page.locator('.hero, [class*="hero"]').count();
  console.log('🦸 英雄元素:', heroes);
  
  // 保存最终HTML
  const html = await page.content();
  require('fs').writeFileSync(path.join(screenshotsDir, 'final-page.html'), html);
  
  // 输出错误
  if (errors.length > 0) {
    console.log('\n❌ 发现错误:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('\n✅ 无控制台错误');
  }
  
  await browser.close();
  console.log('✅ 测试完成');
})();
