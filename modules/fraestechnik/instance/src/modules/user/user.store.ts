import { Context} from '@nuxt/types'
import { UserType, UserItemDto, ActionUpdateItemDto } from './user.interface'
import { UserService } from './user.service'

interface State {
  data:UserType[];
}

export const UserStore = (context:Context) => {

  const userService = new UserService(context)

  return {
    namespaced: true,
    state: ():State => ({
      data:[]
    }),
    mutations: {
      // selectItem(state:State, objectId:String) {
      //   state.selected = objectId
      // },
      loadItem(state:State, user:UserType) {
        if (state.data.find(x => x._id === user._id)) {
          state.data = state.data.map(x => { return x._id === user._id ? Object.assign({}, x, user) : x })
        } else {
          state.data = [...state.data, user];
        }
      },
      loadItems(state:State, users:UserType[]) {
        state.data = users
      },
      createItem(state:State, user:UserType) {
        state.data = [...state.data, user]
      },
      createItems(state:State, users:UserType[]) {
        state.data = [...state.data, ...users]
      },
      updateItem(state:State, payload:ActionUpdateItemDto) {
        state.data = state.data.map(x => { return x._id === payload._id ? Object.assign({}, x, payload.object) : x })
      },
      removeItem(state:State, _id:String) {
        state.data = state.data.filter(x => x._id !== _id)
      }
    },
    actions: {
      // selectItem({ commit }:any, objectId:String) {
      //   commit('selectItem', objectId)
      // },
      loadItem({commit}:any, user:UserType) {
        commit('loadItem', user)
        return user
      },
      loadItems({commit}:any, users:UserType[]) {
        commit('loadItems', users)
        return users
      },
      async fetchItem({commit}:any) {
        let item:UserType = await userService.fetchItem()
        commit('loadItem', item)
        return item
      },
      async fetchItems({commit}:any) {
        let items:UserType[] = await userService.fetchItems()
        commit('createItems', items)
        return items
      },
      async createItem({commit}:any, object:UserItemDto) {
        let newUser:UserType = await userService.createItem(object)
        commit('createItem', newUser)
        return newUser
      },
      async updateItem({commit}:any, payload:ActionUpdateItemDto) {
        let user:UserItemDto = await userService.updateItem(payload._id, payload.object)
        let payloadUpdate:ActionUpdateItemDto = {
          _id: payload._id,
          object: user
        }
        commit('updateItem', payloadUpdate)
        return user
      },
      async removeItem({commit}:any, _id:String) {
        await userService.removeItem(_id)
      }
    },
    getters:{
      findItem: (state:State) => (_id:String|null = null) => {
        return state.data[0];
      },
      findItems: (state:State) => () => {
        return state.data;
      }
    }
  }
}
