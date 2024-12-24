function phoneControl(str) {
    return typeof str == 'string'  || 'number' ? /^[0-9]{2,4}\-?[0-9]{7}$/.test(str) ? true : false : false
}

function nameControl(str){
  return typeof str === 'string' ?  /^[\p{L} -']{1,40}$/iu.test(str) ? true : false : false
}

function dateControl(date) {
  return  isNaN(date.getTime()) || 
    date < Date.now() ||
    date.getMinutes() !=0 || 
    date.getSeconds() !=0 ||
    date.getMilliseconds() !=0 ||
    date.getHours() <8 || date.getHours() > 17 ? true : false

}

export {dateControl,nameControl,phoneControl}