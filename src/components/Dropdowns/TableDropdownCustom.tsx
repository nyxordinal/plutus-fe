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

type MenuPosition = {
  top?: number;
  bottom?: number;
  right: number;
};

const MENU_GAP_PX = 4;
const MENU_MARGIN_PX = 8;

const getMenuPosition = (button: HTMLElement): MenuPosition => {
  const rect = button.getBoundingClientRect();
  const right = Math.max(window.innerWidth - rect.right, MENU_MARGIN_PX);
  return rect.bottom > window.innerHeight / 2
    ? { bottom: window.innerHeight - rect.top + MENU_GAP_PX, right }
    : { top: rect.bottom + MENU_GAP_PX, right };
};

const TableDropdownCustom = ({
  item,
  updatePageUrl,
  updateDataKey,
  handleDeleteClick,
}: PropType) => {
  const router = useRouter();
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    right: 0,
  });
  const btnRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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
    if (btnRef.current) setMenuPosition(getMenuPosition(btnRef.current));
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  useEffect(() => {
    if (!dropdownPopoverShow) return;

    const handlePointerDown = (event: Event) => {
      const target = event.target as Node;
      if (
        btnRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      closeDropdownPopover();
    };
    const handleReposition = () => {
      if (btnRef.current) setMenuPosition(getMenuPosition(btnRef.current));
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [dropdownPopoverShow]);
  return (
    <>
      <div className="inline-block text-left">
        <a
          ref={btnRef}
          className="text-blueGray-500 inline-flex items-center justify-center w-10 h-10"
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
            ref={menuRef}
            className="fixed bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg min-w-48"
            style={{
              top: menuPosition.top,
              bottom: menuPosition.bottom,
              right: menuPosition.right,
              maxWidth: `calc(100vw - ${MENU_MARGIN_PX * 2}px)`,
            }}
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
