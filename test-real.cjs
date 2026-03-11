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
  require('fs').mkdirSync(screenshotsDir, { recursive: true });
  
  console.log('📱 访问页面...');
  await page.goto('https://iamlixiaoyi80.github.io/h3-cmlike/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // 等待页面加载
  await page.waitForTimeout(3000);
  
  // 截图1: 初始加载状态
  console.log('📸 截图1: 初始加载状态');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '01-initial.png'),
    fullPage: true 
  });
  
  // 检查是否有错误
  const errorText = await page.locator('text=/error|错误|404|not found/i').count();
  if (errorText > 0) {
    console.log('❌ 检测到错误信息');
    const errorContent = await page.locator('body').textContent();
    console.log('页面内容:', errorContent?.substring(0, 500));
  }
  
  // 检查页面标题
  const title = await page.title();
  console.log('📄 页面标题:', title);
  
  // 检查是否有内容
  const bodyText = await page.locator('body').textContent();
  console.log('📝 页面内容长度:', bodyText?.length || 0);
  
  // 检查控制台错误
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 控制台错误:', msg.text());
    }
  });
  
  // 检查是否有Vue应用
  const appExists = await page.locator('#app').count();
  console.log('🔍 #app 元素:', appExists > 0 ? '存在' : '不存在');
  
  // 等待更长时间看是否有动态内容
  await page.waitForTimeout(5000);
  
  // 截图2: 等待后状态
  console.log('📸 截图2: 等待5秒后状态');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '02-after-wait.png'),
    fullPage: true 
  });
  
  // 尝试查找种族选择按钮
  const raceButtons = await page.locator('button, .race-card, .race').count();
  console.log('🔘 可能的种族按钮数量:', raceButtons);
  
  // 尝试查找任何可点击元素
  const buttons = await page.locator('button').all();
  console.log('🔘 按钮数量:', buttons.length);
  
  // 获取页面HTML
  const html = await page.content();
  console.log('📄 HTML长度:', html.length);
  
  // 保存HTML用于调试
  require('fs').writeFileSync(path.join(screenshotsDir, 'page.html'), html);
  console.log('💾 已保存 page.html');
  
  await browser.close();
  console.log('✅ 测试完成');
})();
