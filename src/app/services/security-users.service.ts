import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Security_UsersModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})

export class SecurityUsersService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Security_UsersModel[]>(`${environment.apiUrl}/users`);
    }
}
