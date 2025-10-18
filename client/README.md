# MovePro Rules Engine – Client

**Production-ready React + Vite + TypeScript app** for authoring and testing dynamic rules-based forms in the moving industry, powered by **MUI v6**.

## Features

- ✅ **Business-aligned presets**: Moving domain fields (contact, locations, schedule, property, extras)
- ✅ **Dynamic form rendering**: Sections, rows, cols with 12-column grid layout
- ✅ **Conditional visibility**: JSONLogic expressions (e.g., show stairs only for residential moves)
- ✅ **Validation**: Required, regex, email, phone with inline errors
- ✅ **Testability**: Vitest + RTL unit tests, Cypress E2E happy path
- ✅ **MUI v6**: Consistent spacing, typography, icons, and pixel-perfect alignment

## Setup

1. **Create `.env.local`** in `client/`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

2. **Install dependencies**:

```bash
npm install
# or: yarn / pnpm install
```

3. **Run dev server**:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Tests

**Unit/Integration (Vitest + RTL)**:

```bash
npm run test
```

**Cypress E2E**:

```bash
npm run cypress:open
```

## Workflow (Simplified for Any User!)

### 1️⃣ Create Your Form (`/rulesets/new`)

**3-Step Wizard** - No technical knowledge needed!

**Step 1: Form Details**

- Give your form a name (e.g., "Customer Registration")
- Add a description (optional)
- **Or** click "Use Template" for a pre-built moving form

**Step 2: Add Questions**

- Click "Add Question" button
- Type your question in plain English (e.g., "What is your full name?")
- Choose answer type:
  - **Short Text** - one line
  - **Long Text** - paragraph
  - **Number** - numeric only
  - **Email** - validates email automatically
  - **Phone** - validates phone automatically
  - **Date** - date picker
  - **Dropdown** - list of options (just type them separated by commas!)
- Check "Required" if user must answer
- **Drag to reorder** questions with up/down arrows
- **Edit or Delete** anytime

**Step 3: Preview & Save**

- See your form exactly as users will
- Test it yourself
- Click "Save Form" when ready

**No regex, no JSON, no technical terms!** 🎉

### 2️⃣ List & View (`/rulesets`)

Browse all rulesets with filters, view details with split JSON viewer and form tester.

### 3️⃣ Test Your Form (`/rulesets/:id`)

- Fill out your custom form
- Test conditional visibility (e.g., stairs field only shows for residential moves)
- Validate required/email/phone/regex fields
- Submit to see values JSON in a dialog

## Routes

- **`/rulesets/new`** – Visual form builder with tabs (fields → layout → rules → preview)
- **`/rulesets`** – List rulesets with filters, MUI Table
- **`/rulesets/:id`** – Detail view with split JSON viewer and live form preview

## Project Structure

```
src/
  app/                   # Theme, Router, App shell
  api/                   # Axios client & ruleset API
  pages/                 # RulesetList, RulesetCreate, RulesetDetail
  components/            # FormRenderer, FieldInput, SectionCard, JsonViewer, Toolbar
  hooks/                 # useQuery, useMutation
  types/                 # TypeScript interfaces
  utils/                 # jsonLogic, validators, formLayout, presets
  fixtures/              # sampleRuleset.global.json, .branch.json
  tests/                 # unit/ and e2e/ tests
```

## Business Presets

Click **"Load Moving Preset"** in RulesetCreate to auto-populate:

- **Fields**: contact, move type, schedule, locations (origin/destination), property (stairs, elevator), inventory
- **Layout**: Sections with 2-column and 3-column rows (12-column grid)
- **Expressions**: `expr:isResidential` shows stairs only when move.type = Residential
- **Data Sources**: Static move types (Residential, Commercial) and elevator types

## Acceptance Criteria ✓

1. ✅ Author a ruleset with move-industry presets; validate schema
2. ✅ List rulesets with filters and view detail
3. ✅ Preview form with clean alignment, consistent spacing, and 12-column grid
4. ✅ Conditional visibility: selecting "Residential" reveals stairs field
5. ✅ Validations: required/email/phone/regex show inline errors
6. ✅ On valid submit, values appear in a dialog (copyable JSON)
7. ✅ Unit tests pass; Cypress E2E happy path passes

## Tech Stack

- **React 19** + **Vite 7** + **TypeScript 5**
- **MUI v6** (components + icons)
- **axios** for API
- **react-router-dom** for routing
- **json-logic-js** for conditional visibility
- **Vitest** + **React Testing Library** for unit tests
- **Cypress** for E2E tests
