import {
  Args,
  Query,
  Resolver,
  Root,
  ResolveField,
  Mutation,
  Subscription,
  registerEnumType,
} from '@nestjs/graphql';
import { DeskbluezService } from './deskbluez.service';
import { PubSub } from 'apollo-server-express';
import { Desk, DeskModelItem, DeskMoverInput, DeskState } from './models';
import { LENGTH_UNITS } from 'deskbluez/dist/desks/AbstractDesk';

const pubSub = new PubSub();

registerEnumType(LENGTH_UNITS, { name: 'LENGTH_UNITS' });

@Resolver((of) => Desk)
export class DeskResolver {
  constructor(private readonly service: DeskbluezService) {
    service.onStateChange('default', (state) => {
      pubSub.publish(`state.change.default`, { stateChange: state });
    });
  }

  @Query((returns) => Desk)
  async desk(@Args('profile') profile: string): Promise<Desk> {
    return this.service.get(profile);
  }

  @Query((returns) => [DeskModelItem])
  async models(): Promise<DeskModelItem[]> {
    return (await this.service.getModels()).map((item) => ({
      cls: item.cls.name || 'non',
      name: item.name,
      services: item.services,
    }));
  }

  @ResolveField((returns) => DeskState)
  async state(@Root() desk: Desk): Promise<DeskState> {
    return this.service.getState(desk.profile);
  }

  @Mutation((returns) => DeskState)
  async up(@Args('profile') profile: string): Promise<DeskState> {
    await this.service.up(profile);
    const stateChange = await this.service.getState(profile);
    return stateChange;
  }

  @Mutation((returns) => DeskState)
  async down(@Args('profile') profile: string): Promise<DeskState> {
    await this.service.down(profile);
    const stateChange = await this.service.getState(profile);
    return stateChange;
  }

  @Mutation((returns) => Boolean)
  async to(
    @Args('profile') profile: string,
    @Args('input') input: DeskMoverInput,
  ): Promise<boolean> {
    return this.service.to(profile, input.position, input.unit);
  }

  @Subscription((returns) => DeskState)
  async stateChange(@Args('profile') profile: string) {
    return pubSub.asyncIterator(`state.change.${profile}`);
  }
}
