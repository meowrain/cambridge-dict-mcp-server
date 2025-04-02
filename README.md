# Dictionary Server

这是一个支持 Model Context Protocol (MCP) 的词典服务器。

## 功能

- 通过 MCP 协议与 Claude 和其他 AI 助手集成
- 提供词典查询工具

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

启动 MCP 服务器:

```bash
npm run start:mcp
```

## 使用 MCP Inspector 测试

启动 Inspector:

```bash
npm run inspector
```

## MCP 响应规范

此服务器遵循 MCP 响应规范:

### 工具响应

查询单词时，将返回以下格式:

```json
{
  "content": [
    {
      "type": "text",
      "text": "单词查询结果（JSON格式）"
    }
  ]
}
```

### 错误响应

当出现错误时，将返回以下格式:

```json
{
  "content": [
    {
      "type": "text",
      "text": "错误信息"
    }
  ],
  "isError": true
}
```

## API 说明

### lookup_word

查询单词的读音、定义和例句。

**参数:**

- `word`: 要查询的单词 (字符串)

**返回:**
单词的详细信息，包括读音、定义和例句。
