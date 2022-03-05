import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'my-kafka-consumer',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-kafka-consumer',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'my-kafka-consumer',
          },
        },
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    UserModule,
    AuthModule,
   

  ],
  controllers: [AppController,AuthController],
  providers: [AppService,AuthService,JwtStrategy],
})
export class AppModule {}


