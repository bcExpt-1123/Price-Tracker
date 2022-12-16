import React, { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Home() {
  const user = useUser();
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [trackingShoes, setTrackingShoes] = useState({});

  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("link_user_to_shoe")
      .select("shoes(url,price,name)")
      .match({ email: user.email });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBtnLoading(true);
    var price;
    var name;

    await fetch("/api/getShoe", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        price = data.price.replace("₺", "").replace(".", "").replace(",", ".");
        price = parseFloat(price);
        name = data.title;
      });

    const { error: shoeError } = await supabase
      .from("shoes")
      .insert({ url, price, name })
      .select();

    if (shoeError && shoeError.code !== "23505") {
      setError("Bir hata meydana geldi");
      setIsBtnLoading(false);
      return;
    }

    const { data: check } = await supabase
      .from("link_user_to_shoe")
      .select("id")
      .match({ email: user.email, shoe: url });
    if (check.length) {
      setError("Bu ürünü zaten takip ediyorsunuz");
      setIsBtnLoading(false);
      return;
    }

    const { error: linkError } = await supabase
      .from("link_user_to_shoe")
      .insert({ email: user.email, shoe: url });
    setIsBtnLoading(false);
  };

  return (
    <>
      <div className="container mx-auto pt-5">
        <h1 className="text-center text-lg font-bold">{user?.email}</h1>
        {error && (
          <div className="border border-red-400 rounded-b bg-red-100 px-4 py-2 my-3 text-red-700">
            <p>{error}</p>
          </div>
        )}
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

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="border-b">
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="col" className="py-3 px-6">
                Id
              </th>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Url
              </th>
              <th scope="col" className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {}
            <tr className="border-b">
              <th>1</th>
              <th>Nike Precision 5</th>
              <td className="py-4 px-6">
                https://www.nike.com/tr/t/precision-5-basketbol-ayakkab%C4%B1s%C4%B1-L3gD0s/CW3403-003
              </td>
              <td className="py-4 px-6 flex justify-end">
                <form action="/shoes/unwatch" method="POST">
                  <button
                    type="submit"
                    className="mt-5 bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Kaldır
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>

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
