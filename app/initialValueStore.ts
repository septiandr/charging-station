import { ChargingPoint } from './pointType';
import { Car } from './profile';

export interface InitialDataProps {
    isClickLocation: boolean
    isLogin: boolean
    selectedChargingPoint: ChargingPoint
    user: UserProps;
    selectedCar: Car
}

export interface UserProps {
    name: string,
    email: string,
    $id: string
}

export const initialData: InitialDataProps = {
    isClickLocation: false,
    isLogin: false,
    user: {
        name: '',
        email: '',
        $id: ''
    },
    selectedChargingPoint: {
        IsRecentlyVerified: false,
        DateLastVerified: '',
        ID: 0,
        UUID: '',
        DataProviderID: 0,
        OperatorID: 0,
        UsageTypeID: 0,
        UsageCost: '',
        AddressInfo: {
            ID: 0,
            Title: '',
            AddressLine1: '',
            Town: '',
            StateOrProvince: '',
            Postcode: '',
            CountryID: 0,
            Latitude: 0,
            Longitude: 0,
            DistanceUnit: 0
        },
        Connections: [],
        NumberOfPoints: 0,
        StatusTypeID: 0,
        DateLastStatusUpdate: '',
        DataQualityLevel: 0,
        DateCreated: '',
        SubmissionStatusTypeID: 0
    },
    selectedCar: {
        $id: '',
        connectionType: "",
        currentType: "",
        name: "",
        power: ""
    }
};
