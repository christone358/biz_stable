// 开发启动脚本 - 简化版本，避免依赖安装问题

const fs = require('fs');
const path = require('path');

// 创建一个简单的HTML文件用于测试布局
const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>业务保障系统 - 布局测试</title>
    <style>
        /* 引入基础样式 */
        :root {
            --primary-color: #1677FF;
            --success-color: #52C41A;
            --warning-color: #FAAD14;
            --error-color: #FF4D4F;
            --text-primary: #262626;
            --text-secondary: #595959;
            --text-disabled: #BFBFBF;
            --border-color: #D9D9D9;
            --background-base: #FFFFFF;
            --background-layout: #F5F5F5;
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 16px;
            --space-lg: 24px;
            --space-xl: 32px;
            --space-xxl: 48px;
            --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--font-family);
            background: var(--background-layout);
            color: var(--text-primary);
        }

        .dashboard-layout {
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .dashboard-header {
            height: 60px;
            background: var(--background-base);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            padding: 0 var(--space-lg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .dashboard-body {
            flex: 1;
            display: flex;
        }

        .dashboard-sider {
            width: 300px;
            background: #fafafa;
            border-right: 1px solid var(--border-color);
            padding: var(--space-md);
        }

        .dashboard-main {
            flex: 1;
            display: flex;
        }

        .main-content {
            flex: 1;
            padding: var(--space-lg);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
        }

        .content-section {
            background: var(--background-base);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            padding: var(--space-lg);
            min-height: 200px;
        }

        .alert-panel {
            width: 320px;
            border-left: 1px solid var(--border-color);
            background: var(--background-base);
            padding: var(--space-md);
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: var(--space-md);
            color: var(--text-primary);
        }

        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--space-md);
        }

        .kpi-card {
            background: var(--background-base);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: var(--space-md);
            text-align: center;
        }

        .kpi-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: var(--space-xs);
        }

        .kpi-label {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .org-tree {
            margin-bottom: var(--space-md);
        }

        .org-node {
            display: flex;
            align-items: center;
            padding: var(--space-sm);
            margin-bottom: var(--space-xs);
            background: var(--background-base);
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            cursor: pointer;
        }

        .health-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: var(--space-sm);
        }

        .healthy { background: var(--success-color); }
        .warning { background: var(--warning-color); }
        .critical { background: var(--error-color); }
        .unknown { background: var(--text-disabled); }

        .matrix-placeholder {
            width: 100%;
            height: 400px;
            background: #fafafa;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
        }

        .table-placeholder {
            width: 100%;
            min-height: 300px;
            background: #fafafa;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
        }

        .alert-item {
            padding: var(--space-sm);
            margin-bottom: var(--space-xs);
            background: #f6ffed;
            border-left: 3px solid var(--warning-color);
            border-radius: 4px;
            font-size: 12px;
        }

        .alert-time {
            color: var(--text-disabled);
            font-family: monospace;
        }

        .alert-content {
            margin-top: 4px;
            color: var(--text-primary);
        }

        /* 响应式 */
        @media (max-width: 1200px) {
            .kpi-grid { grid-template-columns: repeat(2, 1fr); }
            .alert-panel { width: 280px; }
        }

        @media (max-width: 900px) {
            .dashboard-body { flex-direction: column; }
            .dashboard-sider { width: 100%; height: auto; }
            .dashboard-main { flex-direction: column; }
            .alert-panel {
                width: 100%;
                border-left: none;
                border-top: 1px solid var(--border-color);
                height: 300px;
            }
            .kpi-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="dashboard-layout">
        <div class="dashboard-header">
            <h1>上海市大数据中心业务健康总览页</h1>
        </div>

        <div class="dashboard-body">
            <div class="dashboard-sider">
                <div class="card-title">组织架构</div>
                <div class="org-tree">
                    <div class="org-node">
                        <div class="health-indicator warning"></div>
                        <span>市大数据中心 (156)</span>
                    </div>
                    <div class="org-node" style="margin-left: 20px;">
                        <div class="health-indicator warning"></div>
                        <span>市公安局 (23)</span>
                    </div>
                    <div class="org-node" style="margin-left: 20px;">
                        <div class="health-indicator healthy"></div>
                        <span>市民政局 (12)</span>
                    </div>
                    <div class="org-node" style="margin-left: 20px;">
                        <div class="health-indicator critical"></div>
                        <span>市市场监管局 (18)</span>
                    </div>
                    <div class="org-node" style="margin-left: 20px;">
                        <div class="health-indicator healthy"></div>
                        <span>市教委 (15)</span>
                    </div>
                    <div class="org-node" style="margin-left: 20px;">
                        <div class="health-indicator warning"></div>
                        <span>市卫生健康委 (21)</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-main">
                <div class="main-content">
                    <!-- KPI指标卡 -->
                    <div class="content-section">
                        <div class="card-title">KPI指标</div>
                        <div class="kpi-grid">
                            <div class="kpi-card">
                                <div class="kpi-value">156</div>
                                <div class="kpi-label">总业务系统</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-value" style="color: var(--error-color);">23</div>
                                <div class="kpi-label">异常系统</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-value" style="color: var(--error-color);">12</div>
                                <div class="kpi-label">未处理紧急告警</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-value" style="color: var(--error-color);">8</div>
                                <div class="kpi-label">未修复高危漏洞</div>
                            </div>
                        </div>
                    </div>

                    <!-- 矩阵图 -->
                    <div class="content-section">
                        <div class="card-title">业务健康状态矩阵图</div>
                        <div class="matrix-placeholder">
                            D3.js 矩阵图展示区域
                        </div>
                    </div>

                    <!-- 系统列表 -->
                    <div class="content-section">
                        <div class="card-title">核心业务系统状态列表</div>
                        <div class="table-placeholder">
                            系统状态表格展示区域
                        </div>
                    </div>
                </div>

                <div class="alert-panel">
                    <div class="card-title">实时告警与漏洞摘要</div>

                    <div class="alert-item">
                        <div class="alert-time">14:30</div>
                        <div class="alert-content">
                            <strong>市公安局执法系统</strong>：数据库连接失败
                        </div>
                    </div>

                    <div class="alert-item">
                        <div class="alert-time">14:25</div>
                        <div class="alert-content">
                            <strong>市民政局救助系统</strong>：发现SQL注入漏洞
                        </div>
                    </div>

                    <div class="alert-item">
                        <div class="alert-time">14:20</div>
                        <div class="alert-content">
                            <strong>市教委学籍系统</strong>：CPU使用率超过90%
                        </div>
                    </div>

                    <div class="alert-item">
                        <div class="alert-time">14:15</div>
                        <div class="alert-content">
                            <strong>市财政局预算系统</strong>：磁盘空间不足
                        </div>
                    </div>

                    <div class="alert-item">
                        <div class="alert-time">14:10</div>
                        <div class="alert-content">
                            <strong>市卫健委监管系统</strong>：网络延迟过高
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 简单的交互效果
        document.querySelectorAll('.org-node').forEach(node => {
            node.addEventListener('click', () => {
                document.querySelectorAll('.org-node').forEach(n => n.style.background = 'var(--background-base)');
                node.style.background = '#e6f7ff';
            });
        });

        // 模拟数据更新
        setInterval(() => {
            const alerts = document.querySelectorAll('.alert-item');
            if (alerts.length > 0) {
                const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
                randomAlert.style.background = '#fff2f0';
                setTimeout(() => {
                    randomAlert.style.background = '#f6ffed';
                }, 1000);
            }
        }, 5000);

        console.log('布局测试页面已加载');
        console.log('当前屏幕宽度:', window.innerWidth);
        console.log('布局应该正常显示所有区域：');
        console.log('- 顶部标题栏');
        console.log('- 左侧组织架构树');
        console.log('- 中间主内容区（KPI卡片、矩阵图、系统列表）');
        console.log('- 右侧告警面板');
    </script>
</body>
</html>
`;

// 写入测试文件
fs.writeFileSync(path.join(__dirname, 'layout-test.html'), htmlContent);

console.log('✅ 布局测试文件已创建: layout-test.html');
console.log('📱 请在浏览器中打开该文件查看布局效果');
console.log('🔧 修复的主要问题:');
console.log('   1. CSS变量定义错误 (--font-family)');
console.log('   2. 响应式断点过于激进 (1366px -> 900px)');
console.log('   3. 布局容器层级结构优化');
console.log('   4. 各组件响应式规则调整');