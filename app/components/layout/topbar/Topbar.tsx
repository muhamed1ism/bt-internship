import { Button } from '../../ui/button';
import logo from '@app/assets/logo/bloomteq_logo.png';
import { Link } from 'react-router-dom';
import { Bell, MessageCircleIcon, UserRound } from 'lucide-react';
import { TopbarButton } from './TopbarButton';

export const Topbar = () => {
  return (
    <div className="fixed z-10 inline-flex items-center justify-between h-16 w-full bg-primary">
      <div className="inline-flex items-center h-full pl-1 md:pl-4 gap-2">
        <TopbarButton />
        <Link to="/" className="flex items-center h-full min-lg:pl-4 hover:opacity-80">
          <img src={logo} alt="Bloomteq Logo" className="h-22 text-secondary" />
        </Link>
      </div>
      <div className="inline-flex items-center h-full pr-3 md:pr-8 gap-4">
        <Button
          variant="ghost"
          className="w-8 h-full hover:bg-primary/0 text-secondary hover:text-secondary/80
          cursor-pointer"
        >
          <MessageCircleIcon className='size-6' />
        </Button>
        <Button
          variant="ghost"
          className="w-8 h-full hover:bg-primary/0 text-secondary hover:text-secondary/80
          cursor-pointer"
        >
          <Bell className='size-6' />
        </Button>
        <Button
          variant="secondary"
          className="hover:bg-secondary/80 w-12 h-12 ml-0 md:ml-2 rounded-full cursor-pointer"
        >
          <UserRound className='size-8' />
        </Button>
      </div>
    </div>
  );
}
