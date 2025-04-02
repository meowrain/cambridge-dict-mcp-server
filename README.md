# Dictionary Server

这是一个支持 Model Context Protocol (MCP) 和 Server-Sent Events (SSE) 的词典服务器。

## 功能

### MCP 功能

- 通过 MCP 协议与 Claude 和其他 AI 助手集成
- 提供词典查询工具

### Web API 功能

- RESTful API 端点用于词典查询
- SSE 端点用于实时词典查询结果
- 简单的 Web 界面用于测试

## 开发

安装依赖:

```bash
npm install
```

构建服务器:

```bash
npm run build
```

开发模式（自动重建）:

```bash
npm run watch
```

## 运行

启动 Web 服务器:

```bash
npm start
```

默认端口为 3000，可通过环境变量更改:

```bash
PORT=8080 npm start
```

启动 MCP 服务器:

```bash
npm run start:mcp
```

## API 使用

### REST API

查询单词:
