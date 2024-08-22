import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_KEY,
        signOptions: {
          expiresIn: '3h',
        },
      }),
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
