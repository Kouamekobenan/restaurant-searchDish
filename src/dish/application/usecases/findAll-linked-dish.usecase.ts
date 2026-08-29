import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Dish } from "src/dish/domain/entities/dish.entity";
import { DishRepositoryName, IDishRepository } from "src/dish/domain/interfaces/dish-repository.interface";

@Injectable()
export class FindAllLinkedDishUseCase{
    private readonly logger= new Logger(FindAllLinkedDishUseCase.name)
    constructor(
        @Inject(DishRepositoryName)
        private readonly dishRepository: IDishRepository
    ){}
    async execute():Promise<Dish[]>{
        try {
            return await this.dishRepository.findAllLinkedToRestaurant()
        } catch (error) {
            this.logger.error("Failled to retrieve linked dishs", error.stack)
            throw new BadRequestException('Failled to retrieve linked dishs',{
                cause:error,
                description:error.message
            })
        }
    }
}
