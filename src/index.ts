#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

const API_BASE_URL = "https://dict.meowrain.cn/api/dictionary/en-cn/";

// 定义API响应类型
interface DictionaryEntry {
  word: string;
  pronunciation: string;
  definition: Array<{
    pos: string;
    text: string;
    translation: string;
    example: Array<{
      text: string;
      translation: string;
    }>;
  }>;
}

class DictionaryServer {
  private server: McpServer;
  constructor() {
    this.server = new McpServer({
      name: "dictionary-server",
      version: "0.0.1",
    });

    // 设置工具和提示
    this.setupPrompt();
    this.setupTools();

    // 错误处理
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupTools() {
    // 使用高级tool API定义词典查询工具
    this.server.tool(
      "lookup_word",
      { word: z.string().min(1).describe("The word to look up") },
      async ({ word }) => {
        try {
          const response = await axios.get<DictionaryEntry>(
            `${API_BASE_URL}${word}`
          );
          const data = response.data;

          // 符合MCP工具响应格式
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // 符合MCP错误响应格式
            return {
              content: [
                {
                  type: "text",
                  text: `Dictionary API error: ${error.message}`,
                },
              ],
              isError: true, // 标记为错误响应
            };
          }
          throw error;
        }
      }
    );
  }

  private setupPrompt() {
    this.server.prompt(
      "Detailed-explanation",
      { word: z.string().min(1).describe("The word to explain") },
      ({ word }) => {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `你好，你是Taffy，是一个猫娘。我是一个正在学习英文的中国人，我希望深入地学习词汇"${word}"，并从多个维度理解它。请按照以下步骤为我详细解析：

---
**Step1: 多维定义**
- 国际音标（IPA）标注英美发音差异，并用括号注明地区标签
- 按词性分类解释（名词/动词/形容词等），每个词性下列出3-5个核心定义
- 添加词频数据：COCA语料库中的使用频率分级（如高频/中频/低频）
- 给出每个意思的例句和翻译

**Step2: 动态语境**
- 创建"语境矩阵"：将例句按正式程度（正式/中性/非正式）和场景维度（商务/学术/日常）分类
- 增设"典型错误"板块：展示中国学习者常见误用案例及修正（如与中文直译的冲突）
- 句子要带中文翻译

**Step3: 词汇星系** 
- 要求使用mermaid绘制，同时关联词也要用mermaid绘制，表明其使用场景(单词要带中文翻译）(mermaid 11.4.0) 要求最好是彩色的，越规整好看越好
- 视觉化呈现关系网：用星图形式展示同义词（亮度=相似度）、反义词（红色箭头）、派生词（卫星节点）
- 新增"语义光谱"：用温度计图示显示近义词的强度差异（如angry[50°] vs furious[90°])

📌 语义光谱（表达强度）  （表格表示）
微弱	中等	强烈
interest	enthusiasm	zeal
motivation	passion	fanaticism

**Step4: 词源考古**
- 时间轴展示：古英语/拉丁语等源头 → 中古英语变形 → 现代英语定型 (mermaid展示）
- 词根拆解：用颜色标记前缀/词根/后缀（如**re**<span style="color:blue;">(again)</span> + **ceive**<span style="color:green;">(take)</span>）

**Step5: 文化透镜**
- 名人名言库：精选3句来自文学/电影/领袖的经典引用
- 历史瞬间：描述该词改变历史进程的案例（如关键法律文件中的使用）

**Step6: 沉浸式训练**
- 生成可选择主角的交互故事（商务人士/留学生/科幻角色）
- 设计"词汇抉择"游戏：在故事关键节点提供多个近义词选项，要求根据语境选择最佳用词

**Step7: 跨界连接**
- 学术领域：指出在特定学科中的特殊含义（如"significant"在统计学中的意义）
- 文化密码：解析歌词/影视梗/网络迷因中的创造性用法

**Step8: 智能记忆**
- 根据用户历史错误生成定制化记忆口诀
- 提供基于记忆曲线的复习计划表（首次学习→1天后→1周后→1月后）

**特别要求：**
- 用emoji图标区分内容类型（📖定义 / 🎬例句 / ⚡错误提示）
- 所有例句必须来自真实语料库（标注来源如COCA/TIME）
- 复杂定义采用"三明治解释法"：简单定义→专业定义→隐喻类比

请对词汇"${word}"进行全面分析。`,
              },
            },
          ],
        };
      }
    );
  }

  async run() {
    // 保持原有的stdio连接
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Dictionary MCP server running on stdio");
  }
}

const server = new DictionaryServer();
server.run().catch(console.error);
