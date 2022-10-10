import React from "react";

const NavLinkMobile = (props) => {
  return (
    <>
      <li className="mb-1">
        <a
          className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
          href={props.link}
        >
          {props.name}
        </a>
      </li>
    </>
  );
};

export default NavLinkMobile;
