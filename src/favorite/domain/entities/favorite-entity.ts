export class Favorite{
    constructor(
        private readonly id:string,
        private userId:string,
        private restaurantId:string,
        private createdAt:Date,
    ){}

    // SETTERS
    getId():string{
        return this.id
    }
    getUserId():string{
        return this.userId
    }
    getRestaurant():string{
        return this.restaurantId
    }
    
}