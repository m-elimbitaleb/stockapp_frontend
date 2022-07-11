import {TranslateService} from '@ngx-translate/core';


export const convertEnumToArray = (o: any, translationService: TranslateService, key: string) => {
  const resultArray = [];
  for (const [propertyKey, propertyValue] of Object.entries(o)) {
    if (!Number.isNaN(Number(propertyKey))) {
      continue;
    }
    resultArray.push({
      key: propertyValue,
      translation: translationService.instant(key + propertyKey),
      value: propertyKey
    });
  }
  return resultArray;
};

export const base64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
  b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
  let byteCharacters = atob(b64Data);
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);
    let byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {type: contentType});
};


export const generateOrderId = (id) => {
  return `ELV-${id}`;
}
