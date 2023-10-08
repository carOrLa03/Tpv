# TPV Virtual de Redsys con Angular y Firebase
Implementación de un sistema de pago en línea usando el servicio de TPV Virtual de Redsys, usando [Angular](https://angular.io/) como framework.
Para poder integrar el TPV Virtual en nuestro proyecto debemos:

1. Tener configurada/contratada una cuenta de comercio en Redsys a través de nuestro banco.
2. Integrar las bibliotecas y herramientas proporcionadas por Redsys en la aplicación Angular.
3. Crear de una interfaz de usuario para que los clientes ingresen los detalles del pago.
4. Envío de los detalles del pago al servidor de Redsys para su procesamiento.
5. Gestión de las respuestas de Redsys, que indican si la transacción fue exitosa o no.
6. Actualizar la interfaz de usuario de la aplicación Angular para mostrar el resultado de la transacción al cliente.


A continuación, muestro las diferentes bibliotecas que utilice para crear mi aplicación, pero me quiero centrar en como implementar un componente de TPV externo en [Angular](https://angular.io/).


## Creación de un proyecto de [Angular](https://angular.io/)

1. Usar un editor de código, yo utilizo [VSC](https://code.visualstudio.com/)
2. Tener instalado [Node.js](https://nodejs.org/es/)
3. npm install -g @angular/cli
4. ng new nombre_del_proyecto
5. ng serve -o

Para este proyecto he utilizado por comodidad y rapidez [Angular Material](https://material.angular.io/guide/getting-started), [PrimeNg](https://primeng.org/) y
[HammerJs](https://www.npmjs.com/package/hammerjs).

- ng add @angular/material
- npm install primeng
- npm i hammerjs
- Importar:

En *src/main.ts*:
```JS
import 'hammerjs'
```

En el archivo angular.json:
```JS
"styles": [
    "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
    "node_modules/primeng/resources/primeng.min.css",
    ...
]
```

En el archivo styles.scss:
```JS
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
```


Tanto para utilizar componentes de Material como de PrimeNG, en el archivo *appmodule.ts* importaremos los modulos de los componetes, ejemplo:

```JS
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    AppRoutingModule,
    MenubarModule,
    ButtonModule,
    CardModule
  ],
```

## Instalación de [Firebase](https://firebase.google.com/?hl=es)

1. npm install -g firebase-tools
2. ng generate environments
3. ng add @angular/fire
4. firebase login
5. firebase init

Firebase es una plataforma de Google que nos permite subir nuestras aplicaciones web o movil, ofreciendo diferentes servicios: *Hosting*, *Storage*, *Firestore Database*, *Authentication* ...


En este proyecto no la tengo implementada. 

## Instalación de la librería crypto-js

Para encriptar los datos necesarios para realizar el pago, junto con otras dependencias. Cuando la requiramos la importaremos en el documento .ts donde queramos hacer uso de esta.

- npm i crypto-js
```JS
import * as CryptoJS from 'crypto-js';
```
- npm i --save-dev @types/crypto-js
-   En index.html:
```HTML
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script>
```

-  npm i crypto-browserify
En el documento "tsconfig.json",  en "angularCompileOptions" quede de la siguiente manera:
```js
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "allowSyntheticDefaultImports": true
  }
```



## Creación de un servicio TPV
1. ng g s services/tpvServicio

En el archivo appmodule.ts deberemos declarar el servicio creado, para poder acceder a el desde cualquier parte de nuestra aplicación:
```js
  providers: [
    TpvServicioService
  ],

```
Servicio desde el cual, mediante un único método, nos comunicaremos con el servicio de Redsys para que nos confirme que podemos realizar el pago si los datos enviados son correctos.

```js

  //PARAMETROS TPV
  merchantKey = 'Clave secreta'; //clave secreta 
  urlRedsys = 'https://sis-t.redsys.es:25443/sis/realizarPago';
  Ds_SignatureVersion: string = 'HMAC_SHA256_V1' //versión del algoritmo de firma
  DS_Signature: string = "Firma de los datos de la petición" //Firma de los datos de la petición de pago
    sendPaymentRequest(data: any){
    
    //Ds_MerchantParameters
    let params: any = { 
      'DS_MERCHANT_AMOUNT': data.amount,
      'DS_MERCHANT_CURRENCY': data.currency,
      'DS_MERCHANT_MERCHANTCODE': data.merchantCode,
      'DS_MERCHANT_ORDER': data.order,
      'DS_MERCHANT_TERMINAL': data.terminal,
      'DS_MERCHANT_TRANSACTIONTYPE': data.transactionType,
      'DS_MERCHANT_TITULAR': data.titular,
      'DS_MERCHANT_PRODUCTDESCRIPTION':data.description,
      'DS_MERCHANT_MERCHANTURL': data.url,
      'DS_MERCHANT_URLOK': data.url_Ok,
      'DS_MERCHANT_URLKO': data.url_Ko

    } 

    // Base64 encoding of parameters
    let merchantWordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(params));
    let merchantBase64 = merchantWordArray.toString(CryptoJS.enc.Base64);

    // Decode key
    let keyWordArray = CryptoJS.enc.Base64.parse(this.merchantKey);

    // Generate transaction key
    let iv = CryptoJS.enc.Hex.parse("0000000000000000");
    let cipher = CryptoJS.TripleDES.encrypt(params.DS_MERCHANT_ORDER, keyWordArray, {
      iv:iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    // Sign
      let signature = CryptoJS.HmacSHA256(merchantBase64, cipher.ciphertext);
      let signatureBase64 = signature.toString(CryptoJS.enc.Base64);
      
    
    // FORMULARIO TPV
    const form_tpv = document.createElement('form');
      form_tpv.setAttribute('method', 'post');
      form_tpv.setAttribute('target', 'paymentFrame');
      form_tpv.setAttribute('action', this.urlRedsys);


    const inputMerchantParameters = document.createElement('input');
    inputMerchantParameters.setAttribute('type', 'hidden');
    inputMerchantParameters.setAttribute('name', 'Ds_MerchantParameters');
    inputMerchantParameters.setAttribute('value', merchantBase64);
    form_tpv.appendChild(inputMerchantParameters);

    const inputSignature = document.createElement('input');
    inputSignature.setAttribute('type', 'hidden');
    inputSignature.setAttribute('name', 'Ds_Signature');
    inputSignature.setAttribute('value', signatureBase64);
    form_tpv.appendChild(inputSignature);

    const inputSignatureVersion = document.createElement('input');
    inputSignatureVersion.setAttribute('type', 'hidden');
    inputSignatureVersion.setAttribute('name', 'Ds_SignatureVersion');
    inputSignatureVersion.setAttribute('value', 'HMAC_SHA256_V1');
    form_tpv.appendChild(inputSignatureVersion );

    document.body.appendChild(form_tpv);
      form_tpv.submit();

  }
```

## Creación de un componente Iframe
1. ng g m components
2. ng g c components/iframeTpv


El archivo componentsmodule.ts quedará de la siguiente manera:
```js

@NgModule({
  declarations: [
    IframeTpvComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    RouterModule
  ],
  exports: [
    IframeTpvComponent
  ]
})
export class ComponentsModule { }
```

Primero creamos un modulo para crear todos los componentes de nuestra aplicación, y en el segundo comando creamos un componente iframe, que a su vez será un dialogo de Material, que se abrirá cuando hagamos la llamada al TPV Virtual, dentro de nuestra aplicación sin que se rompa la sesión del usuario.


Desde este llamaremos al método del servicio:
```js
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
```

## Creación de un componente TPV 

1. ng g c tpv

Componente desde el cual mandaremos los datos del usuario necesarios para realizar el pago. 

```HTML
        <div>
            <p-button label="Pagar" (click)="hacerPago()"></p-button>
            <p-button label="Cancelar" styleClass="p-button-secondary" [style]="{ 'margin-left': '.5em' }"></p-button>
        </div>
```

Integramos el componente iframe anterior, que abre el dialogo, y pasamos los PARÁMETROS necesarios para la transacción, han de ser todos ellos *string*. 

Si se tiene alguna duda, en la página de documentación que proporciona REDSYS para la implantación de su TPV nos explica cada uno de los PRÁMETROS necesarios y obligatorios.

```js
  hacerPago() {

    const dialogRef = this.dialogIframeTpv.open(IframeTpvComponent, {
      width: '100%',
      data: {
        src: 'https://sis-t.redsys.es:25443/sis/realizarPago',
        amount: 2000,// cantidad a Pagar son 20€
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
  }

```

## Acceder al componente TPV
Para acceder al componente lo declaramos en el archivo app-roputing.module.ts de nuestra aplicación, de ese modo accederemos a el mediante la navegación.


```js
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TpvComponent } from './tpv/tpv.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TpvComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```


