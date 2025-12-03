// /**
//  * EXAMPLE IMPLEMENTATION OF DYNAMIC FILTER COMPONENT
//  *
//  * This file demonstrates how to integrate the DynamicFilter component
//  * into your existing list component TypeScript file.
//  */

// import { Component, effect, inject, OnInit } from '@angular/core';
// import {
//   TableColumn,
//   TableAction,
//   QrTable,
// } from '../../../../shared/components/qr-table/qr-table';
// import { GlobalService } from '../../../../shared/services/global.service';
// import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
// import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
// import { CreateUser } from '../../modules/users/components/create-user/create-user';
// import { TranslateModule } from '@ngx-translate/core';
// import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { UserService } from '../../modules/users/services/users.service';
// import { DeleteConfirm } from '../../../../shared/components/delete-confirm/delete-confirm';
// import { AuthService } from '../../../../shared/services/auth.service';

// // Import the DynamicFilter component and its interfaces
// import {
//   DynamicFilter,
//   FilterConfig,
//   FilterOption
// } from './dynamic-filter';

// @Component({
//   selector: 'app-example-user-list',
//   imports: [
//     EntityHeader,
//     QrTable,
//     QrModal,
//     TranslateModule,
//     TableFilter,
//     DynamicFilter  // Add DynamicFilter to imports
//   ],
//   templateUrl: './example-usage.html',
//   styleUrl: './example-usage.scss',
// })
// export class ExampleUserList implements OnInit {
//   globalServ = inject(GlobalService);
//   userServ = inject(UserService);
//   authServ = inject(AuthService);
//   createUser = CreateUser;
//   deleteConfirm = DeleteConfirm;

//   // Table configuration
//   columns: TableColumn[] = [
//     {
//       field: 'createdAt',
//       header: 'common.date_time',
//       sortable: false,
//       template: 'date',
//     },
//     { field: 'username', header: 'users.list.user_name', sortable: false },
//     {
//       field: 'roles',
//       header: 'users.select_role',
//       sortable: false,
//     },
//     { field: 'tenantName', header: 'users.tenant', sortable: false },
//     {
//       field: 'id',
//       header: 'users.list.user_id',
//       sortable: false,
//     },
//     {
//       field: 'isActive',
//       header: 'common.status',
//       sortable: false,
//       template: 'boolean',
//     },
//   ];

//   actions: TableAction[] = [];
//   users = [];
//   Users: any;
//   pageIndex = 1;
//   pageSize = 10;
//   total = 0;
//   viewMode = false;
//   editMode = false;
//   userId = '';
//   slectedRows: string[] = [];
//   isDeleteBulk = false;

//   // NEW: Add filter configuration
//   filterConfigs: FilterConfig[] = [];
//   activeFilters: Record<string, any> = {};

//   constructor(private message: NzMessageService) {
//     effect(() => {
//       this.globalServ.isSubmitted()
//         ? this.getAllUsers(this.pageIndex, this.pageSize)
//         : '';
//     });
//     effect(() => {
//       this.globalServ.isDeleteConfirmed()
//         ? this.isDeleteBulk
//           ? this.deleteBulkUsers()
//           : this.deleteUser()
//         : '';
//       this.globalServ.isDeleteConfirmed.set(false);
//     });
//   }

//   ngOnInit(): void {
//     this.getAllUsers(this.pageIndex, this.pageSize);
//     this.loadFilterConfigs(); // Initialize filter configs
//     this.globalServ.PermissionsPerModule.subscribe((value) => {
//       this.Users = value.Users?.permissions;
//       this.actions = [
//         {
//           label: 'common.view_details',
//           icon: 'eye',
//           severity: 'info',
//           disabled: !this.isAllowed(this.Users?.ViewUsers),
//         },
//         {
//           label: 'users.actions.edit',
//           icon: 'edit',
//           severity: 'warn',
//           disabled: !this.isAllowed(this.Users?.UpdateUsers),
//         },
//         {
//           label: 'users.actions.delete',
//           icon: 'delete',
//           severity: 'danger',
//           disabled: !this.isAllowed(this.Users?.DeleteUsers),
//         },
//       ];
//     });
//   }

//   // NEW: Initialize filter configurations
//   loadFilterConfigs(): void {
//     // Example 1: Load filter options from API
//     this.globalServ.getTenantsLookups().subscribe((tenants: any) => {
//       this.globalServ.getRolesLookups().subscribe((roles: any) => {
//         this.filterConfigs = [
//           {
//             key: 'tenantId',
//             label: 'users.tenant',
//             type: 'select',
//             placeholder: 'users.select_tenant',
//             options: tenants.map((t: any) => ({
//               text: t.name || t.text,
//               value: t.id || t.value
//             }))
//           },
//           {
//             key: 'roleId',
//             label: 'users.select_role',
//             type: 'select',
//             placeholder: 'users.select_role_placeholder',
//             options: roles.map((r: any) => ({
//               text: r.name || r.text,
//               value: r.id || r.value
//             }))
//           },
//           {
//             key: 'isActive',
//             label: 'common.status',
//             type: 'switch',
//             defaultValue: false
//           },
//           {
//             key: 'createdDate',
//             label: 'common.created_date',
//             type: 'date',
//             placeholder: 'common.select_date'
//           }
//         ];
//       });
//     });

//     // Example 2: Static configuration
//     // this.filterConfigs = [
//     //   {
//     //     key: 'status',
//     //     label: 'common.status',
//     //     type: 'select',
//     //     placeholder: 'common.select_status',
//     //     options: [
//     //       { text: 'common.active', value: 'active' },
//     //       { text: 'common.inactive', value: 'inactive' }
//     //     ]
//     //   },
//     //   {
//     //     key: 'isActive',
//     //     label: 'common.is_active',
//     //     type: 'switch',
//     //     defaultValue: false
//     //   },
//     //   {
//     //     key: 'dateRange',
//     //     label: 'common.date_range',
//     //     type: 'date-range',
//     //     placeholder: ['common.start_date', 'common.end_date']
//     //   }
//     // ];
//   }

//   // NEW: Handle filter changes
//   onFilterChange(filters: Record<string, any>): void {
//     this.activeFilters = filters;
//     console.log('Active filters:', filters);

//     // Reload data with new filters
//     this.getAllUsers(this.pageIndex, this.pageSize, undefined, filters);
//   }

//   // NEW: Handle clear filters
//   onClearFilters(): void {
//     this.activeFilters = {};
//     this.getAllUsers(this.pageIndex, this.pageSize);
//   }

//   // MODIFIED: Update getAllUsers to accept filters
//   getAllUsers(
//     pageIndex: number,
//     pageSize: number,
//     search?: string,
//     filters?: Record<string, any>
//   ) {
//     this.globalServ.setLoading(true);
//     this.pageIndex = pageIndex;
//     this.pageSize = pageSize;

//     // Option 1: Send filters as query parameters
//     // Convert filters object to the format your API expects
//     const params: any = {
//       page: pageIndex,
//       pageSize: pageSize
//     };

//     if (search) {
//       params.search = search;
//     }

//     // Add filter parameters
//     if (filters) {
//       Object.keys(filters).forEach(key => {
//         const value = filters[key];

//         // Handle date values
//         if (value instanceof Date) {
//           params[key] = value.toISOString();
//         }
//         // Handle date range
//         else if (Array.isArray(value) && value[0] instanceof Date) {
//           params[`${key}From`] = value[0].toISOString();
//           params[`${key}To`] = value[1].toISOString();
//         }
//         // Handle other values
//         else {
//           params[key] = value;
//         }
//       });
//     }

//     this.userServ.getAllUsersWithFilters(params).subscribe({
//       next: (data: any) => {
//         this.users = data?.data;
//         this.total = data?.totalRecords;
//       },
//       error: () => {
//         this.globalServ.setLoading(false);
//       },
//       complete: () => {
//         this.globalServ.setLoading(false);
//       },
//     });
//   }

//   openModel() {
//     this.viewMode = false;
//     this.editMode = false;
//     this.globalServ.setModal(true);
//   }

//   callAction(action: any) {
//     this.viewMode = false;
//     this.editMode = false;
//     switch (action.action.severity) {
//       case 'info':
//         this.globalServ.setModal(true);
//         this.viewMode = true;
//         this.userId = action.rowData.id;
//         return;
//       case 'warn':
//         this.globalServ.setModal(true);
//         this.editMode = true;
//         this.userId = action.rowData.id;
//         return;
//       case 'danger':
//         this.deleteUser();
//         break;
//     }
//   }

//   getSelected(selectedIds: number[]) {
//     this.slectedRows = selectedIds.map((id) => id.toString());
//   }

//   deleteBulk() {
//     if (this.slectedRows.length > 0) {
//       this.isDeleteBulk = true;
//       this.globalServ.setDeleteConfirmation(true);
//     }
//   }

//   deleteUser() {
//     if (this.userId) {
//       this.userServ.deleteUser(this.userId).subscribe({
//         next: () => {
//           this.message.success('User deleted successfully');
//           this.getAllUsers(this.pageIndex, this.pageSize);
//         },
//       });
//     }
//   }

//   deleteBulkUsers() {
//     if (this.slectedRows.length > 0) {
//       this.userServ.deleteBulkUsers(this.slectedRows).subscribe({
//         next: () => {
//           this.message.success('Users deleted successfully');
//           this.getAllUsers(this.pageIndex, this.pageSize);
//         },
//       });
//     }
//     this.isDeleteBulk = false;
//   }

//   export() {
//     // Implement export logic
//   }

//   isAllowed(permission: boolean): boolean {
//     return this.authServ.isAllowed(permission);
//   }
// }
