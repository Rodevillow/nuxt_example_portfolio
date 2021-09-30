import { Context} from '@nuxt/types'
import { UserType, UserItemDto, ActionUpdateItemDto } from './user.interface';

export class UserService {

    context:Context;

    constructor(context:Context) {
        this.context = context
    }

    async fetchItem():Promise<UserType> {
        const res = await this.context.app.$axios.get("/users/me");
        return res.data.user
    }

    async fetchItems():Promise<UserType[]> {
        return [];
    }

    async createItem(object:UserItemDto):Promise<UserType> {
        const response = await this.context.$axios.post('auth/signup', object);
        await this.context.$auth.setUserToken(response.data.token, response.data.refresh_token);
        return response.data.user
    }

    async updateItem(_id:String, object:UserItemDto):Promise<UserItemDto> {
        let formData = new FormData()

        Object.entries(object).forEach(([key, value]) => {
          formData.append(key, value)
        })
        
        const response = await this.context.$axios.patch('/users', formData);
        return response.data;
    }

    async removeItem(_id:String):Promise<Boolean> {
        const res = await this.context.$axios.delete('/users');
        await this.context.$auth.logout()
        return res.status === 200;
    }
}

