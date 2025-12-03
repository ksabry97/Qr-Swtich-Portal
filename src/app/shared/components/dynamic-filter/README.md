# Dynamic Filter Component

A flexible, reusable Angular component for creating dynamic filters with multiple input types (select, switch, date, and date range) that can be configured for any list or table.

## Features

- **Multiple Filter Types**: Supports select, switch, date, and date-range inputs
- **Dynamic Configuration**: Configure filters via a simple config array
- **Event-Driven**: Emits filter changes as a key-value object for backend consumption
- **Responsive Design**: Adapts to different screen sizes with CSS Grid
- **Internationalization**: Full i18n support with Angular Translate
- **Clear Filters**: Built-in clear all filters functionality
- **Default Values**: Support for default filter values

## Usage

### Import the Component

```typescript
import { DynamicFilter, FilterConfig, FilterOption } from '@path/to/shared/components/dynamic-filter/dynamic-filter';

@Component({
  selector: 'app-your-list',
  imports: [DynamicFilter, /* other imports */],
  templateUrl: './your-list.html',
  styleUrl: './your-list.scss',
})
export class YourListComponent {
  // Your component code
}
```

### Define Filter Configuration

```typescript
filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'common.status',
    type: 'select',
    placeholder: 'common.select_status',
    options: [
      { text: 'common.active', value: 'active' },
      { text: 'common.inactive', value: 'inactive' }
    ]
  },
  {
    key: 'isActive',
    label: 'common.is_active',
    type: 'switch',
    defaultValue: false
  },
  {
    key: 'createdDate',
    label: 'common.created_date',
    type: 'date',
    placeholder: 'common.select_date'
  },
  {
    key: 'dateRange',
    label: 'common.date_range',
    type: 'date-range',
    placeholder: ['common.start_date', 'common.end_date']
  }
];
```

### Use in Template

```html
<app-dynamic-filter
  [filterConfigs]="filterConfigs"
  (filterChange)="onFilterChange($event)"
  (clearFilters)="onClearFilters()"
></app-dynamic-filter>
```

### Handle Filter Changes

```typescript
onFilterChange(filters: Record<string, any>) {
  console.log('Active filters:', filters);
  // Example output: { status: 'active', isActive: true, createdDate: '2024-01-01' }
  
  // Send to backend
  this.loadData(filters);
}

onClearFilters() {
  console.log('Filters cleared');
  this.loadData({});
}

loadData(filters: Record<string, any>) {
  // Your API call with filters
  this.service.getList(filters).subscribe(data => {
    // Handle response
  });
}
```

## FilterConfig Interface

```typescript
interface FilterConfig {
  key: string;                    // Unique identifier for the filter
  label: string;                  // Display label (translatable)
  type: 'select' | 'switch' | 'date' | 'date-range';  // Filter type
  options?: FilterOption[];       // Options for select type
  placeholder?: string | string[]; // Placeholder text (translatable)
  defaultValue?: any;             // Default value for the filter
}
```

## FilterOption Interface

```typescript
interface FilterOption {
  text: string;    // Display text (translatable)
  value: any;      // Option value
}
```

## Filter Types

### Select Filter

Dropdown selection with multiple options.

```typescript
{
  key: 'tenantId',
  label: 'users.tenant',
  type: 'select',
  placeholder: 'users.select_tenant',
  options: [
    { text: 'Tenant A', value: '1' },
    { text: 'Tenant B', value: '2' }
  ]
}
```

### Switch Filter

Boolean toggle switch.

```typescript
{
  key: 'isActive',
  label: 'common.is_active',
  type: 'switch',
  defaultValue: false
}
```

### Date Filter

Single date picker with time.

```typescript
{
  key: 'createdDate',
  label: 'common.created_date',
  type: 'date',
  placeholder: 'common.select_date'
}
```

### Date Range Filter

Date range picker with start and end dates.

```typescript
{
  key: 'dateRange',
  label: 'common.date_range',
  type: 'date-range',
  placeholder: ['common.start_date', 'common.end_date']
}
```

## Events

### filterChange

Emitted when any filter value changes. Returns an object with active filters.

```typescript
{
  key1: value1,
  key2: value2,
  // Only filters with values are included
}
```

### clearFilters

Emitted when the clear all filters button is clicked.

## Example: Complete Integration

```typescript
import { Component, OnInit } from '@angular/core';
import { DynamicFilter, FilterConfig, FilterOption } from '@shared/components/dynamic-filter/dynamic-filter';
import { YourService } from './your.service';

@Component({
  selector: 'app-example-list',
  imports: [DynamicFilter],
  templateUrl: './example-list.html',
})
export class ExampleListComponent implements OnInit {
  filterConfigs: FilterConfig[] = [];
  data: any[] = [];

  constructor(private yourService: YourService) {}

  ngOnInit() {
    this.loadFilterOptions();
  }

  loadFilterOptions() {
    this.yourService.getFilterOptions().subscribe(options => {
      this.filterConfigs = [
        {
          key: 'status',
          label: 'common.status',
          type: 'select',
          options: options.statuses
        },
        {
          key: 'isActive',
          label: 'common.is_active',
          type: 'switch'
        },
        {
          key: 'createdAfter',
          label: 'common.created_after',
          type: 'date'
        }
      ];
    });
  }

  onFilterChange(filters: Record<string, any>) {
    this.yourService.getFilteredData(filters).subscribe(data => {
      this.data = data;
    });
  }

  onClearFilters() {
    this.yourService.getFilteredData({}).subscribe(data => {
      this.data = data;
    });
  }
}
```

## Styling

The component uses CSS custom properties and is fully responsive. You can customize colors using CSS variables:

```scss
// In your global styles or component styles
.dynamic-filter-container {
  --bg-primary: #fff;
  --border-primary: #cbd5e1;
  --primary: #3b82f6;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

## Benefits

1. **Reusable**: Configure once, use anywhere
2. **Type-Safe**: Full TypeScript support with interfaces
3. **Flexible**: Mix and match different filter types
4. **Clean API**: Simple configuration and event handling
5. **Maintainable**: Centralized filter logic
6. **Accessible**: Built with ng-zorro-antd components

## Notes

- Only non-empty filter values are emitted in `filterChange` events
- Switch filters return boolean values
- Date filters return Date objects
- Date range filters return `[Date, Date]` arrays
- The clear button only appears when there are active filters

