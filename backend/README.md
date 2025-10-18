## Rules Engine API (Node.js/Express/Mongoose)

### Setup

1. Copy `.env.example` to `.env` and set values
2. Install deps

```bash
pnpm i # or npm i / yarn
```

3. Run dev server

```bash
pnpm dev # or npm run dev
```

4. Seed sample data (1 global + 1 branch ruleset)

```bash
pnpm seed # or npm run seed
```

### Scripts

- dev: Start dev server with ts-node + nodemon
- build: Compile TypeScript to `dist/`
- start: Run compiled server
- seed: Run seed script

### Environment

- `MONGODB_URI` (required)
- `PORT` (default: 4000)

### Routes

- POST `/api/rulesets` – create a ruleset (draft)
- GET `/api/rulesets` – list rulesets (filterable, paginated)
- GET `/api/rulesets/:id` – fetch by id

### DTO Validation

- `tenantId` (string), `scope` (`global`|`branch`), `name` (string), `definitions` (object)
- If `scope=branch`, `branchId` is required
- `definitions` must include `fields[]` and `layout{}`

### Sample curl

Create ruleset:

```bash
curl -X POST http://localhost:4000/api/rulesets \
  -H 'Content-Type: application/json' \
  -d '{
    "tenantId": "t_123",
    "scope": "global",
    "name": "Global Base v1",
    "notes": "First draft",
    "definitions": {
      "fields": [
        {
          "id": "move.type",
          "label": "Move Type",
          "type": "string",
          "widget": { "type": "builtIn", "key": "select" },
          "options": { "dataSourceId": "ds:moveTypes", "valueKey": "id", "labelKey": "name" }
        }
      ],
      "layout": { "sections": [ { "id": "base", "rows": [ { "cols": [ { "fieldId": "move.type", "span": 12 } ] } ] } ] },
      "expressions": [ { "id": "expr:isResidential", "engine": "jsonlogic", "body": { "==": [ { "var": "move.type" }, "Residential" ] } } ],
      "dataSources": [ { "id": "ds:moveTypes", "type": "static", "config": { "items": [ { "id":"Residential", "name":"Residential" }, { "id":"Commercial", "name":"Commercial" } ] } } ],
      "widgets": []
    },
    "createdBy": "u_789"
  }'
```

List rulesets (filters/pagination optional):

```bash
curl 'http://localhost:4000/api/rulesets?tenantId=t_123&status=draft&page=1&limit=20&search=base'
```

Get by id:

```bash
curl 'http://localhost:4000/api/rulesets/<RULESET_ID>'
```
