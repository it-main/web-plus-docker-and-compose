import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      //schema: 'nest_project',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      database: this.configService.get<string>('database.dbname'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true,
      migrationsRun: true,
    };
  }
}
