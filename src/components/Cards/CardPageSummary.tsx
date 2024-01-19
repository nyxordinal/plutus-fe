import { TABLE_ROW_PER_PAGE_OPTION } from "@interface/constant";
import { Summary } from "@interface/entity.interface";
import { TablePagination } from "@mui/material";
import { formatCurrency, formatDateShort } from "@util";
import { useCurrency } from "currency";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

type PropType = {
  title: string;
  seeAllUrl: string;
  data: Summary[];
  totalData: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CardPageSummary = ({
  title,
  seeAllUrl,
  data,
  totalData,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage
}: PropType) => {
  const router = useRouter();
  const { translate } = useTranslation();
  const { currency } = useCurrency();
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                {title ? title : "Summary"}
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(seeAllUrl);
                }}
              >
                {translate("seeAll")}
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  {translate("yearMonth")}
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  {translate("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                return (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {formatDateShort(row.yearmonth)}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {formatCurrency(currency, row.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
    </>
  );
};

CardPageSummary.propTypes = {
  title: PropTypes.string,
  seeAllUrl: PropTypes.string,
};

export default CardPageSummary;
