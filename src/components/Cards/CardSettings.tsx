import { User } from "@interface/entity.interface";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";

type PropType = {
  user: User;
  expenseLimit: string;
  lastNotifDate: string;
  saveExpenseLimit: () => void;
  resetNotification: () => void;
  onChangeExpenseLimit: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnglishLocaleClick: () => void;
  onBahasaLocaleClick: () => void;
};

export default function CardSettings({
  user,
  expenseLimit,
  lastNotifDate,
  onChangeExpenseLimit,
  saveExpenseLimit,
  resetNotification,
  onEnglishLocaleClick,
  onBahasaLocaleClick,
}: PropType) {
  const router = useRouter();
  const { translate } = useTranslation();
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">
              {translate("myAccount")}
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              {translate("userInformation")}
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-name"
                  >
                    {translate("name")}
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
                    {translate("emailAddress")}
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
              {translate("reminderNotif")}
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="input-expense-limit"
                  >
                    {translate("expenseLimit")}
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
                    {translate("lastNotifDate")}
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
                    {translate("saveExpenseLimitBtn")}
                  </button>
                  <h1 className="mt-3">
                    *{translate("saveExpenseLimitBtnDesc")}
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
                    {translate("resetNotifBtn")}
                  </button>
                  <h1 className="mt-3">*{translate("resetNotifBtnDesc")}</h1>
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              {translate("language")}
            </h6>
            <div className="w-full lg:w-6/12 px-4 mt-3">
              <div className="relative w-full">
                <button
                  className={`${
                    router.locale === "en"
                      ? "bg-blueGray-400"
                      : "bg-blueGray-700 active:bg-blueGray-600"
                  } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
                  type="button"
                  disabled={router.locale === "en"}
                  onClick={onEnglishLocaleClick}
                >
                  English
                </button>
                <button
                  className={`${
                    router.locale === "id"
                      ? "bg-blueGray-400"
                      : "bg-blueGray-700 active:bg-blueGray-600"
                  } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
                  type="button"
                  disabled={router.locale === "id"}
                  onClick={onBahasaLocaleClick}
                >
                  Bahasa Indonesia
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
