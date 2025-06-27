import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Dish } from "src/dish/domain/entities/dish.entity";
import { DishRepositoryName, IDishRepository } from "src/dish/domain/interfaces/dish-repository.interface";

@Injectable()
export class FindallDishUseCase{
    private readonly logger= new Logger(FindallDishUseCase.name)
    constructor(
        @Inject(DishRepositoryName)
        private readonly dishRepository: IDishRepository
    ){}
    async execute():Promise<Dish[]>{
        try {
            return await this.dishRepository.findAll()
        } catch (error) {
            this.logger.error("Failled to retrieve dishs", error.stack)
            throw new BadRequestException('Failled to retrieve dishs',{
                cause:error,
                description:error.message
            })
        }
    }
}
