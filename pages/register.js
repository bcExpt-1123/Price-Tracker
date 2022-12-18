import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/router";

export default function register() {
  const [formData, setformData] = useState({});
  const [error, setError] = useState(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
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
    setIsBtnLoading(true);
    var [email, password] = [formData.email, formData.password];
    if (password !== formData.confirmPassword) {
      setError("Parolalar eşleşmiyor");
      setIsBtnLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError("Böyle bir kullanıcı mevcut");
      setIsBtnLoading(false);
      return;
    }

    router.replace("/");
  };

  return (
    <div className="container mx-auto p-5">
      <div className="text-center text-2xl">Kaydol</div>
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
        <p>
          <label htmlFor="id_confirmPassword">Parolayı Doğrula:</label>{" "}
          <input
            type="password"
            name="confirmPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            minLength={6}
            id="id_confirmPassword"
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
                height="17px"
              />
            ) : (
              "Kaydol"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
