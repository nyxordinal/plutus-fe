import AdminNavbar from "@component/Navbars/AdminNavbar";
import Sidebar from "@component/Sidebar/Sidebar";

type PropType = {
  children: JSX.Element;
  name: string;
  customUrl: string;
};
export default function Admin({ children, name, customUrl }: PropType) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar name={name} customUrl={customUrl} />
        {children}
      </div>
    </>
  );
}
