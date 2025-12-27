using { sap.capire.incidents as my } from '../db/schema.cds';
/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService { 
    entity Incidents as projection on my.Incidents;

    @readonly
    entity Customers as projection on my.Customers;
}

annotate ProcessorService.Incidents with @odata.draft.enabled;  

service ImportService @(path: 'import') {
  entity Incidents as projection on my.Incidents;

  /** Import plain-text CSV content and return a status message */
  action importCSV(csv : String) returns String;
}


/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService {
    entity Customers as projection on my.Customers;
    entity Incidents as projection on my.Incidents;
    }