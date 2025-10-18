export type Scope = 'global' | 'branch'

export type RulesetStatus = 'draft' | 'published' | 'archived'

export type Expression = {
  id: string
  engine: 'jsonlogic'
  body: any
}

export type DataSourceStatic = {
  id: string
  type: 'static'
  config: { items: { id: string; name: string }[] }
}

export type Widget = {
  type: 'builtIn' | 'custom'
  key: 'text' | 'number' | 'email' | 'phone' | 'select' | 'textarea' | 'date'
  props?: Record<string, any>
}

export type FieldDef = {
  id: string
  label: string
  type: 'string' | 'number'
  required?: boolean
  validators?: { kind: 'regex' | 'email' | 'phone'; pattern?: string; message?: string }[]
  widget: Widget
  options?: { dataSourceId?: string; valueKey?: string; labelKey?: string } | null
  showWhen?: { ref?: string } | null
}

export type Layout = {
  sections: { id: string; title?: string; rows: { cols: { fieldId: string; span?: number }[] }[] }[]
}

export type Definitions = {
  fields: FieldDef[]
  layout: Layout
  expressions?: Expression[]
  dataSources?: DataSourceStatic[]
  widgets?: any[]
}

export type Ruleset = {
  _id: string
  tenantId: string
  scope: Scope
  branchId?: string
  status: RulesetStatus
  name: string
  notes?: string
  definitions: Definitions
  apiVersion: string
  modelVersion: number
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  data: T[]
  page: number
  limit: number
  total: number
}


