import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { TransferModule } from './transfer/transfer.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';

@Module({
  imports: [CompanyModule, TransferModule, 
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: "APP_INTERCEPTOR",
      useClass: ErrorInterceptor,
    },
    {
      provide: "APP_INTERCEPTOR",
      useClass: ResponseInterceptor
    },
  ],
})
export class AppModule { }
