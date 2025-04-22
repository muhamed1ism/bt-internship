import { Bars3Icon, BellIcon, ChatBubbleOvalLeftIcon, UserIcon } from '@heroicons/react/24/solid';
import { Button } from '../ui/button';
import logo from "@app/assets/logo/bloomteq_logo.png";

export const TopBar = () => {
  return <div className="inline-flex items-center justify-between h-16 w-full bg-primary">
    <div className="inline-flex items-center h-full pl-1 md:pl-4 gap-2">
      <Button className="min-lg:hidden text-secondary hover:text-zinc-400">
        <Bars3Icon className="size-8" />
      </Button>
      <a href="/" className="flex items-center h-full min-lg:pl-4 hover:opacity-80">
        <img src={logo} alt="Bloomteq Logo" className="h-22 text-secondary" />
      </a>
    </div>
    <div className="inline-flex items-center pr-3 md:pr-8 gap-4">
      <Button variant="ghost" className="w-8 hover:bg-primary text-secondary hover:text-zinc-400">
        <ChatBubbleOvalLeftIcon className="size-6" />
      </Button>
      <Button variant="ghost" className="w-8 hover:bg-primary text-secondary hover:text-zinc-400">
        <BellIcon className="size-6" />
      </Button>
      <Button variant="secondary" className="hover:bg-zinc-400 w-10 h-10 ml-0 md:ml-2 rounded-full">
        <UserIcon className="size-8 text-primary" />
      </Button>
    </div>
  </div>
}
