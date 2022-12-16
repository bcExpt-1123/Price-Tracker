import React, { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Home() {
  const user = useUser();
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);

  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/getShoe", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        var price = data.price;
        var name = data.title;

        const { error } = await supabase
          .from("shoes")
          .insert({ url, price, name });
        console.log(error);
        {
          error && setError("Bir hata meydana geldi");
        }
      });
  };

  return (
    <>
      <div className="container mx-auto pt-5">
        <h1 className="text-center text-lg font-bold">{user?.email}</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="url">Url</label>
          <input
            type="text"
            name="url"
            className="bg-black-50 border border-black-300 text-black-900 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5"
            required
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="w-100 flex justify-end py-4 px-6">
            <button
              id="add"
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <div role="status">
                {isBtnLoading ? (
                  <LoadingIcons.TailSpin
                    stroke="white"
                    strokeWidth={5}
                    height="17px"
                  />
                ) : (
                  "Ekle"
                )}
              </div>
            </button>
          </div>
        </form>

        <h1 className="text-center text-lg my-3">
          {user ? (
            <>
              Fiyatı değiştiğinde bildirim almak istediğiniz ürünün url'sini
              ekleyiniz.
            </>
          ) : (
            <>
              Fiyat değişiminde bildirim almak için{" "}
              <Link href="/register" className="hover:text-blue-400 p-0">
                kaydolun.
              </Link>
            </>
          )}
        </h1>
        <div className="m-auto container">
          <div className="text-center">
            <img
              className="inline-block m-5"
              src="/nike.png"
              width="100"
              height="100"
            />
          </div>
        </div>
        <h1 className="text-center text-lg my-3 text-gray-500">
          Şimdilik eklenebilecek ürün markaları
        </h1>
      </div>
    </>
  );
}
