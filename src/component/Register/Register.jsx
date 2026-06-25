import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";


const schema =
  z.object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name is too long" })
      .trim(),

    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
          message:
            "Must contain a letter, a number, and a special character",
        }
      ),
    rePassword: z.string(),

    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age >= 8 && age <= 100;
        },
        { message: "You must be at least 8 years old" }
      ),

    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
      invalid_type_error: "Please select a valid gender",
    }),
  })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    });
export default function Register() {
  const [Apierror, setApierror] = useState(null)
  const [Isloading, setIsloading] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",

      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange"
  });
  const navigate = useNavigate();
  async function handelRegister(value) {
    try {
      setIsloading(true);
      setApierror(null);

      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        value
      );

      console.log(response.data);

      setIsloading(false);

      navigate("/login"); // روح على اللوجن

    } catch (err) {
      setIsloading(false);
      setApierror(err.response?.data?.message || "Something went wrong");
    }
  }

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Register Now
        </h1>
        {Apierror && <p className="bg-red-700 rounded-2xl  w-100 text-white font-bold p-2 m-2 mx-auto text-center ">{Apierror}</p>}


        <form
          className="max-w-md mx-auto shadow-xl p-8 rounded-3xl bg-white"
          onSubmit={
            handleSubmit(handelRegister)}  >
          {/* الاسم */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              {...register("name")}
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your Name
            </label>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              {...register("rePassword")}
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm your Password
            </label>
            {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
          </div>

          {/* تاريخ الميلاد */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="date"
              {...register("dateOfBirth")}
              id="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="dateOfBirth"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Date of Birth
            </label>
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          {/* الجنس */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center">
              <input
                id="male"
                type="radio"
                value="male"
                {...register("gender")}
                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="male"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="female"
                type="radio"
                value="female"
                {...register("gender")}

                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="female"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Female
              </label>
            </div>
          </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}

          {/* زر الإرسال */}
          <button
            disabled={Isloading}
            type="submit"
            className="text-white bg-[#6f4ef2] hover:bg-[#5a3de0] focus:ring-4 focus:outline-none disabled:bg-slate-800 disabled:cursor-not-allowed focus:ring-[#6f4ef2]/30 font-medium rounded-3xl text-sm w-full px-5 py-2.5 text-center transition duration-200"
          >
            {Isloading ? <Spinner variant="spinner" /> : "register"}
          </button>
        </form>
      </div>
    </div >
  );
}
