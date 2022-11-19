import FooterAdmin from "@component/Footers/FooterAdmin";
import HeaderStats from "@component/Headers/HeaderStats";
import AdminNavbar from "@component/Navbars/AdminNavbar";
import Sidebar from "@component/Sidebar/Sidebar";
import PropTypes from "prop-types";

type PropType = {
  children: JSX.Element;
  expenseTotal: number;
  expenseAverage: number;
  incomeTotal: number;
  incomeAverage: number;
};

const AdminDashboard = ({
  children,
  expenseTotal,
  expenseAverage,
  incomeTotal,
  incomeAverage,
}: PropType) => {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats
          expenseTotal={expenseTotal}
          expenseAverage={expenseAverage}
          incomeTotal={incomeTotal}
          incomeAverage={incomeAverage}
        />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
};

AdminDashboard.propTypes = {
  children: PropTypes.element,
  expenseTotal: PropTypes.number,
  expenseAverage: PropTypes.number,
  incomeTotal: PropTypes.number,
  incomeAverage: PropTypes.number,
};

export default AdminDashboard;
