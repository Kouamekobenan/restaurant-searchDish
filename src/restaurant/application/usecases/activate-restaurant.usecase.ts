import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { IRestaurantRepository, RestaurantRepositoryName } from "src/restaurant/domain/interfaces/restaurant.interface";

@Injectable()
export class ActivateRestaurantUseCase{
    private readonly logger =new Logger(ActivateRestaurantUseCase.name)
    constructor(@Inject(RestaurantRepositoryName)
    private readonly restaurRepo:IRestaurantRepository
){}
async execute(id:string):Promise<{message:string}>{
    try {
        const restau =await this.restaurRepo.findById(id)
        if (!restau) {
            throw new NotFoundException('Restaurant not found')
        }
        await this.restaurRepo.active(id)
        return {message:"Restaurant is activate successfuly ❌🔑🔑"}
    } catch (error) {
        this.logger.error(`Failled to activate restaurant ${error.message}`)
        throw new BadRequestException(`Failled to deactivate successfully ${error.message}`)
    }
}
}
