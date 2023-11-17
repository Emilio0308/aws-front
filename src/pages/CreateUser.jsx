import { useNavigate } from "react-router-dom";
import { backendconfig } from "../utils/backend";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/user.slice";

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerUser = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const newUserData = { name, email, password };
    backendconfig
      .post("create-user", newUserData)
      .then((res) => {
        const { newUser, JWT } = res.data;
        dispatch(login({ ...newUser, JWT }));
        navigate("/track-media-dashboard");
      })
      .catch((err) => console.log(err));
  };
  return (
    <main className="w-full min-h-screen grid content-center">
      <section className="p-3 max-w-md mx-auto w-full">
        <div className="capitalize tracking-[2px] text-blue-600 font-semibold text-3xl py-10">
          <h2>unete a la comunidad de Track-Media</h2>
        </div>
        <form onSubmit={registerUser} className="grid gap-5">
          <div className="grid gap-5 text-white">
            <input
              className="outline-none h-[48px] bg-gray-700 rounded-lg px-10"
              placeholder="your name"
              id="name"
              type="text"
            />
            <input
              className="outline-none h-[48px] bg-gray-700 rounded-lg px-10"
              placeholder="example@gmail.com"
              id="email"
              type="text"
            />
            <input
              className="outline-none h-[48px] bg-gray-700 rounded-lg px-10"
              placeholder="password"
              id="password"
              type="password"
            />
          </div>
          <button className="bg-blue-600 py-4 shadow-lg rounded-md">
            Crear Usuario
          </button>
        </form>
      </section>
    </main>
  );
};
export default CreateUser;
