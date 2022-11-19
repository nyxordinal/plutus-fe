import UserDropdown from "@component/Dropdowns/UserDropdown";
import Link from "next/link";
import PropTypes from "prop-types";

type PropType = {
  name: string;
  customUrl: string;
};

const Navbar = ({ name, customUrl }: PropType) => {
  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          <Link href={customUrl}>
            <a
              href={customUrl}
              className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            >
              {name}
            </a>
          </Link>
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
};

Navbar.defaultProps = {
  name: "Plutus",
  customUrl: "/dashboard",
};

Navbar.propTypes = {
  customUrl: PropTypes.string,
  name: PropTypes.string,
};

export default Navbar;
