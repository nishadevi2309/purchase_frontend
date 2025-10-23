import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface purchaserequests {
   prid?: number;
   eventid: number;
   vendorid: number;
   allocatedamount: number;
   prstatus: string;
   requestLocalDate?: string;
}
@Injectable({
  providedIn: 'root'
})
export class Request {
  baseurl="http://localhost:8080/purchaserequests";
  constructor(private http: HttpClient) { 

  }

  createdata(purchaserequest: purchaserequests):Observable<purchaserequests[]>{
    return this.http.post<purchaserequests[]>(`${this.baseurl}/createpurchasingrequest`, purchaserequest);
  }
  getallPurchaseRequests(): Observable<purchaserequests[]> {
    return this.http.get<purchaserequests[]>(`${this.baseurl}/getall`);
  }

  updatePurchaseStatus(id: number, status: string): Observable<purchaserequests> {
    // Try sending status in request body instead of path parameter
    return this.http.put<purchaserequests>(`${this.baseurl}/updatepurchasestatus/${id}/${status}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
