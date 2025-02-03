import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class KnightService {
    constructor(
        private http: HttpClient
    ) {}

    async getHeroesByStatus(status: string) {        
      const knights: any = await this.http.get(`${environment.apiUrl}/knights`, {
        params: {
          typeFilter: status
        }
      })
      .toPromise();
      
      return knights;
    }

    async createKnight(knight: any) {
      const knights: any = await this.http.post(`${environment.apiUrl}/knights`, knight).toPromise();
      
      return knights;
    }

    async deleteKnight(knightId: string) {
      await this.http.delete(`${environment.apiUrl}/knights/${knightId}`).toPromise();
    }

    async updateKnight(knight: any) {        
      const knights: any = await this.http.put(`${environment.apiUrl}/knights/${knight.id}`,
        {
          nickname: knight.nickname
        })
      .toPromise();
      
      return knights;
    }
}

