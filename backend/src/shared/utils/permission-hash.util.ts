import * as crypto from 'crypto';

export function hashObject(value: unknown): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(value || {}))
    .digest('hex');
}

export function hashSortedArray(value: string[]): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify((value || []).sort()))
    .digest('hex');
}
