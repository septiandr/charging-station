export type Connection = {
    ID: number;
    ConnectionTypeID: number;
    StatusTypeID: number;
    LevelID: number;
    PowerKW: number;
    CurrentTypeID: number;
    Quantity: number;
    Comments?: string;
};

export type AddressInfo = {
    ID: number;
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Postcode: string;
    CountryID: number;
    Latitude: number;
    Longitude: number;
    DistanceUnit: number;
};

export type ChargingPoint = {
    IsRecentlyVerified: boolean;
    DateLastVerified: string;
    ID: number;
    UUID: string;
    DataProviderID: number;
    OperatorID: number;
    UsageTypeID: number;
    UsageCost: string;
    AddressInfo: AddressInfo;
    Connections: Connection[];
    NumberOfPoints: number;
    StatusTypeID: number;
    DateLastStatusUpdate: string;
    DataQualityLevel: number;
    DateCreated: string;
    SubmissionStatusTypeID: number;
};
