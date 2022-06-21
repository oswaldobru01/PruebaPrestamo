import { Usuario } from './models/usuario';
import { BancoService } from './service/banco.service';
import { HomeService } from './service/home.service';
import { Home } from './class/home';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Prestamo } from './components/solicitud/models/prestamo';
import { forkJoin } from 'rxjs';
import { ViewUsuario } from './models/viewusuario';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<ViewUsuario>;
  get formularioPrincipal(): FormGroup {
    return this.serviceHome$.formularioPrincipal;
  }
  get formularioSolicitud(): FormGroup {
    return this.serviceHome$.formularioSolicitud;
  }
  get SaldoBanco(): number {
    let saldoBancoTotal = this.serviceBanco$.saldoBancoGlobal();
    let totalPrestamos = this.prestamosActual.reduce(function (prev, cur) {
      return prev + cur.valorSolicitado;
    }, 0);

    return saldoBancoTotal - totalPrestamos;
  }

  displayedColumns: string[] = ['nombre', 'valorSolicitado', 'acciones'];
  viewUsuarios: ViewUsuario[] = [];
  dataSource = new MatTableDataSource<ViewUsuario>();
  public saldoActualBanco: number = 0;
  public prestamosActual: Array<Prestamo> = [];
  public selectedIndex = 0;
  constructor(
    private serviceHome$: HomeService,
    private serviceBanco$: BancoService
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

  listarPersonas(): void {
    forkJoin([
      this.serviceHome$.listaSolicitados(),
      this.serviceBanco$.listarPrestamos(),
    ]).subscribe((res) => {
      this.dataSource = new MatTableDataSource<ViewUsuario>();
      let [usuarios, prestamos] = res;
      this.prestamosActual = prestamos;
      this.saldoActualBanco = this.SaldoBanco;
      usuarios.forEach((usuario) => {
        let prestamo = prestamos.find((p) => (p.cedula == usuario.cedula));
        let usuarioView: ViewUsuario = {
          id: usuario.id,
          cedula: usuario.cedula,
          email: usuario.email,
          fechaPagar: prestamo?.fechaPagar,
          nombre: usuario.nombre,
          valorSolicitado: prestamo?.valorSolicitado,
          idPrestamo: prestamo?.id,
          pago: prestamo?.pago,
        };
        this.dataSource.data.push(usuarioView);
        this.table.renderRows();
      });
    });
  }

  validarSaldo(valorSolicitado: number): boolean {
    let saldoBancoTotal = this.serviceBanco$.saldoBancoGlobal();
    let totalPrestamos = this.prestamosActual.reduce(function (prev, cur) {
      return prev + cur.valorSolicitado;
    }, 0);

    if (saldoBancoTotal - totalPrestamos - valorSolicitado < 0) {
      return false;
    }
    return true;
  }

  pagar(datosPrestamo: ViewUsuario): void {
    let prestamo: Prestamo = {
      cedula: datosPrestamo.cedula,
      fechaPagar: datosPrestamo.fechaPagar,
      id: Number(datosPrestamo.idPrestamo),
      pago: true,
      valorSolicitado: Number(datosPrestamo.valorSolicitado),
    };
    this.serviceBanco$.pagarPrestamo(prestamo).subscribe(() => {
      Swal.fire({
        title: 'Solicitud del crédito',
        text: 'Su crédito ha sido pagado.',
        icon: 'success',
        confirmButtonText: 'Salir',
      });
      this.viewUsuarios = [];
      this.listarPersonas();
    });
  }
  guardarPersonas(): void {
    let jsonUsuario = this.formularioPrincipal.value as Usuario;
    let jsonPrestamo = this.formularioSolicitud.value as Prestamo;
    this.serviceHome$
      .listaSolicitados()
      .subscribe((solicitudes: Array<Usuario>) => {
        let solicitud = solicitudes.find((u) => u.cedula == jsonUsuario.cedula);

        if (solicitud) {
          Swal.fire({
            title: 'Usuario',
            text: 'Usuario ya existe verifiqué la identificación.',
            icon: 'error',
            confirmButtonText: 'Salir',
          });
        } else {
          const validationRamdon = this.serviceBanco$.aprobacion();
          if (validationRamdon) {
            let resultado = this.validarSaldo(jsonPrestamo.valorSolicitado);

            if (!resultado) {
              Swal.fire({
                title: 'Solicitud del crédito',
                text: 'Lo sentimos el banco no cuenta con suficiente monto para hacer un préstamo.',
                icon: 'error',
                confirmButtonText: 'Salir',
              });
            } else {
              this.serviceHome$
                .guardarUsuario(jsonUsuario)
                .subscribe((resUsuario: Usuario) => {
                  jsonPrestamo.cedula = resUsuario.cedula;
                  jsonPrestamo.pago = false;
                  this.serviceBanco$
                    .guardarPrestamo(jsonPrestamo)
                    .subscribe((resPrestamo: Prestamo) => {
                    });

                  location.reload();
                });
            }
          } else {
            Swal.fire({
              title: 'Solicitud del crédito',
              text: 'Su crédito ha sido rechazado.',
              icon: 'error',
              confirmButtonText: 'Salir',
            });
          }
        }
      });
  }

  validacionFormulario(): boolean {
    return !this.formularioPrincipal.valid || !this.formularioSolicitud.valid;
  }

  desabilitarPago(userPago: ViewUsuario): boolean {
    return userPago?.pago ?? false;
  }

 
}
