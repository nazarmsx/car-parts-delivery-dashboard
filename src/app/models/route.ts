export class Route {
  _id: string;
  id: string;
  city:string;
  custName:string;
  description:string;
  address:string;
  contactName:string;
  phone:string;
  docNo:string;
  status:string;
  createdAt:Date;
  updatedAt:Date;
  vehicleCode:string;
  driverCode:string;
  driverName:string;
  driverSurname:string;
  carLicensePlate:string;
  driverShiftId:string;
  recipientSignature:string;
  completeNote:string;
  completeDate:Date;
  rejectReason:string;
  rejectNote:string;
  lat:number;
  lon:number;
  images:string[];
  items:{code:string,name:string,quantity:string,unitOfMeasure:string}[];
}

export enum RouteStatus {
  Ready = 'ready',
  Started = 'started',
  Arrived = 'arrived',
  Delayed = 'delayed',
  Completed = 'completed',
  Rejected = 'rejected',
  New = 'new'
}