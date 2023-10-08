import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IframeTpvComponent } from '../components/iframe-tpv/iframe-tpv.component';

@Component({
  selector: 'app-tpv',
  templateUrl: './tpv.component.html',
  styleUrls: ['./tpv.component.scss']
})
export class TpvComponent {

  nombreDelUsuario: string = "" //Consulta a la bbdd propia de la app
  miCodigoFUC: string = "" //mi código de comercio FUC proporcionado por REDSYS

  constructor(private dialogIframeTpv: MatDialog) { }

  hacerPago(tipoCuota: any) {


    const dialogRef = this.dialogIframeTpv.open(IframeTpvComponent, {
      width: '100%',
      data: {
        src: 'https://sis-t.redsys.es:25443/sis/realizarPago',
        amount: 2000,// cantidadPagar,
        order: this.numerodeorden(),
        currency: '978',
        terminal: '1',
        transactionType: '0',
        merchantCode: `${this.miCodigoFUC}`, 
        titular: `${this.nombreDelUsuario}`,
        description: 'Cuota',
        url: 'http://localhost:4200/user/',
        url_Ok: 'http://localhost:4200/user/pagos-cuotas',
        url_Ko: 'http://localhost:4200/user/pagos-cuotas'
      }
    })

    dialogRef.afterClosed().subscribe(() => {
      // Realiza acciones después de cerrar el modal, si es necesario
      console.log('cerrado iframe')
    });
  }

  // método que crea la orden de pago necesaria para poder abrir el TPV Virtual
  numerodeorden() { 
    let order = ''
    for (let i = 0; i < 9; i++) {
      let random = Math.floor(Math.random() * (9-0+1))
      order += random
      
    }
    return order
  }

}
