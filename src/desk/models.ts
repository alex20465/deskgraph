import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {
  DeskState as DeskbluezDeskState,
  LENGTH_UNITS,
} from 'deskbluez/dist/desks/AbstractDesk';

import { DeskModelItem as DeskbluezDeskModelItem } from 'deskbluez/dist/desks/types';

registerEnumType(LENGTH_UNITS, { name: 'LENGTH_UNITS' });

@InputType()
export class DeskMoverInput {
  @Field()
  position: number;

  @Field((type) => LENGTH_UNITS)
  unit: LENGTH_UNITS;
}

@ObjectType()
export class DeskModelItem implements DeskbluezDeskModelItem {
  @Field()
  name: string;

  @Field((type) => [String])
  services: string[];

  @Field()
  cls: string;
}

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
