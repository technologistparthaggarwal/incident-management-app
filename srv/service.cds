using { sap.capire.incidents as db } from '../db/schema.cds';

/**
 * Main FE service (List Report / Object Page)
 */


service ProcessorService {
  @odata.draft.enabled
  entity Incidents as projection on db.Incidents;

  @readonly entity Customers as projection on db.Customers;
  @readonly entity Status    as projection on db.Status;
  @readonly entity Urgency   as projection on db.Urgency;
}

service ImportService @(path: 'import') {
  action importCSV(csv : LargeString) returns String;
}


/**
 * Admin service (optional)
 */
service AdminService {
  entity Customers as projection on db.Customers;
  entity Incidents as projection on db.Incidents;
  entity Addresses as projection on db.Addresses;

  @readonly entity Status  as projection on db.Status;
  @readonly entity Urgency as projection on db.Urgency;
}

