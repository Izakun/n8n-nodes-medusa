# n8n-nodes-medusa

[![npm version](https://img.shields.io/npm/v/n8n-nodes-medusa.svg)](https://www.npmjs.com/package/n8n-nodes-medusa)

n8n community node for [Medusa](https://pymedusa.com/) — the TV show automation tool — via its v2 API.

Install via **Settings -> Community Nodes -> Install** -> `n8n-nodes-medusa`.

## Operations
- Get Series, Get Config, Get Stats

## Credentials
Configure the base URL and authentication in the **Medusa API** credential.

## Usage example

List your TV shows:

1. Add the node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your credential.
3. Resource **Series** → **Get Many**.
4. Execute the node — example output:

```json
{ "id": 12, "title": "Severance", "network": "Apple TV+", "status": "Continuing" }
```

## Disclaimer
Not affiliated with or endorsed by the respective project.
