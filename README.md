# Darwinbox HRMS MCP Server

The Darwinbox-MCP Server is a unified interface replacing traditional APIs for interacting with LLMs and agents. It abstracts underlying AI logic and provides context-aware routing across HR workflows. Built for modularity, it enables seamless integration of intelligent agents into Darwinbox.

## Features

- Core HRMS Tools
  - Employee Management
  - Position Management
  - Document Management
  - Forms & Data Management
  - Separation Management

- Time Management Tools
  - Attendance Management
  - Leave Management
  - Holiday Management
  - Time Tracking

- Recruitment Tools
  - Job Listings
  - Candidate Management
  - Application Tracking

## Prerequisites

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install darwinbox-mcp
```

## Configuration

### Environment Variables

The server requires the following environment variables:

```env
DARWINBOX_DOMAIN=your-domain
DARWINBOX_CLIENT_ID=your-client-id
DARWINBOX_CLIENT_SECRET=your-client-secret
DARWINBOX_GRANT_TYPE=your-grant-type
DARWINBOX_CODE=your-code
DARWINBOX_DATASET_KEY=your-dataset-key
```

Create a `.env` file in your project root and add these variables with your values.

### Cline Configuration

To use this MCP server with Cline, add the following configuration to your Cline MCP configuration file (typically located at `~/.config/cline/mcp.json`):

1. Configure environment variables in `~/.config/cline/env/darwinbox.env`:
```env
DARWINBOX_DOMAIN=your-domain
DARWINBOX_CLIENT_ID=your-client-id
DARWINBOX_CLIENT_SECRET=your-client-secret
DARWINBOX_GRANT_TYPE=your-grant-type
DARWINBOX_CODE=your-code
DARWINBOX_DATASET_KEY=your-dataset-key
```

2. Add server configuration:

```json
{
  "servers": {
    "darwinbox": {
      "command": "npx darwinbox-mcp",
      "cwd": "/path/to/darwinbox-mcp",
      "tools": [
        "get_employee_details",
        "update_employee",
        "get_monthly_attendance",
        "approve_leave",
        "get_job_listings"
        // Add other tools as needed
      ]
    }
  }
}
```

### Claude Desktop Configuration

To use this MCP server with Claude Desktop:

1. Create an environment file at `/path/to/darwinbox-mcp/.env`:
```env
DARWINBOX_DOMAIN=your-domain
DARWINBOX_CLIENT_ID=your-client-id
DARWINBOX_CLIENT_SECRET=your-client-secret
DARWINBOX_GRANT_TYPE=your-grant-type
DARWINBOX_CODE=your-code
DARWINBOX_DATASET_KEY=your-dataset-key
```

2. Add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "darwinbox": {
      "command": "npx darwinbox-mcp",
      "cwd": "/path/to/darwinbox-mcp"
    }
  }
}
```

## Usage

### Starting the Server

```bash
npx darwinbox-mcp
```

### Example Tool Usage

```typescript
// Example: Get Employee Details
const result = await callTool('get_employee_details', {
  employee_ids: ['EMP001', 'EMP002']
});

// Example: Record Attendance
const result = await callTool('record_attendance_punches', {
  attendance: {
    'EMP001': [{
      id: '1',
      timestamp: '2025-05-12 09:00:00',
      machineid: 'DEVICE001',
      status: 'IN'
    }]
  }
});

// Example: Apply Leave
const result = await callTool('apply_leave', {
  data: [{
    employee_no: 'EMP001',
    leave_name: 'Annual Leave',
    message: 'Vacation',
    from_date: '12-05-2025',
    to_date: '15-05-2025',
    is_half_day: 'No',
    is_paid_or_unpaid: 'paid',
    revoke_leave: 'No'
  }]
});
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode during development
npm run watch

# Run MCP Inspector for testing
npm run inspector
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

Copyright (c) 2025 Darwinbox Private Limited

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project uses the following open source packages:

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MIT License
- [axios](https://github.com/axios/axios) - MIT License
- [typescript](https://github.com/microsoft/TypeScript) - Apache-2.0 License
- [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) - MIT License

We are grateful to the authors and contributors of these packages.

## Security

- All sensitive information should be provided via environment variables
- Never commit .env files or any files containing credentials
- Follow security best practices when implementing new tools
- Use proper error handling and input validation

## Support

For support, please open an issue in the GitHub repository.
