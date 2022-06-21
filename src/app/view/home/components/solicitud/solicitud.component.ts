import { FormGroup } from '@angular/forms';
import { HomeService } from './../../service/home.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
  get formularioSolicitud(): FormGroup {
   return this.serviceHome$.formularioSolicitud;
 }
  constructor(private serviceHome$: HomeService) { 
  }

  ngOnInit(): void {
  }

}
