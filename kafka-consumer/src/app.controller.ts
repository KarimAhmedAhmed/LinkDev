import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserDTO } from './user/user.dto';
import { sendEmail } from './sendEmail/sendEmail'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('activation')
  async activation(req: UserDTO) {
    let body = {
      from: "senderMail",
      to: req.email,
      subject: "Activation",
      text: "Your Activation Code is " + req.activationCode
    }
    let send = await sendEmail(body);
    if (!send) {
      throw new HttpException('send email error', HttpStatus.BAD_REQUEST);

    }
    return {
      status: 200,
      message: "Email sent successfully"

    }
  }


  @MessagePattern('thanks')
  async thanks(req: UserDTO) {
    let body = {
      from: "senderMail",
      to: req.email,
      subject: "Thanks Email",
      text: "Welcome on board thanks for registration"
    }
    let send = await sendEmail(body);
    if (!send) {
      throw new HttpException('send email error', HttpStatus.BAD_REQUEST);

    }
    return {
      status: 200,
      message: "Email sent successfully"

    }
  }
}

