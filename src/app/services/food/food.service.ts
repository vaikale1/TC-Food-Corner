import { Injectable } from '@angular/core';
import { Food } from '../../shared/modules/food';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  /*login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/login`, { username, password }, { observe: 'response', withCredentials: true });
  }*/
  public getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/admin/fooditem`);
  }
  public getFoodUser(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/user/showFoodItems`);
  }
  public getFoodUserByCategory(category: string): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/user/home?category=${category}`);
  }

  public addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(`${this.apiServerUrl}/admin/fooditem/addfooditem`, food);
  }

  public updateFood(food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiServerUrl}/admin/fooditem/updatefooditem/${food.itemId}`, food);
  }

  public deleteFood(foodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/admin/fooditem/deleteitem/${foodId}`);
  }
}
