import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DeskModule } from './desk/desk.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    DeskModule,
  ],
})
export class AppModule {}
