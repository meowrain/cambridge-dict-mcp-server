# Dictionary Server

[![smithery badge](https://smithery.ai/badge/@meowrain/mcp-server-cambridge-dict)](https://smithery.ai/server/@meowrain/mcp-server-cambridge-dict)

A dictionary server supporting the Model Context Protocol (MCP).

Retrieves word meanings from the Cambridge Dictionary.

## Adding MCP to Command Line

To integrate the MCP server into your command line, add the following configuration:

```json
"mcp-server-cambridge-dict": {
  "command": "npx",
  "args": ["-y", "mcp-server-dictionary"],
  "disabled": false
}
```

## Features

- Seamless integration with Claude and other AI assistants via the MCP protocol.
- Robust dictionary query tools.
- Retrieves word meanings from the Cambridge Dictionary.

## Development

### Install Dependencies

Install the required dependencies:

```bash
npm install
```

### Build the Server

Build the server for production:

```bash
npm run build
```

### Development Mode

Enable auto-rebuild during development:

```bash
npm run watch
```

## Running the Server

Start the MCP server with the following command:

```bash
npm run start:mcp
```

## Testing with MCP Inspector

To test the server, use the MCP Inspector:

```bash
npm run inspector
```

## MCP Response Specification

This server adheres to the MCP response specification.

### Tool Response

A successful word query returns the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Word query result (in JSON format)"
    }
  ]
}
```

### Error Response

In case of an error, the response format is:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error message"
    }
  ],
  "isError": true
}
```

## API Documentation

### `lookup_word`

Fetches the pronunciation, definition, and example sentences for a word.

#### Parameters

- `word` (string): The word to query.

#### Returns

Detailed information about the word, including pronunciation, definition, and example sentences.
