import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class NotUniqueFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const { code } = exception?.driverError;
    const error =
      code === '23505'
        ? new ConflictException('Имя пользователя или email уже заняты!')
        : exception;
    super.catch(error, host);
  }
}
