import { NavLink, Outlet } from "react-router";
import { menuRoutes } from "../router/router";

export const DashboardLayout = () => {
  return (
    <main className="flex flex-row">
      <nav className="hidden sm:flex flex-col w-[500px] h-[calc(100vh)] bg-opacity-10 px-6 py-8 rounded-xl">
        <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent mb-0">
          OpenAI <span className="text-indigo-500">Assistant</span>
        </h1>

        <div className="border-gray-700 border my-3" />

        {/* Opciones del menú */}
        {menuRoutes.map((option, index) => (
          <NavLink
            key={index}
            to={option.to}
            className={({ isActive }) =>
              isActive
                ? "flex flex-row items-center bg-white bg-opacity-20 text-white p-2 rounded-lg"
                : "flex flex-row items-center text-white p-2 rounded-lg"
            }
          >
            <div className="flex flex-row items-center">
              <i className={`mr-4 fas ${option.icon} text-2xl w-8`} />
              <div className="flex flex-col">
                <b>{option.title}</b>
                <small className="text-gray-400">{option.description}</small>
              </div>
            </div>
          </NavLink>
        ))}
      </nav>

      <section className="flex flex-col w-full h-[calc(100vh)] section-container p-5">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-auto h-full">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
