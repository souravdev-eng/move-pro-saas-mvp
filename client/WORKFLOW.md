# MovePro Rules Engine – User Workflow

## 🎯 Goal: Create → Test → Deploy Rules

---

## Step 1: Create Your Custom Form

Navigate to **`/rulesets/new`**

### Tab 1: Fields Builder

- Click **"Add Field"** to open dialog
- Fill in:
  - **Field ID**: `contact.firstName`
  - **Label**: `First Name`
  - **Type**: String / Number
  - **Widget**: Text / Number / Email / Phone / Date / Textarea / Select
  - **Required**: ✓
  - **Validator**: Email / Phone / Regex (optional)
  - **Show When**: Expression ref (e.g., `expr:isResidential`)
  - **Data Source**: For select widgets (e.g., `ds:moveTypes`)
- **Edit/Delete** fields from table view

### Tab 2: Layout Builder

- **Add Section** with title (e.g., "Contact Information")
- **Add Row** inside each section
- **Add Column** to each row:
  - Select field from dropdown
  - Set span (1-12) for responsive grid
- **Delete** sections/rows/cols with trash icons

### Tab 3: Data Sources & Expressions

**Data Sources (JSON)**:

```json
[
  {
    "id": "ds:moveTypes",
    "type": "static",
    "config": {
      "items": [
        { "id": "Residential", "name": "Residential" },
        { "id": "Commercial", "name": "Commercial" }
      ]
    }
  }
]
```

**Expressions (JSON)**:

```json
[
  {
    "id": "expr:isResidential",
    "engine": "jsonlogic",
    "body": { "==": [{ "var": "move.type" }, "Residential"] }
  }
]
```

### Tab 4: Preview

- See your form **live** with:
  - ✅ All fields rendered
  - ✅ Sections and layout
  - ✅ Conditional visibility working
  - ✅ Validation rules active
- Test submit to see values JSON

### Quick Start

Click **"Load Moving Preset"** to instantly populate:

- 18 fields (contact, move details, locations, property, extras)
- 4 sections with responsive layout
- Residential conditional expression
- Move type & elevator data sources

---

## Step 2: Save & Deploy

1. Click **"Validate Schema"** to check for errors
2. Click **"Create Ruleset"**
3. Redirects to detail page at `/rulesets/:id`

---

## Step 3: Test Your Form

On **`/rulesets/:id`** detail page:

### Left Panel (Optional)

- Click **"Show JSON"** to see full ruleset definition

### Right Panel: Live Form

- Fill out your custom form
- **Test conditional visibility**:
  - Example: Select "Residential" → stairs field appears
- **Test validation**:
  - Required fields show errors if empty
  - Email/phone/regex validators run on submit
- Click **"Validate & Submit"**
- If valid → **Dialog shows JSON** with all values

### Actions

- **Floating Reset Button** (bottom-right) to clear form
- **"Use Sample" toggle** to test with fixture data offline

---

## Step 4: Iterate

- Go back to `/rulesets` list
- View all rulesets
- Create new variants (branch overrides, different presets)
- Test each one independently

---

## 🚀 Developer Flow

```bash
# 1. Start backend (port 4000)
cd backend && npm run dev

# 2. Start frontend (port 5173)
cd client && npm run dev

# 3. Open browser
http://localhost:5173/rulesets/new

# 4. Build form → Preview → Save → Test
```

---

## 📝 Example: Moving Industry Form

1. **Fields**: contact (name, phone, email), move type, date, crew size, addresses, stairs, elevator, notes
2. **Layout**: 4 sections with 2-column and 3-column rows
3. **Rules**: Show stairs field only when move.type = "Residential"
4. **Test**: Select Residential → stairs appears, fill form, validate, submit → see JSON

✅ **Result**: Production-ready dynamic form that captures all moving details with business logic!

---

## 💡 Tips

- Use **preset** for quick start, then customize
- Preview tab shows **real-time** changes
- Field IDs use dot notation (e.g., `contact.firstName`) for nested data
- Span totals can exceed 12 per row (responsive wrapping)
- Expressions reference form state with `{"var": "fieldId"}`
- Validators run only on submit (not on blur)
