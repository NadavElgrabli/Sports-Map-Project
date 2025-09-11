import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const USER_DATA_KEY = 'userData'; // single source of truth for the key

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  setUser(user: User) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    // Convert back to User instance
    return new User(
      parsed.id,
      parsed.username,
      parsed.password,
      parsed.dateOfBirth,
      parsed.weight,
      parsed.address,
      parsed.expiresIn,
      new Date(parsed.expirationDate),
      parsed.currentLocation,
      parsed.friends
    );
  }

  removeUser() {
    localStorage.removeItem(USER_DATA_KEY);
  }
}
