import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
    }

    public uploadFile(file: FormData): Observable<any>{
        const url = `${this.apiUrl}/upload/upload`;
        return this.http.post(url, file);
    }

}
