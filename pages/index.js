import React, { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const user = useUser();

  const router = useRouter();

  return (
    <>
      {user && user.email}
      <div class="container mx-auto pt-5">
        <h1 class="text-center text-lg my-3">
          Fiyat değişiminde bildirim almak için
          <a href="/user/register" class="hover:text-blue-400 p-0">
            kaydolun.
          </a>
        </h1>

        <div class="m-auto container">
          <div class="text-center">
            <img
              class="inline-block m-5"
              src="/static/imgs/nike.png"
              width="100"
              height="100"
            />
          </div>
        </div>
        <h1 class="text-center text-lg my-3 text-gray-500">
          Şimdilik eklenebilecek ürün markaları
        </h1>
      </div>
    </>
  );
}
