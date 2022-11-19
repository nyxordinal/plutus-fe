import { User } from "@interface/entity.interface";

type PropType = {
  user: User;
  expenseLimit: string;
  lastNotifDate: string;
  saveExpenseLimit: () => void;
  resetNotification: () => void;
  onChangeExpenseLimit: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CardSettings({
  user,
  expenseLimit,
  lastNotifDate,
  onChangeExpenseLimit,
  saveExpenseLimit,
  resetNotification,
}: PropType) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">My Account</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              User Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-name"
                  >
                    Name
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue="name"
                    value={user.name}
                    disabled
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-email"
                  >
                    Email address
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue="email"
                    value={user.email}
                    disabled
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Reminder Notification
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-expense-limit"
                  >
                    Expense Limit
                  </label>
                  <input
                    id="input-expense-limit"
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue="0"
                    value={expenseLimit}
                    onChange={onChangeExpenseLimit}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-reminder-date"
                  >
                    Last Notification Date
                  </label>
                  <input
                    id="input-reminder-date"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={lastNotifDate}
                    disabled
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4 mt-3">
                <div className="relative w-full">
                  <button
                    className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={saveExpenseLimit}
                  >
                    Save Expense Limit
                  </button>
                  <h1 className="mt-3">
                    *A notification will be sent via email if your expenses
                    exceed the limit
                  </h1>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4 mt-3">
                <div className="relative w-full">
                  <button
                    className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={resetNotification}
                  >
                    Reset Notification
                  </button>
                  <h1 className="mt-3">
                    *Resetting the notification will enable it to be sent again
                    via email whenever you exceed your expense limit
                  </h1>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
