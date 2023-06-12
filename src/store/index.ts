import { defineStore } from 'pinia'
import { Names } from './store-name'
import { UserType,AgentType } from '../class/types'




export const useGlobalStore = defineStore(Names.GLOBAL, {
  state: () => {
    return {
      user: <UserType>{},
      agent: <AgentType>{},
      curAgent: <AgentType>{},  //当前代理数据
      token: <string>"",
    }
  },
  // 类似computed 取值
  getters: {
      getUser():UserType {
        return this.getUser
      },
      getNickname(): string {
        if(this.user.nickname){
          return this.user.nickname
        }else if(this.user.phone){
          return this.user.phone
        }else if(this.user.email){
          return this.user.email
        }
        return ""
      },
      getToken():string {
        return this.token
      }
  },
  // methods 同步 异步 提交 state
  actions: {
    setUser(user: UserType) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
    }
  }
})

