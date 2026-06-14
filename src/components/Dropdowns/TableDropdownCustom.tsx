import { TableItem } from "@interface/entity.interface";
import { useLocalStorage } from "@util";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLAnchorElement>(null);
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
  const openDropdownPopover = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX,
      });
    }
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  useEffect(() => {
    if (!dropdownPopoverShow) return;
    const handleClickOutside = () => closeDropdownPopover();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownPopoverShow]);
  return (
    <>
      <div className="inline-block text-left">
        <a
          ref={btnRef}
          className="text-blueGray-500 py-1 px-3"
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
          }}
        >
          <i className="fas fa-ellipsis-v"></i>
        </a>
      </div>
      {dropdownPopoverShow &&
        createPortal(
          <div
            className="fixed bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg min-w-48"
            style={{
              top: `${buttonPosition.top}px`,
              left: `calc(${buttonPosition.left}px - 200px)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="#pablo"
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-50"
              }
              onClick={(e) => {
                e.preventDefault();
                setUpdateData(item);
                closeDropdownPopover();
                router.push(updatePageUrl);
              }}
            >
              Update
            </a>
            <a
              href="#pablo"
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-50"
              }
              onClick={(e) => {
                e.preventDefault();
                closeDropdownPopover();
                handleDeleteClick([item.id]);
              }}
            >
              Delete
            </a>
          </div>,
          document.body
        )}
    </>
  );
};

TableDropdownCustom.propTypes = {
  updatePageUrl: PropTypes.string,
};

export default TableDropdownCustom;
