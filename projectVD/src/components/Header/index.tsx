import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useState } from "react";
import Message from "@/app/message/page";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [user, setUser] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const totalNoUnreadMessages = localStorage.getItem("totalUnread")

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8000/getUser?email=${email}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}
          </ul>
          {/* <!-- Message Section --> */}
          {userEmail && <><a href="/message">
            <img src="/images/icon/message-solid.svg" alt="" width={35}
              height={35} />
          </a></>}
          {/* <!-- Message Section --> */}
          {/* <!-- User Area --> */}
          {userEmail && <DropdownUser />}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
