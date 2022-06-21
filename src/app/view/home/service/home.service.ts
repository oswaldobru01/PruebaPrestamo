import { Loan } from '../components/solicitud/class/loan';
import { Home } from './../class/home';
import { FormGroup } from '@angular/forms';
import { Usuario } from './../models/usuario';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public formularioPrincipal : FormGroup;
  public formularioSolicitud: FormGroup;
  basePath= environment.backendURL
  constructor(private httpClient:HttpClient) {
    this.formularioPrincipal = new Home().get();
    this.formularioSolicitud = new Loan().new();
   }

  listaSolicitados():Observable<Array<Usuario>> {
    const endpoint = `${this.basePath}/usuarios`;
    return this.httpClient.get<Array<Usuario>>(endpoint);
  }
  
  guardarUsuario(usuario: Usuario):Observable<Usuario> {
    const endpoint = `${this.basePath}/usuarios`
    return this.httpClient.post<Usuario>(endpoint, usuario);
  }
  

}
