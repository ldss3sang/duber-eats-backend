import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersSerivce } from './users.service';
import { Verification } from './entities/verfication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UsersResolver, UsersSerivce],
  exports: [UsersSerivce],
})
export class UsersModule {}
