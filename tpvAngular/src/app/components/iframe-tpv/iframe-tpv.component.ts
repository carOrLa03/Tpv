import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TpvServicioService } from 'src/app/services/tpv-servicio.service';

@Component({
  selector: 'app-iframe-tpv',
  templateUrl: './iframe-tpv.component.html',
  styleUrls: ['./iframe-tpv.component.scss']
})
export class IframeTpvComponent {

  iframeUrl: string = "";

  constructor(
    public tpv: TpvServicioService,
    public dialogRef: MatDialogRef<IframeTpvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // Obtén la URL del iframe de los datos proporcionados
    this.iframeUrl = this.data.src;

    // Escuchar mensajes del iframe
    window.addEventListener('message', (event) => {
    // Verificar el origen del mensaje si es necesario
    // Procesar el mensaje
    const messageData = event.data; // Aquí asumimos que el mensaje contiene datos relevantes

    // Verificar si la transacción fue exitosa o cancelada
    if (messageData.transactionStatus === 'success') {
      // La transacción fue exitosa, realiza las acciones necesarias
      console.log('Transacción exitosa', messageData);
    } else if (messageData.transactionStatus === 'cancel') {
      // La transacción fue cancelada, realiza las acciones necesarias
      console.log('Transacción cancelada', messageData);
      this.closeDialog()
    }
  })

    // Llama a sendPaymentRequest del servicio aquí pasando los datos necesarios
    this.tpv.sendPaymentRequest(this.data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
