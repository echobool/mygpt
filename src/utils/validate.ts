import { checkSubDomain } from '../http/api'

export const ValidatePhone = (_rule:any, value:any, callback:any) => {
  const regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|16[12567]|17[123678]|18[0-9]|19[89]|14[567])[0-9]{8}$/
  if (!regExp.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export const ValidateDomain = (_rule:any, value:any, callback:any) => {
  if (value == "") {
    callback()
  }
  const regExp = /^(?=^.{2,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
  if (!regExp.test(value)) {
    callback(new Error('请输入正确的域名'))
  } else {
    callback()
  }
}


export const ValidateSubDomain = (_rule:any, value:any, callback:any) => {
  checkSubDomain({
    subdomain: value
  }).then((_data) => {
    callback()
  }, (error) => {
    callback(new Error(error))
  })
}
