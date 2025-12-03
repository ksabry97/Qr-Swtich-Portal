# Dynamic Filter Component - Quick Start Guide

## 📦 Installation

The component is already created in `src/app/shared/components/dynamic-filter/`. Just import it:

```typescript
import { DynamicFilter, FilterConfig } from '@shared/components/dynamic-filter/dynamic-filter';
```

## 🚀 Basic Usage

### 1. Import Component

```typescript
@Component({
  imports: [DynamicFilter],  // Add to imports array
  // ... rest of config
})
export class YourComponent { }
```

### 2. Define Filters

```typescript
filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'common.status',
    type: 'select',
    options: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' }
    ]
  },
  {
    key: 'isActive',
    label: 'common.is_active',
    type: 'switch'
  },
  {
    key: 'date',
    label: 'common.date',
    type: 'date'
  }
];
```

### 3. Add to Template

```html
<app-dynamic-filter
  [filterConfigs]="filterConfigs"
  (filterChange)="onFilterChange($event)"
  (clearFilters)="onClearFilters()"
></app-dynamic-filter>
```

### 4. Handle Events

```typescript
onFilterChange(filters: Record<string, any>) {
  // filters = { status: 'active', isActive: true, date: Date }
  this.loadDataWithFilters(filters);
}

onClearFilters() {
  this.loadDataWithFilters({});
}
```

## 📋 Filter Types

| Type | Description | Value Returned |
|------|-------------|----------------|
| `select` | Dropdown selection | `any` |
| `switch` | Boolean toggle | `boolean` |
| `date` | Single date picker | `Date` |
| `date-range` | Date range picker | `[Date, Date]` |

## 🎯 Common Patterns

### Dynamic Options from API

```typescript
ngOnInit() {
  this.service.getOptions().subscribe(options => {
    this.filterConfigs = [
      {
        key: 'option',
        type: 'select',
        options: options.map(o => ({ text: o.name, value: o.id }))
      }
    ];
  });
}
```

### Multiple Filter Types

```typescript
filterConfigs: FilterConfig[] = [
  { key: 'tenant', type: 'select', /* ... */ },
  { key: 'active', type: 'switch', /* ... */ },
  { key: 'date', type: 'date', /* ... */ }
];
```

### Default Values

```typescript
{
  key: 'isActive',
  type: 'switch',
  defaultValue: false  // Pre-set the filter
}
```

## 🎨 Styling

Component uses CSS variables. Customize in your styles:

```scss
.dynamic-filter-container {
  --bg-primary: #fff;
  --border-primary: #cbd5e1;
  --primary: #3b82f6;
}
```

## ✅ Benefits

- ✨ **Flexible**: Configure any combination of filters
- 🎯 **Type-Safe**: Full TypeScript support
- 🔄 **Event-Driven**: Automatic updates on change
- 🌍 **i18n Ready**: Built-in translation support
- 📱 **Responsive**: Works on all screen sizes
- 🧹 **Clean**: Clear all filters with one button

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation and advanced examples.

