import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PasswordService } from '../auth/password.service';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';
import { UserSessionService } from '../user-session/user-session.service';
import { UserSessionModule } from '../user-session/user-session.module';
import { UserSession } from '../user-session/user-session.entity';
import { GoogleCloudService } from 'src/common/services/google-cloud/google-cloud.service';
import { UserModule } from '../user/user.module';
import { CryptoKeysModule } from '../crypto-keys/crypto-keys.module';

@Module({
  imports: [
    OtpModule,
    UserSessionModule,
    UserModule,
    CryptoKeysModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
})
export class AuthModule {

  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CurrentUserMiddleware).forRoutes('*');
  // }
}
