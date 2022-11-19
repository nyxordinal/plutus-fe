import TableDropdownCustom from "@component/Dropdowns/TableDropdownCustom";
import Loader from "@component/Loader/Loader";
import { TABLE_ROW_PER_PAGE_OPTION } from "@interface/constant";
import { Expense, Income, TableItem } from "@interface/entity.interface";
import { EXPENSE_TYPE } from "@interface/enum";
import { TablePagination } from "@mui/material";
import { currencyFormatter, formatDateSimple } from "@util";
import Link from "next/link";
import PropTypes from "prop-types";

type PropType = {
  name: string;
  color: string;
  loadingTable: boolean;
  createPageUrl: string;
  updatePageUrl: string;
  totalData: number;
  page: number;
  rowsPerPage: number;
  updateDataKey: string;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteClick: (ids: number[]) => Promise<void>;
  items: Expense[] | Income[];
};

function instanceOfExpense(object: any): object is Expense {
  return "name" in object && "price" in object ? true : false;
}

const CardTableCustom = ({
  name,
  color,
  loadingTable,
  createPageUrl,
  updatePageUrl,
  totalData,
  page,
  rowsPerPage,
  updateDataKey,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteClick,
  items,
}: PropType) => {
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {name ? `${name} Table` : "Table"}
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                <Link
                  href={createPageUrl ? createPageUrl : "/create"}
                >{`Create ${name}`}</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Name
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Amount
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Date
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Type
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingTable ? (
                <Loader isFullHeightScreen={false} />
              ) : (
                items
                  .map((row, index): TableItem => {
                    if (instanceOfExpense(row)) {
                      const item = row as Expense;
                      return {
                        id: item.id,
                        name: item.name,
                        type: item.type,
                        price: item.price,
                        date: item.date,
                      } as TableItem;
                    }
                    const item = row as Income;
                    return {
                      id: item.id,
                      name: item.source,
                      type: 0,
                      price: item.amount,
                      date: item.date,
                    } as TableItem;
                  })
                  .map((row, index) => {
                    return (
                      <tr key={index}>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
                          {row.name}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
                          {currencyFormatter.format(row.price)}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
                          {formatDateSimple(row.date)}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
                          {EXPENSE_TYPE[row.type]}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4 text-right">
                          <TableDropdownCustom
                            item={row}
                            updateDataKey={updateDataKey}
                            updatePageUrl={updatePageUrl}
                            handleDeleteClick={handleDeleteClick}
                          />
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <TablePagination
            rowsPerPageOptions={TABLE_ROW_PER_PAGE_OPTION}
            component="div"
            count={totalData}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};

CardTableCustom.defaultProps = {
  color: "light",
};

CardTableCustom.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  name: PropTypes.string,
  createPageUrl: PropTypes.string,
  updatePageUrl: PropTypes.string,
};

export default CardTableCustom;
