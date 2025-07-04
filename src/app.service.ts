import { Injectable } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Injectable()
@Public()
export class AppService {
 
   getHello(): string {
    return 'Bienvenu dans l`Api Findi 🎉🎉';
  }
}
