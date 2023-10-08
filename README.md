# TPV Virtual de Redsys con Angular y Firebase
Implementación de un sistema de pago en línea usando el servicio de TPV Virtual de Redsys, usando Angular como framework.
Para poder integrar el TPV Virtual en nuestro proyecto debemos:

1. Tener configurada/contratada una cuenta de comercio en Redsys a través de nuestro banco.
2. Integrar las bibliotecas y herramientas proporcionadas por Redsys en la aplicación Angular.
3. Crear de una interfaz de usuario para que los clientes ingresen los detalles del pago.
4. Envío de los detalles del pago al servidor de Redsys para su procesamiento.
5. Gestión de las respuestas de Redsys, que indican si la transacción fue exitosa o no.
6. Actualizar la interfaz de usuario de la aplicación Angular para mostrar el resultado de la transacción al cliente.

## Creación de un proyecto de [Angular](https://angular.io/)

1. Usar un editor de código, yo utilizo [VSC](https://code.visualstudio.com/)
2. Tener instalado [Node.js](https://nodejs.org/es/)
3. npm install -g @angular/cli
4. ng new nombre_del_proyecto
5. ng serve -o

Para este proyecto he utilizado [Angular Material](https://material.angular.io/guide/getting-started) y
[HammerJs](https://www.npmjs.com/package/hammerjs)

- ng add @angular/material
- npm i hammerjs
- Importar en "src/main.ts": import 'hammerjs';

## Instalación de [Firebase](https://firebase.google.com/?hl=es)

1. npm install -g firebase-tools
2. ng generate environments
3. ng add @angular/fire
4. firebase login
5. firebase init

## Instalación de la librería crypto-js

Para encriptar los datos necesarios para realizar el pago, junto con otras dependencias. Cuando la requiramos la importaremos en el documento .ts donde queramos hacer uso de esta.

- npm i crypto-js
~~~
import * as CryptoJS from 'crypto-js';
~~~
- npm i --save-dev @types/crypto-js
-   En index.html:
~~~
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script>
~~~
-  npm i crypto-browserify
En el documento "tsconfig.json",  en "angularCompileOptions" quede de la siguiente manera:
~~~
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "allowSyntheticDefaultImports": true
  }
~~~

## Creación de un servicio TPV
1. ng g s services/tpvServicio

Servicio desde el cual, mediante un único método, nos comunicaremos con el servicio de Redsys para que nos confirme que podemos realizar el pago si los datos enviados son correctos.

En el archivo appmodule.ts deberemos declarar el servicio creado, para poder acceder a el desde cualquier parte de nuestra aplicación:
~~~
  providers: [
    TpvServicioService
  ],
~~~

## Creación de un componente Iframe
1. ng g m components
2. ng g c components/iframeTpv
El archivo componentsmodule.ts quedará de la siguiente manera:
~~~
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IframeTpvComponent } from './iframe-tpv/iframe-tpv.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



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
~~~

Primero creamos un modulo para crear todos los componentes de nuestra aplicación, y en el segundo comando creamos un componente iframe, que a su vez será un dialogo de Material, que se abrirá cuando hagamos la llamada al TPV Virtual, dentro de nuestra aplicación sin que se rompa la sesión del usuaio.

## Creación de un componente TPV 

1. ng g c tpv

Comopnente desde el cual mandatemos los datos del usuario necesarios para realizar el pago. En este caso, y debido a las bbdd muestro el componente pero no los datos enviados. pero los PARÁMETROS que se pasan al dialogo, han de ser todos ellos string. Si se tiene alguna duda, en la página de documentación que proporciona REDSYS para la implantación de su TPV nos explica cada uno de los PRÁMETROS necesarios y obligatorios.

