import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
export default function register() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();

  const updateData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var [email, password] = [data.email, data.password];
    if (password !== data.confirmPassword) {
      setError("Parolalar eşleşmiyor");
      return;
    }

    var userError = createUser(email, password);
    console.log(userError);
  };

  const createUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    return error;
  };

  return (
    <div className="container mx-auto pt-5">
      <div className="text-center text-2xl">Kaydol</div>
      {error && (
        <div className="border border-red-400 rounded-b bg-red-100 px-4 py-2 my-3 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="id_email">Email:</label>{" "}
          <input
            type="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
            Kaydol
          </button>
        </div>
      </form>
    </div>
  );
}
