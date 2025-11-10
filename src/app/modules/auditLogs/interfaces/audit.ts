export interface AdditionalData {
  UserAgent: string;
  IpAddress: string;
  Referer: string;
  EntityChanges: EntityChange[];
}

export interface EntityChange {
  entityType: string;
  entityId: string;
  operation: string;
  timestamp: string; // ISO date string
  changedProperties: ChangedProperty[];
}

export interface ChangedProperty {
  property: string;
  oldValue: string | null;
  newValue: string | null;
}
