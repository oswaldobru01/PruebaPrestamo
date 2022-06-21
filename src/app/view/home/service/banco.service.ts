import { Prestamo } from './../components/solicitud/models/prestamo';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BancoService {
  public basePath = environment.backendURL;

  constructor(private httpClient: HttpClient) {}

  aprobacion(): boolean {
    return Math.random() < 0.5;
  }

  listarPrestamos(): Observable<Array<Prestamo>> {
    const endpoint = `${this.basePath}/prestamos`;
    return this.httpClient.get<Array<Prestamo>>(endpoint);
  }

  guardarPrestamo(prestamos: Prestamo): Observable<Prestamo> {
    const endpoint = `${this.basePath}/prestamos`;
    return this.httpClient.post<Prestamo>(endpoint, prestamos);
  }
  saldoBancoGlobal():number{
    return environment.montoBase;
  }
  pagarPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    const endpoint = `${this.basePath}/prestamos/${prestamo.id}`;
    return this.httpClient.put<Prestamo>(endpoint, prestamo);
  }
}
