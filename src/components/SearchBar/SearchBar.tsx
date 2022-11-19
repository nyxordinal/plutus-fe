import { formatDateSimple } from "@util";

type PropType = {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isFilterChanged: boolean;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
};

const SearchBar = ({
  isFilterChanged,
  name,
  startDate,
  endDate,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
}: PropType) => {
  return (
    <>
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="mb-3 pt-0">
                  <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                    Name
                  </h6>
                  <input
                    type="text"
                    placeholder="Name"
                    className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                    value={name}
                    onChange={onNameChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-3">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  Start Date
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
                  End Date
                </h6>
                <input
                  type="date"
                  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  value={formatDateSimple(endDate)}
                  onChange={onEndDateChange}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                  {isFilterChanged ? "Apply Filter" : "Clear Filter"}
                </h6>
                <button
                  className="bg-white text-blueGray-800 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={isFilterChanged ? onApplyFilter : onClearFilter}
                >
                  {isFilterChanged ? "Submit" : "Clear"}
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
