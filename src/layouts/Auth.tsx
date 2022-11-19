import FooterSmall from "@component/Footers/FooterSmall";
import Navbar from "@component/Navbars/AuthNavbar";

type PropType = {
  children: JSX.Element;
};

const Auth = ({ children }: PropType) => {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
            }}
          ></div>
          {children}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
};
export default Auth;
