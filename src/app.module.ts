import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { DailyToDoListModule } from './modules/daily-to-do-list/daily-to-do-list.module';
import { ProgressTrackerModule } from './modules/progress-tracker/progress-tracker.module';
import { PointsTableModule } from './modules/points-table/points-table.module';
import { typeOrmModuleConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // Load environment variables from .env or environment
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmModuleConfig],
    }),

    // TypeORM configuration for database connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('typeOrmModuleConfig'),
      }),
    }),

    // Include the AuthModule for handling authentication and JWT
    EmailModule,
    AuthModule,

    // Include other modules for different parts of the application
    UserModule,
    TaskModule,
    DailyToDoListModule,
    ProgressTrackerModule,
    PointsTableModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Use the ResponseInterceptor for intercepting and formatting responses
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    // Use the JwtAuthGuard for guarding routes with JWT authentication
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
