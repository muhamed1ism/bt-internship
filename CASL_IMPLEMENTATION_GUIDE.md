# CASL Implementation Guide for NestJS

## Overview
This guide explains how to extend your CASL (Conditional Access Control Lists) implementation to work with all models in your NestJS application.

## What We've Done

### 1. Extended Subject Enum
Updated `src/casl/ability-factory/casl-ability.factory.ts` to include all your models:

```typescript
export enum Subject {
  User = 'User',
  Role = 'Role',
  Permission = 'Permission',
  Bucket = 'Bucket',
  BucketCategory = 'BucketCategory',
  BucketLevel = 'BucketLevel',
  Team = 'Team',
  TeamMember = 'TeamMember',
  Report = 'Report',
  Technology = 'Technology',
  All = 'all',
}
```

### 2. Updated Permission Seed Data
Enhanced `src/seed/nonprod/permissionSeedData.ts` with comprehensive permissions for all roles:

#### Admin Role
- Has `manage` action on `all` subjects (full access to everything)

#### Team Lead Role
- **Users**: Read all users, update other users (not themselves)
- **Buckets**: Full CRUD access
- **Teams**: Full CRUD access
- **Reports**: Full CRUD access
- **Categories/Levels**: Read access

#### User Role
- **Users**: Only read/update their own profile
- **Buckets**: Only read buckets they're assigned to
- **Teams**: Only read teams they're members of
- **Reports**: Only CRUD their own reports
- **Categories/Levels**: Read access

### 3. Controller Implementation Pattern

For each controller, follow this pattern:

```typescript
import { AbilitiesGuard } from '../casl/abilities/guard/abilities.guard';
import { CheckAbilities } from '../casl/abilities/decorator/check-abilities.decorator';
import {
  Action,
  AppAbility,
  Subject,
} from '../casl/ability-factory/casl-ability.factory';
import { subject } from '@casl/ability';
import { RequestAbility } from '../casl/abilities/decorator/request-ability.decorator';

@Controller('your-model')
export class YourModelController {
  
  @Get('all')
  @UseGuards(FirebaseJwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.YourModel),
  )
  async getAll(@RequestAbility() ability: AppAbility) {
    const items = await this.service.getAll();
    
    // Filter results based on permissions
    const filteredItems = items.filter((item) =>
      ability.can(Action.Read, subject(Subject.YourModel, item)),
    );

    if (filteredItems.length === 0)
      throw new ForbiddenException('Not authorized to access this resource');

    return filteredItems;
  }

  @Get(':id')
  @UseGuards(FirebaseJwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.YourModel),
  )
  async getById(
    @Param('id') id: string,
    @RequestAbility() ability: AppAbility,
  ) {
    const item = await this.service.getById(id);
    
    if (!item) {
      throw new ForbiddenException('Item not found');
    }
    
    if (!ability.can(Action.Read, subject(Subject.YourModel, item))) {
      throw new ForbiddenException('Not authorized to access this resource');
    }

    return item;
  }

  @Post()
  @UseGuards(FirebaseJwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.YourModel),
  )
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(FirebaseJwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.YourModel),
  )
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestAbility() ability: AppAbility,
  ) {
    const item = await this.service.getById(id);
    
    if (!item) {
      throw new ForbiddenException('Item not found');
    }
    
    if (!ability.can(Action.Update, subject(Subject.YourModel, item))) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(FirebaseJwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.YourModel),
  )
  async delete(
    @Param('id') id: string,
    @RequestAbility() ability: AppAbility,
  ) {
    const item = await this.service.getById(id);
    
    if (!item) {
      throw new ForbiddenException('Item not found');
    }
    
    if (!ability.can(Action.Delete, subject(Subject.YourModel, item))) {
      throw new ForbiddenException('Not authorized to delete this item');
    }

    return this.service.delete(id);
  }
}
```

## Key Components

### 1. Guards
- `FirebaseJwtGuard`: Authenticates the user
- `AbilitiesGuard`: Checks permissions using CASL

### 2. Decorators
- `@CheckAbilities()`: Defines required permissions for the endpoint
- `@RequestAbility()`: Injects the ability instance into the method

### 3. Permission Conditions
Use conditions in your seed data to limit access:

```typescript
// User can only access their own data
{
  action: Action.Read,
  subject: 'User',
  conditions: { id: { $eq: '${user.id}' } },
}

// User can only access buckets they're assigned to
{
  action: Action.Read,
  subject: 'Bucket',
  conditions: { 
    userBuckets: { 
      some: { 
        userId: { $eq: '${user.id}' } 
      } 
    } 
  },
}
```

## Next Steps

1. **Apply the pattern** to all your controllers (Report, Bucket, etc.)
2. **Run your seed script** to populate the database with the new permissions
3. **Test each endpoint** with different user roles to ensure proper access control
4. **Add more specific conditions** as needed for your business logic

## Benefits

- **Centralized permissions**: All permissions defined in one place
- **Database-driven**: Easy to modify permissions without code changes
- **Conditional access**: Fine-grained control over what users can access
- **Type-safe**: Full TypeScript support with proper typing
- **Scalable**: Easy to add new models and permissions

This implementation provides a robust, scalable authorization system for your NestJS application! 