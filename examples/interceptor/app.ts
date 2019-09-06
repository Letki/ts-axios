import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'
import { transformRequest, transformResponse } from '../../src/helpers/data';
// axios.intercetor.request.use(config =>{
//   config.headers.test+='1'
//   return config
// })
// let inter = axios.intercetor.request.use(config =>{
//   config.headers.test+='2'
//   return config
// })
// axios.intercetor.request.use(config =>{
//   config.headers.test+='3'
//   return config
// })


// axios.intercetor.response.use(res =>{
//   res.data+='1'
//   return res
// })

// console.log(inter)
// axios.intercetor.request.eject(inter)
// axios({
//   method: 'get',
//   url: '/base/get',
//   headers:{
//     test: ''
//   }
// })

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/base/post',
  method: 'post',
  data: {
    a:1
  },
  headers: {
    test:'321'
  },
  transformRequest:[function(data){return qs.stringify(data)}, ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse:[...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if(typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
}).then((res)=>{
  console.log(res.data)
})