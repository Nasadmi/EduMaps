import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './entities/user.entity';
import { Markmaps } from './entities/markmaps.entity';
import { MarkmapsModule } from './markmaps/markmaps.module';
import { UserSubscriber } from './subscribers/user.subscriber';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'markmaps-app',
      entities: [User, Markmaps],
      subscribers: [UserSubscriber],
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    UserModule,
    MarkmapsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
