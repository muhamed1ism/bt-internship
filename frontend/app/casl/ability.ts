// src/casl/ability.js
import { Permission } from '@app/types/shared';
import { PureAbility } from '@casl/ability';

export function defineAbilityFor(permissions: Permission[]) {
  return new PureAbility(
    permissions.map((p) => ({
      action: p.action,
      subject: p.subject,
    })),
  );
}
