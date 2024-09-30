export class RouteUpdateLog {
    _id: string;
    routeId: string;
    lat:number;
    lon:number;
    updateFields:any;
    createdAt:Date;
    newStatus:string;
    oldStatus:string
}