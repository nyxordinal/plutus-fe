import { formatDateSimple } from "@util";
import { useTranslation } from "locale/translator";
import { EXPENSE_TYPE, convertToExpenseType } from "@interface/enum";

type PropType = {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  type?: number | undefined;
  showTypeFilter?: boolean;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
};

const SearchBar = ({
  name,
  startDate,
  endDate,
  type,
  showTypeFilter = false,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onTypeChange,
  onApplyFilter,
  onClearFilter,
}: PropType) => {
  const { translate } = useTranslation();
  return (
    <>
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="mb-3 pt-0">
                  <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                    {translate("name")}
                  </h6>
                  <input
                    type="text"
                    placeholder={translate("name")}
                    className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                    value={name}
                    onChange={onNameChange}
                  />
                </div>
              </div>
              {showTypeFilter && (
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-3">
                  <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                    {translate("type")}
                  </h6>
                  <select
                    className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                    value={type || ""}
                    onChange={onTypeChange}
                  >
                    <option value="">{translate("allTypes")}</option>
                    {Object.values(EXPENSE_TYPE)
                      .filter((value) => typeof value === "number")
                      .map((expenseType) => (
                        <option key={expenseType} value={expenseType}>
                          {convertToExpenseType(expenseType as number)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-3">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  {translate("startDate")}
                </h6>
                <input
                  type="date"
                  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  value={formatDateSimple(startDate)}
                  onChange={onStartDateChange}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-3">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  {translate("endDate")}
                </h6>
                <input
                  type="date"
                  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  value={formatDateSimple(endDate)}
                  onChange={onEndDateChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  {translate("applyFilter")}
                </h6>
                <button
                  className="bg-white text-blueGray-800 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onApplyFilter}
                >
                  {translate("submit")}
                </button>
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  {translate("clearFilter")}
                </h6>
                <button
                  className="bg-white text-blueGray-800 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClearFilter}
                >
                  {translate("clear")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
