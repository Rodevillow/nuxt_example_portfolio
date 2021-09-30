import { Context } from '@nuxt/types'
import { UserType, UserItemDto, ActionUpdateItemDto } from './user.interface';

export default class UserModule {
    context:Context;

    constructor(context:Context) {
        this.context = context
    }

    loadItem(user:UserType):Promise<UserType> {
        return this.context.store.dispatch('fraestechnik/user/loadItem', user);
    }

    loadItems(users:UserType[]):Promise<UserType[]> {
        return this.context.store.dispatch('fraestechnik/user/loadItems', users);
    }

    async fetchItem():Promise<UserType|null> {
        return await this.context.store.dispatch('fraestechnik/user/fetchItem')
    }

    async fetchItems():Promise<UserType[]> {
        return await this.context.store.dispatch('fraestechnik/user/fetchItems')
    }

    async createItem(object:UserItemDto):Promise<UserType|null> {
        return await this.context.store.dispatch('fraestechnik/user/createItem', object)
    }

    async updateItem(_id:String, object:UserItemDto):Promise<UserType|null> {
        let payload:ActionUpdateItemDto = {
            _id: _id,
            object: object
        }
        return await this.context.store.dispatch('fraestechnik/user/updateItem', payload)
    }

    async removeItem(_id:String):Promise<void> {
        await this.context.store.dispatch('fraestechnik/user/removeItem', _id)
    }

    findItem():UserType {
        return this.context.store.getters['fraestechnik/user/findItem']()
    }

    findItems():UserType[] {
        return this.context.store.getters['fraestechnik/user/findItems']()
    }
}
