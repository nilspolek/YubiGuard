import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, CreateUserDto } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "/api"; // Backend API URL

  constructor(private http: HttpClient) {}

  // GET /users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // POST /users
  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  // POST /users/{userId}/add/{keyId}
  addKeyToUser(userId: string, keyId: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/users/${userId}/add/${keyId}`,
      {},
    );
  }

  // GET /{keyId}
  getUserByKeyId(keyId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${keyId}`);
  }
}
