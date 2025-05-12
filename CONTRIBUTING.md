# Contributing to Darwinbox HRMS MCP Server

Copyright (c) 2025 Darwinbox Private Limited

## License

By contributing to this project, you agree that your contributions will be licensed under its MIT License.

Thank you for your interest in contributing to the Darwinbox HRMS MCP Server! This document provides guidelines and instructions for contributing.

## Code Organization

The project is organized into the following structure:

```
src/
├── auth/
│   └── token.ts         # Authentication and token management
├── tools/
│   ├── core.ts         # Core HRMS tools implementation
│   └── time.ts         # Time management tools implementation
├── types/
│   ├── common.ts       # Shared type definitions
│   ├── core.ts         # Core tools type definitions
│   └── time.ts         # Time management type definitions
└── index.ts            # Main server implementation
```

## Adding New Tools

1. Define the tool's types in the appropriate types file (`core.ts` or `time.ts`)
2. Implement the tool in the corresponding tools file
3. Add the tool to the server's tool list in `index.ts`
4. Document the tool in README.md

Example:

```typescript
// 1. Define types (src/types/core.ts)
export interface NewToolParams {
  param1: string;
  param2: number;
}

// 2. Implement tool (src/tools/core.ts)
async newTool(params: NewToolParams) {
  return this.tokenManager.makeAuthenticatedRequest(
    'POST',
    '/api/endpoint',
    params
  );
}

// 3. Add to server (src/index.ts)
{
  name: 'new_tool',
  description: 'Description of the new tool',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of param1',
      },
      param2: {
        type: 'number',
        description: 'Description of param2',
      },
    },
    required: ['param1', 'param2'],
  },
}
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Update documentation as needed
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Create a Pull Request

## Pull Request Guidelines

- Keep changes focused and atomic
- Include clear description of changes
- Update documentation if needed
- Add tests if applicable
- Follow existing code style
- Ensure all tests pass

## Reporting Issues

When reporting issues, please include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details (OS, Node version, etc.)
6. Any relevant error messages or logs

## Code Style

- Use TypeScript features appropriately
- Follow existing naming conventions
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions focused and manageable
- Handle errors appropriately

## Documentation

- Keep README.md up to date
- Document new features and changes
- Include examples for new tools
- Update type definitions as needed

## Licensing Requirements

- All new files must include the MIT License header
- Contributions must not include code with incompatible licenses
- If you include third-party code, make sure it's compatible with MIT License
- Document any new third-party dependencies in README.md

## Questions or Need Help?

Feel free to open an issue for:
- Questions about implementation
- Clarification on existing features
- Discussion about potential features
- Help with contribution process

Thank you for contributing!
