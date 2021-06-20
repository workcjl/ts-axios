const toString = Object.prototype.toString

/** 是否为空 */
export const isEmpty = (val:any) :boolean => val === null || typeof val === undefined

/** 是否是数组类型 */
export const isArray = (val:any) :val is Array<any>  => Array.isArray(val)

/** 是否是时间类型 */
export const isDate = (val:any) :val is Date => toString.call(val) === '[object Date]'

/** 是否是引用类型 */
export const isObject = (val:any) :val is Object => val!==null && typeof val === 'object'

/** 是否是一个普通对象 */
export const isPlainObject = (val:any) :val is Object => toString.call(val) === '[object Object]'

/** 转义字符串 */
export const encode = (val:string) :string => {
  val = encodeURIComponent(val) /** 先将val直接转义 */
  val = val.replace(/%40/g, '@') /** 从转义的val中将特殊字符‘@’还原 */
  val = val.replace(/%3A/ig, ':') /** 从转义的val中将特殊字符‘:’还原 */ /**所有带字母的匹配都需要i忽略大小写 */
  val = val.replace(/%24/g, '$') /** 从转义的val中将特殊字符‘$’还原 */
  val = val.replace(/%2C/ig, ',') /** 从转义的val中将特殊字符‘,’还原 */
  val = val.replace(/%20/g, '+') /** 从转义的val中将特殊字符‘空格’转换成+号 */
  val = val.replace(/%5B/ig, '[') /** 从转义的val中将特殊字符‘[’还原 */
  val = val.replace(/%5D/g, ']') /** 从转义的val中将特殊字符‘]’还原 */
  return val
}

/** 规范化headers头部的书写 - headers就是config中设置的headers */
export const normalizedHeaderName = (headers:any, normalizedName: string): any => {
  Object.keys(headers).forEach((headerName) => {
    if(headerName !== normalizedName && headerName.toUpperCase() === normalizedName.toUpperCase()){
      headers[normalizedName] = headers[headerName] /** 如果用户在config中设置headers的时候对于大小写写错，在这里处理成规范化的名字 */
      Reflect.deleteProperty(headers, headerName) /** 有了规范化的键后就可以删除headers中不规范的键了 */
    }
  })
  return headers
}

/**
 * 设置xhr请求header
 * @param request 
 * @param headers 
 * @param data 
 */
 export const setRequestHeader = (request: XMLHttpRequest, headers: Object, data: any) => {
  Object.entries(headers).forEach(([header, value])=> {
    /** 处理意外情况：如果data都没有，同时又在配置headers中设置了content-type,那么直接删除掉这个头部 */
    if(!data && header.toLocaleLowerCase() === 'content-type') return Reflect.deleteProperty(headers, header)
    request.setRequestHeader(header, value)
  })
}