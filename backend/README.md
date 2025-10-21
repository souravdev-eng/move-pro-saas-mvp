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

#### Rulesets

- POST `/api/rulesets` – create a ruleset (draft)
- GET `/api/rulesets` – list rulesets (filterable, paginated)
- GET `/api/rulesets/:id` – fetch by id
- DELETE `/api/rulesets/:id` – delete ruleset

#### Jobs (Rules-Driven)

- GET `/api/form/:branchId/:serviceType` – get compiled form schema for branch/serviceType
- POST `/api/jobs` – create a job (validates against rules, applies defaults & compute)
- GET `/api/jobs` – list jobs (filterable, paginated)
- GET `/api/jobs/:id` – get job by id
- POST `/api/jobs/validate` – validate job payload without creating

#### Responses

- POST `/api/responses` – create a response
- GET `/api/responses` – list responses
- GET `/api/responses/:id` – get response by id

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

---

## Job Creation API

### Get Form Schema

Returns compiled form schema with validation rules and defaults:

```bash
curl 'http://localhost:4000/api/form/branch_001/residential-move'
```

Response:

```json
{
  "fields": [...],
  "layout": {...},
  "validationSchemaVersion": "v1:ruleset_id",
  "defaults": {
    "move.type": "Residential",
    "pricing.currency": "USD"
  }
}
```

### Create Job

Creates a job after validating against rules:

```bash
curl -X POST http://localhost:4000/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{
    "branchId": "branch_001",
    "serviceType": "residential-move",
    "payload": {
      "customer.name": "John Doe",
      "customer.email": "john@example.com",
      "move.origin": "New York",
      "move.destination": "Boston",
      "move.moveDate": "2025-11-15"
    },
    "createdBy": "user_123"
  }'
```

Response:

```json
{
  "job": {
    "_id": "...",
    "branchId": "branch_001",
    "serviceType": "residential-move",
    "status": "created",
    "payload": {...},
    "customer": {...},
    "move": {...},
    "pricing": {...},
    "meta": {
      "validationSchemaVersion": "v1:ruleset_id",
      "computedFields": ["pricing.estimatedCost"]
    }
  },
  "validationSchemaVersion": "v1:ruleset_id",
  "warnings": ["Applied default values for: pricing.currency"]
}
```

### Validate Job (Dry-Run)

Validates payload without creating:

```bash
curl -X POST http://localhost:4000/api/jobs/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "branchId": "branch_001",
    "serviceType": "residential-move",
    "payload": {...}
  }'
```

Response:

```json
{
  "valid": true,
  "errors": [],
  "computed": {
    // Payload with computed fields applied
  }
}
```

### List Jobs

```bash
curl 'http://localhost:4000/api/jobs?branchId=branch_001&status=created&page=1&limit=20'
```

### Get Job by ID

```bash
curl 'http://localhost:4000/api/jobs/<JOB_ID>'
```
