export type Ward = {
  wardId: string;
  wardName: string;
  supervisorId: string | null;
  createdAt: string;
};

export type Household = {
  nfcId: string;
  ownerNumber: string;
  address: string;
  dateCreated: string;
  dateUpdated: string;
  status: string;
  wardId: string;
};

export type Worker = {
  workerId: string;
  workerName: string;
  contactNumber: string;
  dateCreated: string;
  wardId: string | null;
};

export type ScanLog = {
  scanId: string;
  nfcId: string;
  workerId: string;
  timestamp: string;
  gpsLatitude: number | null;
  gpsLongitude: number | null;
};

export type CitizenReport = {
  reportId: string;
  nfcId: string;
  citizenContact: string;
  timestamp: string;
  status: string;
  additionalNotes: string | null;
};

export type WardTableData = Ward & {
  supervisorName: string | null;
  workerCount: number;
  householdCount: number;
};
