import CardStats from "@component/Cards/CardStats";
import { currencyFormatter } from "@util";
import { useTranslation } from "locale/translator";
import PropTypes from "prop-types";

type PropType = {
  expenseTotal: number;
  expenseAverage: number;
  incomeTotal: number;
  incomeAverage: number;
};

const HeaderStats = ({
  expenseTotal,
  expenseAverage,
  incomeTotal,
  incomeAverage,
}: PropType) => {
  const { translate } = useTranslation();
  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle={translate("totalExpense")}
                  statTitle={currencyFormatter.format(expenseTotal)}
                  statIconName="fas fa-dollar-sign"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle={translate("avgExpense")}
                  statTitle={currencyFormatter.format(expenseAverage)}
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle={translate("totalIncome")}
                  statTitle={currencyFormatter.format(incomeTotal)}
                  statIconName="fas fa-wallet"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle={translate("avgIncome")}
                  statTitle={currencyFormatter.format(incomeAverage)}
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

HeaderStats.propTypes = {
  expenseTotal: PropTypes.number,
  expenseAverage: PropTypes.number,
  incomeTotal: PropTypes.number,
  incomeAverage: PropTypes.number,
};

HeaderStats.defaultProps = {
  expenseTotal: 0,
  expenseAverage: 0,
  incomeTotal: 0,
  incomeAverage: 0,
};

export default HeaderStats;
