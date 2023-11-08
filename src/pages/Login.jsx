import { useState } from "react";
import { backendconfig } from "../utils/backend";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/user.slice";


const Login = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    backendconfig
      .post("login", data)
      .then((res) => {
        console.log(res.data);
        dispatch(login(res.data.userByEmail))
        navigate('/track-media-dashboard')
        localStorage.setItem("userId", res.data.id);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main className="w-full min-h-screen grid content-center">
      <section className="p-3 max-w-md mx-auto w-full">
        <h2 className="text-3xl py-10">Iniciar sesion</h2>
        <form onSubmit={submitLogin} className="grid gap-5">
          <div className="grid gap-5 text-white">
            <input
              className="outline-none h-[48px] bg-gray-700 rounded-lg px-10"
              placeholder="email"
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
          <button className="bg-red-600 py-4 shadow-lg rounded-md">
            login
          </button>
        </form>
      </section>

      {/* <section>
        <h2 style={{ fontSize: "32px" }}>
          <strong>Hello world</strong>
        </h2>
        <p>Access Lancer relaunch</p>

       <section style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
       <img
        style={{width:'100px' , height:'100px'}}
          src="https://res.cloudinary.com/danjwp1pg/image/upload/v1689731280/ab/developers/Aron.jpg"
          alt=""
        />

        <img
        style={{width:'100px' , height:'100px'}}
          src="https://res.cloudinary.com/danjwp1pg/image/upload/v1690148378/ab/developers/Emilio.jpg"
          alt=""
        />

        <img
        style={{width:'100px' , height:'100px'}}
          src="https://res.cloudinary.com/danjwp1pg/image/upload/v1689731280/ab/developers/Fabricio.jpg"
          alt=""
        />

        <img
        style={{width:'100px' , height:'100px'}}
          src="https://res.cloudinary.com/danjwp1pg/image/upload/v1689731279/ab/developers/Luisa.jpg"
          alt=""
        />

        <img
        style={{width:'100px' , height:'100px'}}
          src="https://res.cloudinary.com/danjwp1pg/image/upload/v1689731280/ab/developers/Sergio.jpg"
          alt=""
        />
       </section>
      </section> */}
    </main>
  );
};
export default Login;