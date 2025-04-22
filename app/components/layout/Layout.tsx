import { ReactNode } from "react";
import { SideBar } from "./SideBar"
import { TopBar } from "./TopBar"

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <>
    <TopBar />
    <SideBar />
    {children}
  </>
}
