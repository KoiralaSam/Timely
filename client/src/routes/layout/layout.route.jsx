import LoginPage from "../authentication/login-page";

const Layout = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 h-screen">
      <div className=" h-[20%] flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-purple-500 my-8">Timely</h1>

        <p className="text-lg text-gray-700 text-center max-w-2xl">
          A time-keeping web app that lets you clock in/out, keep track of
          hours, and calculate your earned pay in real-time.
        </p>
      </div>

      <LoginPage />
    </div>
  );
};

export default Layout;
