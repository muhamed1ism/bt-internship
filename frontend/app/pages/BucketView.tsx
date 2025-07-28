import { BucketViewContainer } from '@app/features/buckets/components/BucketViewContainer';

/**
 * BucketView page component
 *
 * This is the main entry point for the bucket view page.
 * All logic has been moved to the BucketViewContainer for better
 * separation of concerns and maintainability.
 */
export function BucketView() {
  return <BucketViewContainer />;
}
