import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { RegisterUserProvider } from './providers/register-user.providre';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService, FindOneUserByEmailProvider, RegisterUserProvider],
  controllers: [UsersController],
  imports: [forwardRef(() => AuthModule)],
  exports: [UsersService, RegisterUserProvider],
})
export class UsersModule { }
