import React, { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Home() {
  const user = useUser();
  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false);
  const [deleteBtnsLoading, setDeleteBtnsLoading] = useState({});
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [trackingShoes, setTrackingShoes] = useState([]);

  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data } = await supabase
      .from("link_user_to_shoe")
      .select("id,shoes(url,price,name)")
      .match({ email: user.email });

    let obj = data.map((e) => {
      let id = e.id;
      setDeleteBtnsLoading((prevState) => ({ ...prevState, [id]: false }));
      return Object.assign(e.shoes, { id });
    });
    setTrackingShoes(obj);
    setError(null);
  };

  const handleDelete = async (id) => {
    setDeleteBtnsLoading((prevState) => ({ ...prevState, [id]: true }));
    const { error: deleteError } = await supabase
      .from("link_user_to_shoe")
      .delete()
      .eq("id", id);
    {
      deleteError && setError("Bir Hata Meydana Geldi");
    }

    fetchUserData();
    setDeleteBtnsLoading((prevState) => ({ ...prevState, [id]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddBtnLoading(true);
    var price;
    var name;
    const shoeUrl = url.replace(/\s/g, "");

    await fetch("/api/getShoe", {
      method: "POST",
      body: JSON.stringify({ url: shoeUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data.error) {
          setError("Lütfen sadece aşşağıdaki markalara ait ürünleri giriniz");
          setIsAddBtnLoading(false);
          setUrl("");
          return;
        }
        price = data.price.replace("₺", "").replace(".", "").replace(",", ".");
        price = parseFloat(price);
        name = data.title;
      });

    if (!price) return;

    const { error: shoeError } = await supabase
      .from("shoes")
      .insert({ url: shoeUrl, price, name })
      .select();

    if (shoeError && shoeError.code !== "23505") {
      setError("Bir hata meydana geldi");
      setIsAddBtnLoading(false);
      setUrl("");
      return;
    }

    const { data: check } = await supabase
      .from("link_user_to_shoe")
      .select("id")
      .match({ email: user.email, shoe: shoeUrl });
    if (check.length) {
      setError("Bu ürünü zaten takip ediyorsunuz");
      setIsAddBtnLoading(false);
      setUrl("");
      return;
    }

    const { error: linkError } = await supabase
      .from("link_user_to_shoe")
      .insert({ email: user.email, shoe: url });
    fetchUserData();
    setUrl("");
    setIsAddBtnLoading(false);
  };

  return (
    <>
      <div className="container mx-auto pt-5">
        <h1 className="text-center text-lg font-bold">{user?.email}</h1>
        {error && (
          <div className="p-4 m-4 bg-white rounded-lg ">
            <p>{error}</p>
          </div>
        )}
        {user && (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="url">Url</label>
              <input
                type="url"
                name="url"
                className="bg-black-50 border border-black-300 text-black-900 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="w-100 flex justify-end py-4 px-6">
                <button
                  id="add"
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <div role="status">
                    {isAddBtnLoading ? (
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

            <table className="w-full text-sm text-left text-gray-500">
              <thead className="border-b">
                <tr className="bg-white border-b">
                  <th scope="col" className="py-3 px-6">
                    Id
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Url
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {trackingShoes.map((shoe) => (
                  <tr className="border-b" key={shoe.id}>
                    <td className="py-4 px-6">{shoe.id}</td>
                    <td className="py-4 px-6">{shoe.name}</td>
                    <td className="py-4 px-6">{shoe.url}</td>
                    <td className="py-4 px-6">{shoe.price}</td>
                    <td className="py-4 px-6 flex justify-end">
                      <button
                        onClick={() => {
                          handleDelete(shoe.id);
                        }}
                        className="mt-5 bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {deleteBtnsLoading[shoe.id] ? (
                          <LoadingIcons.TailSpin
                            stroke="white"
                            strokeWidth={5}
                            height="17px"
                          />
                        ) : (
                          "Kaldır"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h1 className="text-center text-lg my-3">
          {user ? (
            <>
              {!trackingShoes.length &&
                "Fiyatı değiştiğinde bildirim almak istediğiniz ürünün url'sini ekleyiniz."}
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
