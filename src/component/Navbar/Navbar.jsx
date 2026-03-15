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
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TokenContext } from "../../Context/TokenContext";


export default function MyNavbar() {
  const { Token, setToken } = useContext(TokenContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
          {Token == null && location.pathname !== "/login" && <> <NavbarItem>
            <Link color="foreground" to="/login" >
              Login
            </Link>
          </NavbarItem>
          </>}
          {Token == null && location.pathname == "/login" && <> <NavbarItem isActive>
            <Link aria-current="page" color="secondary" to="/register">
              Register
            </Link>
          </NavbarItem></>}
          {
            Token !== null && <> <NavbarItem>
              <Link color="foreground" href="/home">
                Home
              </Link>
            </NavbarItem></>
          }
        </NavbarContent></div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">

            <DropdownItem className="" key="configurations"><Link to="/profile" className="w-full block">Profile</Link></DropdownItem>
            <DropdownItem key="logout" color="danger">
              <Link to="login" className="w-full block" onClick={() => logout()}>              Log Out
              </Link>            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </NavbarContent>
    </Navbar>
  );
}
