import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { AppService } from './app.service';

import { RegisterDTO } from 'src/user/register.dto';
import { ActivationDTO } from 'src/user/activation.dto';

import { UserService } from 'src/user/user.service';
const generator = require('generate-password');


import { AuthService } from './auth/auth.service';
import { LoginDTO } from './auth/login.dto';


@Controller()
export class AppController {
  constructor(private appService: AppService,
    private userService: UserService,
    private authService: AuthService,) { }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaSample',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'my-kafka-consumer' // Should be the same thing we give in consumer
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.client.subscribeToResponseOf('my-first-topic');
    await this.client.connect();
  }

  // @Get()
  // getHello() {
  //   return this.client.send('my-first-topic', 'Hello TOMA     k'); // args - topic, message
  // }

  @Post('register')
  async register(@Body() RegisterDTO: RegisterDTO) {
    let user = await this.userService.create(RegisterDTO);
    const payload = {
      mobile: user.mobile,
      email: user.email
    };
    //send otp to verify 
    const activationCode = generator.generate({
      length: 4,
      numbers: true,
      exclude: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

    });
    user = await this.userService.update(activationCode);

    const token = await this.authService.signPayload(payload);
    return this.client.send('my-first-topic', user); // args - topic, message
  }


  @Post('activation')
  async activation(@Body() ActivationDTO: ActivationDTO) {
    const user = await this.userService.update(ActivationDTO);

    return this.client.send('my-second-topic', user); // args - topic, message
  }


  @Post('healthy')
  async healthy(@Body() body: any) {

    return {status: 200}; // args - topic, message
  }
}

