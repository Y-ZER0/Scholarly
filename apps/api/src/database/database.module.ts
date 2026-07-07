import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: "postgres",
        url: config.get<string>("DATABASE_URL"),
        ssl: config.get("NODE_ENV") === "production" ? { rejectUnauthorized: false } : false,
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: true,
        logging: config.get("NODE_ENV") === "development",
        extra: {
          max: 5,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
