import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DeskModule } from './desk/desk.module';

const { PLAYGROUND = '0', NODE_ENV = 'production' } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: NODE_ENV === 'development' ? true : PLAYGROUND === '1',
      installSubscriptionHandlers: true,
    }),
    DeskModule,
  ],
})
export class AppModule {}
