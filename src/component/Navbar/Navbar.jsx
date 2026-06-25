import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,

  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarMenu,
  Badge,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TokenContext } from "../../Context/TokenContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IoMdNotificationsOutline } from "react-icons/io";


export default function MyNavbar() {
  const { Token, setToken } = useContext(TokenContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: !!Token
  })
  const profile = profileData?.data?.data?.user

  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/notifications/unread-count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: !!Token,
    refetchInterval: 30000
  })
  const unreadCount = unreadData?.data?.data?.unreadCount ?? 0
  const logedmenuItems = [

    "home",

    "Log Out",
  ];
  const unlogedmenuItems = [
    "login",
    "register",

  ];
  function logout() {
    localStorage.removeItem("usertoken");
    navigate("/login")
    setToken(null)
  }
  return (
    <Navbar className="w-full px-0">
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarMenu>
        {Token ? logedmenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              onClick={item === "Log Out" && function () {
                logout()
              }}
              className="w-full"
              color={
                index === 2 ? "primary" : index === logedmenuItems.length - 1 ? "danger" : "foreground"
              }
              to={`/${item === "Log Out" ? "login" : item}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        )) :
          unlogedmenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link

                className="w-full"
                color={
                  index === 2 ? "primary" : index === unlogedmenuItems.length - 1 ? "danger" : "foreground"
                }
                to={item}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))
        }
      </NavbarMenu>
      <NavbarBrand>
        <p className="font-bold text-inherit">FAKE-LOOK</p>
      </NavbarBrand>


      <NavbarContent as="div" justify="end">

        <div><NavbarContent className="hidden sm:flex gap-5" justify="end">
          {Token === null && location.pathname !== "/login" && <> <NavbarItem>
            <Link color="foreground" to="/login" >
              Login
            </Link>
          </NavbarItem>
          </>}
          {Token === null && location.pathname === "/login" && <> <NavbarItem isActive>
            <Link aria-current="page" color="secondary" to="/register">
              Register
            </Link>
          </NavbarItem></>}
          {
            Token !== null && <> <NavbarItem>
              <Link color="foreground" to="/home">
                Home
              </Link>
            </NavbarItem></>
          }
        </NavbarContent></div>
        {Token !== null && (
          <Link to="/notifications" className="mr-2 relative">
            <Badge content={unreadCount} size="sm" color="danger" isInvisible={unreadCount === 0}>
              <IoMdNotificationsOutline size={24} className="text-gray-600" />
            </Badge>
          </Link>
        )}
        {Token !== null && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={profile?.name || "User"}
              size="sm"
              src={profile?.photo}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">

            <DropdownItem key="notifications"><Link to="/notifications" className="w-full block">Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}</Link></DropdownItem>
            <DropdownItem key="bookmarks"><Link to="/bookmarks" className="w-full block">Bookmarks</Link></DropdownItem>
            {location.pathname !== "/suggestions" && (
            <DropdownItem key="suggestions"><Link to="/suggestions" className="w-full block">Suggestions</Link></DropdownItem>
            )}
            {location.pathname !== "/settings" && (
            <DropdownItem key="settings"><Link to="/settings" className="w-full block">Settings</Link></DropdownItem>
            )}
            {location.pathname !== "/profile" && (
            <DropdownItem key="configurations"><Link to="/profile" className="w-full block">Profile</Link></DropdownItem>
            )}
            <DropdownItem key="logout" color="danger">
              <Link to="login" className="w-full block" onClick={() => logout()}>              Log Out
              </Link>            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        )}

      </NavbarContent>
    </Navbar>
  );
}
