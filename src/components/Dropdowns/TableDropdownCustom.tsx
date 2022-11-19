import { TableItem } from "@interface/entity.interface";
import { createPopper } from "@popperjs/core";
import { useLocalStorage } from "@util";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { createRef, useState } from "react";

type PropType = {
  item: TableItem;
  updatePageUrl: string;
  handleDeleteClick: (ids: number[]) => Promise<void>;
  updateDataKey: string;
};

const TableDropdownCustom = ({
  item,
  updatePageUrl,
  updateDataKey,
  handleDeleteClick,
}: PropType) => {
  const router = useRouter();
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [updateData, setUpdateData] = useLocalStorage<TableItem>(
    updateDataKey,
    {
      id: 0,
      name: "",
      type: 0,
      price: 0,
      date: new Date(),
    }
  );
  const btnDropdownRef = createRef<any>();
  const popoverDropdownRef = createRef<any>();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => {
            e.preventDefault();
            setUpdateData(item);
            router.push(updatePageUrl);
          }}
        >
          Update
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => {
            handleDeleteClick([item.id]);
            e.preventDefault();
          }}
        >
          Delete
        </a>
      </div>
    </>
  );
};

TableDropdownCustom.propTypes = {
  updatePageUrl: PropTypes.string,
};

export default TableDropdownCustom;
