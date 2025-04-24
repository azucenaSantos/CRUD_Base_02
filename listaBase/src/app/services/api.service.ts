import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Food } from '../_models/Food';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://localhost:6001/api/foods'; // API base URL

  private currentUserSource= new BehaviorSubject<Food | null>(null); //Creamos un observable que almacena el usuario actual 
  currentUser$= this.currentUserSource.asObservable()

  constructor(private http: HttpClient) {}


  add(food: any){
    console.log(food);
    return this.http.post<Food>(this.baseUrl+'/add', food);
  }

  remove(id: any){
    return this.http.delete<Food>(`${this.baseUrl}/${id}`);
  }

  get(){
    return this.http.get('https://localhost:6001/api/foods');
  }

  update(id: number, updatedFood: any) {
    return this.http.put(`${this.baseUrl}/${id}`, updatedFood);
  }

  //Necesitamos un get de los tipos de comida -> todos los tipos de comida
  getTypes(){
    return this.http.get('https://localhost:6001/api/types');
  }
}
