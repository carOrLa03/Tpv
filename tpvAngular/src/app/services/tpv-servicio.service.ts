import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class TpvServicioService {


  //PARAMETROS TPV
  private merchantKey = 'Clave secreta'; //clave secreta 
  private urlRedsys = 'https://sis-t.redsys.es:25443/sis/realizarPago';
  Ds_SignatureVersion: string = 'HMAC_SHA256_V1' //versión del algoritmo de firma
  DS_Signature: string = "Firma de los datos de la petición" //Firma de los datos de la petición de pago



  constructor() { }


    sendPaymentRequest(data: any){

    let params: any = { //Ds_MerchantParameters
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
}
