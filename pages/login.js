import React, { useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Login() {
  const [formData, setformData] = useState({});
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();
  const router = useRouter();

  const updateData = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var [email, password] = [formData.email, formData.password];

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email veya parola hatalı");
      setIsBtnLoading(false);
      return;
    }

    router.replace("/");
  };
  return (
    <div className="container mx-auto p-5">
      <div className="text-center text-2xl mb-5">Giriş Yap</div>
      {error && (
        <div className="p-4 m-4 bg-white rounded-lg ">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="id_email">Email:</label>{" "}
          <input
            type="email"
            name="email"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            id="id_email"
            onChange={updateData}
          />
        </p>
        <p>
          <label htmlFor="id_password">Parola:</label>{" "}
          <input
            type="password"
            name="password"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            minLength={6}
            id="id_password"
            onChange={updateData}
          />
        </p>
        <div className="w-100 flex justify-end">
          <button
            type="submit"
            className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isBtnLoading ? (
              <LoadingIcons.TailSpin
                stroke="white"
                strokeWidth={5}
                height="16px"
              />
            ) : (
              "Giriş Yap"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
