import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import environmentValidation from './config/environment.validation';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TestModule } from './test/test.module';
// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import typeormConfig from './config/typeorm.config';
import redisConfig from './config/redis.config';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PostgresExceptionInterceptor } from './common/interceptors/postgres-exception.interceptor';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception.interceptor';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { RedisModule } from './redis/redis.module';
import { DbLockModule } from './dblocks/dblocks.module';
import { CategoriesModule } from './categories/categories.module';
import { CarsModule } from './cars/cars.module';
import { PrismaModule } from '../prisma/prisma.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    /**
     * Static files
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      serveRoot: '/',
      exclude: ['/api*', '/swagger*'],
    }),
    /**
     * Environment Config
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, redisConfig],
      validationSchema: environmentValidation,
    }),
    // Keep TypeORM during migration; remove when fully on Prisma
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    //     const typeOrmConfig = configService.get<TypeOrmModuleOptions>('typeorm');
    //     if (!typeOrmConfig) {
    //       throw new Error('TypeORM configuration is not defined');
    //     }
    //     return typeOrmConfig;
    //   },
    // }),
    PrismaModule,
    TestModule,
    UsersModule,
    AuthModule,
    RedisModule,
    DbLockModule,
    CategoriesModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PostgresExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule { }
