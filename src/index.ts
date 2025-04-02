#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const API_BASE_URL = "https://dict.meowrain.cn/api/dictionary/en-cn/";

class DictionaryServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "dictionary-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "lookup_word",
          description:
            "Look up a word's pronunciation, definitions and examples",
          inputSchema: {
            type: "object",
            properties: {
              word: {
                type: "string",
                description: "The word to look up",
              },
            },
            required: ["word"],
          },
        },
      ],
    }));

    // Handle word lookup requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "lookup_word") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const word = request.params.arguments?.word;
      if (typeof word !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Word parameter is required and must be a string"
        );
      }

      try {
        const response = await axios.get(`${API_BASE_URL}${word}`);

        // Transform API response to structured data
        const result = {
          word: response.data.word,
          pronunciation: response.data.pronunciation,
          definitions: response.data.definition.map((def: any) => ({
            partOfSpeech: def.pos,
            definition: def.text,
            translation: def.translation,
            examples: def.example.map((ex: any) => ({
              sentence: ex.text,
              translation: ex.translation,
            })),
          })),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Dictionary API error: ${error.message}`
          );
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Dictionary MCP server running on stdio");
  }
}

const server = new DictionaryServer();
server.run().catch(console.error);
