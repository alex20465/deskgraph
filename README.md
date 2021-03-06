# Deskgraph (deskbluez microservice)

This is a GraphQL microservice implementation of [deskbluez](https://github.com/alex20465/deskbluez) with the goal to decouple the application backend system for ui implementations.

## UNDER DEVELOPMENT

# Features

- Subscribe to desk state changes via graphQL subscriptions

- Perform mutations: Up/Down

# Requirements

- See requirements section [deskbluez#requirements](https://github.com/alex20465/deskbluez#Requirements)

# Installation

```
$ npm install -g deskgraph
```

> Deskbluez is not required but its necessary to configure the devices

# Configuration

Deskgraph uses the same configuration manager as `deskbluez`, every created profile is compatible with the deskgraph as long the micro-service and the cli tool is used by the same user.

# Run service

```
$ deskgraph
```

> Access graphQL endpoint under: `http://localhost:3000/graphql`

> When PLAYGROUND is enabled, the apollo-playground is accessible under `/graphql`

## Configurations (ENVIRONMENT VARIABLES)

```
HTTP_PORT=XXXX (default: 3000)
PLAYGROUND=X (default: 0)
```

USAGE:

```
$ PLAYGROUND=1 HTTP_PORT=5000 deskgraph
```

Playground:

![Playground](./assets/apollo-playground-screenshot.png)

# Query & Mutation examples


# Use it Programmatically

```typescript

import {NestFactory, AppModule} from "deskgraph";

async function customBootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

customBootstrap();

```

You can use the nestjs module separately by importing the `DeskModule`:

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DeskModule } from 'deskgraph';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    DeskModule,

    /**
     * Your additional modules
     */

  ],
})
export class YourCustomNestJSModuleApplication {}
```

OR just use the `DeskService`:

```typescript
import { Module } from '@nestjs/common';
import { DeskbluezService } from 'deskgraph';

@Module({
  providers: [DeskService],
})
export class MyNestJSModule {}

```

---

`all you need is here, keep calm and stop being emotional, start using nestjs with typescript and don't waste your time.`

---