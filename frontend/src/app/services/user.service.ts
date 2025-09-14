import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserService{

    constructor(private http: HttpClient){}

    getUserById(userId: number) : Observable<User>{
        return this.http.get<User>(`${environment.apiUrl}/users/${userId}`)
    }
}