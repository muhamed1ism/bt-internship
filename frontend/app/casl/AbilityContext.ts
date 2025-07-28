// src/casl/AbilityContext.js
import { createContext } from 'react';
import { PureAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';

export const AbilityContext = createContext(new PureAbility([]));
export const Can = createContextualCan(AbilityContext.Consumer);
