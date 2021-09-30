import { Context } from '@nuxt/types'
import { registerStore } from './common/common.index'

// Store
import { ToothStore } from './modules/tooth/tooth.store'
import { BridgeStore } from './modules/bridge/bridge.store'
import { UserStore } from './modules/user/user.store'
import { CartItemStore } from './modules/cartItem/cartItem.store'
import { WorkingModelStore } from './modules/workingModel/workingModel.store'
import { CartTypeStore } from './modules/cartType/cartType.store'

// Module
import ToothModule from './modules/tooth/tooth.module';
import BridgeModule from './modules/bridge/bridge.module';
import UserModule from './modules/user/user.module';
import CartItemModule from './modules/cartItem/cartItem.module';
import WorkingModelModule from './modules/workingModel/workingModel.module';
import CartTypeModule from './modules/cartType/cartType.module';

export default class Fraestechnik {

    context:Context;
    tooth:ToothModule;
    bridge:BridgeModule;
    user:UserModule;
    cartItem:CartItemModule;
    workingModel:WorkingModelModule;
    cartType:CartTypeModule;

    constructor(context:Context){

        registerStore({
            modules:{
                tooth: ToothStore(context),
                bridge: BridgeStore(context),
                user: UserStore(context),
                cartItem: CartItemStore(context),
                workingModel: WorkingModelStore(context),
                cartType: CartTypeStore(context)
            },
            store:context.store,
            namespace:'fraestechnik'
        })

        this.tooth = new ToothModule(context)
        this.bridge = new BridgeModule(context)
        this.user = new UserModule(context)
        this.cartItem = new CartItemModule(context)
        this.workingModel = new WorkingModelModule(context)
        this.cartType = new CartTypeModule(context)
        this.context = context
    }
}
