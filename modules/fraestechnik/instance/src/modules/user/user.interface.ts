export interface UserType {
    _id:String;
    firstname:String;
    lastname:String;
    email:String;
    phone:String;
    ordination:String;
    address:String;
    postalcode:String;
    city:String;
}

export interface UserItemDto {
    firstname?:String;
    lastname?:String;
    email?:String;
    phone?:String;
    ordination?:String;
    address?:String;
    postalcode?:String;
    city?:String;
}

export interface ActionUpdateItemDto {
    _id:String,
    object:UserItemDto
  }