import { Field, ID, ObjectType } from '@nestjs/graphql';

import { DeskState as DeskbluezDeskState } from 'deskbluez/dist/desks/AbstractDesk';

@ObjectType()
export class DeskState implements DeskbluezDeskState {
  @Field()
  cm: number;

  @Field()
  inch: number;

  @Field()
  value: number;

  @Field()
  speed: number;
}

@ObjectType()
export class Desk {
  @Field((type) => ID)
  profile: string;

  @Field()
  name: string;

  @Field()
  address: string;
}
