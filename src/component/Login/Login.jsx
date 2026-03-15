import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { TokenContext } from "../../Context/TokenContext";

const schema =
  z.object({

    email: z
      .string()
      .email({ message: "الإيميل غير صحيح" })
      .min(1, { message: "الإيميل مطلوب" }),
    password: z
      .string()
      .min(6, { message: "كلمة المرور لازم تكون 6 حروف على الأقل" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
          message:
            "لازم تحتوي على حرف كبير أو صغير + رقم + رمز خاص",
        }
      ),
  });
export default function Login() {
  const [Apierror, setApierror] = useState(null)
  const [Isloading, setIsloading] = useState(false)
  const form = useForm({
    defaultValues: {


      email: "",
      password: "",

    },
    resolver: zodResolver(schema),
    mode: "onChange"
  });
  const navigate = useNavigate();
  const { Token, setToken } = useContext(TokenContext);

  async function handelRegister(value) {
    try {
      setIsloading(true);
      setApierror(null);
      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        value
      );

      console.log(response.data.data.token);
      localStorage.setItem("usertoken", response.data.data.token)
      setToken(response.data.data.token)
      setIsloading(false);


      navigate("/home"); // روح على اللوجن

    } catch (err) {
      setIsloading(false);
      setApierror(err.response?.data?.message || "Something went wrong");
    }
  }

  const { register, handleSubmit } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Login Now
        </h1>
        {Apierror && <p className="bg-red-700 rounded-2xl  w-100 text-white font-bold p-2 m-2 mx-auto text-center ">{Apierror}</p>}


        <form
          className="max-w-md mx-auto shadow-xl p-8 rounded-3xl bg-white"
          onSubmit={
            handleSubmit(handelRegister)}  >
          {/* الاسم */}

          {/* الإيميل */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              {...register("email")}
              id="email"

              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your Email
            </label>
          </div>

          {/* كلمة المرور */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              {...register("password")}
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your Password
            </label>
          </div>


          {/* زر الإرسال */}
          <button
            disabled={Isloading}
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none disabled:bg-slate-800 disabled:cursor-not-allowed focus:ring-blue-300 font-medium rounded-3xl disabled:py-4 text-sm w-full px-4 py-4 text-center transition duration-200"
          >
            {Isloading ? <Spinner variant="spinner" />
              : "Login"}
          </button>
        </form>
      </div>
    </div >
  );
}
