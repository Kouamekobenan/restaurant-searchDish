import { UserDto } from "../../application/dtos/user.dto";
import { User } from "../entities/user.entity";
import {User as UserPrisma} from '@prisma/client';
import { UserRole as Role } from "../enums/role.enum";

export class UserMapper{
    toPersitence(data: UserDto): any{
        return ({
            email:data.email,
            password:data.password,
            name: data.name,
            role:data.role
           
        })
    }
    toAplication(Userdata:UserPrisma):User{
        return new User(
            Userdata.id,
            Userdata.email,
            Userdata.password,
            Userdata.name,
            Userdata.role as Role,
            Userdata.createdAt, 
            Userdata.updatedAt,
        );
    }
    toUpdateUser(userData: UserDto):any{
        return({
            email: userData.email,
            password: userData.password,
        })
    }
}