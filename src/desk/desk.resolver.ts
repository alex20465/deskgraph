import {
  Args,
  Query,
  Resolver,
  Root,
  ResolveField,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { DeskService } from './desk.service';
import { PubSub } from 'apollo-server-express';
import { Desk, DeskState } from './models';

const pubSub = new PubSub();

@Resolver((of) => Desk)
export class DeskResolver {
  constructor(private readonly service: DeskService) {}

  @Query((returns) => Desk)
  async desk(@Args('profile') profile: string): Promise<Desk> {
    return this.service.get(profile);
  }

  @ResolveField((returns) => DeskState)
  async state(@Root() desk: Desk): Promise<DeskState> {
    return this.service.getState(desk.profile);
  }

  @Mutation((returns) => DeskState)
  async up(@Args('profile') profile: string): Promise<DeskState> {
    await this.service.up(profile);
    const stateChange = await this.service.getState(profile);
    pubSub.publish('stateChange', { stateChange });
    return stateChange;
  }

  @Mutation((returns) => DeskState)
  async down(@Args('profile') profile: string): Promise<DeskState> {
    await this.service.down(profile);
    const stateChange = await this.service.getState(profile);
    pubSub.publish('stateChange', { stateChange });
    return stateChange;
  }
  @Subscription((returns) => DeskState)
  async stateChange() {
    return pubSub.asyncIterator('stateChange');
  }
}
