import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import arrowPng from '../assets/logo/iconmonstr-arrow-right-thin-64.png';

const bucketData = {
  '1': {
    title: 'Software Engineer',
    description: 'A software engineer is responsible for designing, developing, and maintaining software applications. They work with various programming languages and frameworks to create efficient and scalable solutions.',
    skills: [
      'Proficiency in multiple programming languages',
      'Understanding of software development principles',
      'Experience with version control systems',
      'Knowledge of database management',
      'Problem-solving abilities'
    ],
    levels: {
      1: 'Basic understanding of programming concepts and tools',
      2: 'Intermediate skills in multiple programming languages',
      3: 'Advanced expertise in software architecture and design'
    }
  },
  '2': {
    title: 'Data Engineer',
    description: 'A data engineer is responsible for designing, building, and maintaining data pipelines and infrastructure. They ensure data is properly collected, processed, and made available for analysis.',
    skills: [
      'Experience with data warehousing solutions',
      'Knowledge of ETL processes',
      'Proficiency in SQL and NoSQL databases',
      'Understanding of data modeling',
      'Experience with big data technologies'
    ],
    levels: {
      1: 'Basic understanding of data processing and storage',
      2: 'Intermediate skills in data pipeline development',
      3: 'Advanced expertise in data architecture and optimization'
    }
  },
  '3': {
    title: 'AI Engineer',
    description: 'An AI engineer specializes in developing and implementing artificial intelligence and machine learning solutions. They work on creating intelligent systems that can learn and adapt.',
    skills: [
      'Strong background in machine learning',
      'Experience with deep learning frameworks',
      'Knowledge of natural language processing',
      'Understanding of computer vision',
      'Proficiency in Python and AI libraries'
    ],
    levels: {
      1: 'Basic understanding of machine learning concepts',
      2: 'Intermediate skills in model development and training',
      3: 'Advanced expertise in AI system architecture and optimization'
    }
  }
};

const LevelIndicator = ({ currentLevel, totalLevels, title }: { currentLevel: number; totalLevels: number; title: string }) => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full justify-around items-center" style={{ maxWidth: '400px' }}>
        {Array.from({ length: totalLevels * 2 - 1 }).map((_, idx) => {
          if (idx % 2 === 0) {
            // Circle
            const circleIdx = Math.floor(idx / 2) + 1;
            return (
              <div
                key={`circle-${circleIdx}`}
                className={`w-18 h-18 rounded-full flex items-center justify-center border border-black
                  ${circleIdx === currentLevel ? 'bg-green-200 scale-135 ml-3 mr-3 border-3' :
                    circleIdx === currentLevel + 1 ? 'bg-cyan-200 border-2' :
                    'bg-transparent'}
                `}
              >
                {circleIdx}
              </div>
            );
          } else {
            return (
              <img
                key={`arrow-${idx}`}
                src={arrowPng}
                alt="arrow"
                className="w-12 h-6 m-0 p-0"
              />
            );
          }
        })}
      </div>
      <div className="text-2xl font-semibold">
        Current Level: {title} {currentLevel}
      </div>
    </div>
  );
};

export const BucketView = () => {
  const { bucketId } = useParams();
  const navigate = useNavigate();
  const bucket = bucketData[bucketId as keyof typeof bucketData];

  if (!bucket) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <h1 className="text-2xl">Bucket not found</h1>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen flex-col items-center justify-start bg-gray-100 pt-10">
      <div className="w-full px-10 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/buckets')}
          className="hover:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      <LevelIndicator currentLevel={2} totalLevels={3} title={bucket.title} />
    </div>
  );
}; 