import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Permission } from '../../../prisma/generated/permission/entities';
import { Role } from '../../../prisma/generated/role/entities';
import { User } from '../../../prisma/generated/user/entities';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Subject {
  User = 'User',
  Role = 'Role',
  Permission = 'Permission',
  BucketCategory = 'BucketCategory',
  BucketLevel = 'BucketLevel',
  UserBucket = 'UserBucket',
  Team = 'Team',
  TeamMember = 'TeamMember',
  Report = 'Report',
  Technology = 'Technology',
  All = 'all',
}

export type AppAbility = MongoAbility<[Action, Subject | Record<string, any>]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User & { role: Role & { permissions: Permission[] } }) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (!user || !user.role || !user.role.permissions) {
      return build();
    }

    user.role.permissions.forEach((permission) => {
      const action = permission.action as Action;
      const subjectType = permission.subject as Subject;
      const conditions = permission.conditions as any;
      const fields = permission.fields;

      // Process conditions to substitute ${user.id} with actual user ID
      const processedConditions = this.processConditions(conditions, user.id);

      if (processedConditions && fields?.length) {
        can(action, subjectType, fields, processedConditions);
      } else if (processedConditions) {
        can(action, subjectType, processedConditions);
      } else if (fields?.length) {
        can(action, subjectType, fields);
      } else {
        can(action, subjectType);
      }
    });

    return build();
  }

  private processConditions(conditions: any, userId: string): any {
    if (!conditions) return conditions;

    const processValue = (value: any): any => {
      if (typeof value === 'string') {
        return value.replace(/\${user\.id}/g, userId);
      }
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          return value.map(processValue);
        }
        const processed: any = {};
        for (const [key, val] of Object.entries(value)) {
          processed[key] = processValue(val);
        }
        return processed;
      }
      return value;
    };

    return processValue(conditions);
  }
}
