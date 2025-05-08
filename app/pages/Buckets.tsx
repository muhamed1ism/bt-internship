import BucketCard from '../components/layout/bucketCard/BucketCard.tsx';
import { Input } from "../components/ui/input.tsx"

export const Buckets = () => {
  return (
    <div className="flex w-full h-screen flex-col flex-wrap items-center justify-start bg-gray-100 px-10 pt-10">
      <Input className="w-full h-[4%]" placeholder="Search Buckets..."/>
      <div className="flex w-full flex-wrap justify-between gap-y-10 px-10 pt-20">
        <BucketCard title="Software Engineer" currentLevel={2} isActive={true} id="1"/>
        <BucketCard title="Data Engineer" currentLevel={3} isActive={true} id="2"/>
        <BucketCard title="AI Engineer" currentLevel={2} isActive={true} id="3"/>
        <BucketCard title="Software Engineer" currentLevel={2} isActive={false} id="4"/>
      </div>
    </div>
  );
};
