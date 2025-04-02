#!/bin/bash

# 确保脚本可执行
chmod +x ./debug.sh

# 获取正在监听端口的Node进程信息
echo "=== 当前正在运行的Node进程 ==="
ps aux | grep node | grep -v grep

echo ""
echo "=== 当前占用端口的进程 ==="
echo "端口3000:"
lsof -i :3000 || echo "无进程使用此端口"

echo ""
echo "端口3001:"
lsof -i :3001 || echo "无进程使用此端口"

echo ""
echo "端口3030:"
lsof -i :3030 || echo "无进程使用此端口"

echo ""
echo "=== 环境信息 ==="
echo "Node版本: $(node -v)"
echo "NPM版本: $(npm -v)"

echo ""
echo "=== 检查MCP Inspector依赖 ==="
npm list @modelcontextprotocol/inspector || echo "未找到inspector依赖"
npm list @modelcontextprotocol/sdk || echo "未找到sdk依赖"

echo ""
echo "=== 测试 SSE 连接 ==="
echo "尝试连接到 SSE 端点 (Ctrl+C 结束)"
curl -N http://localhost:3000/sse

echo ""
echo "=== 测试 API 端点 ==="
echo "查询单词 'hello':"
curl -s http://localhost:3000/api/lookup/hello | head -20

echo ""
echo "调试完成"
