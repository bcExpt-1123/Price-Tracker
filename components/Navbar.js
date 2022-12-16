import Link from "next/link";
import React from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function navbar() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
  return (
    <nav className="w-100 p-5 flex justify-center bg-white shadow">
      <ul className="p-0 m-0">
        <li className="inline text-center p-2.5">
          <Link href="/">Ana Sayfa</Link>
        </li>
        {user ? (
          <li
            className="inline text-center p-2.5  cursor-pointer"
            onClick={handleSignOut}
          >
            Çıkış Yap
          </li>
        ) : (
          <>
            <li className="inline text-center p-2.5">
              <Link href="/login">Giriş Yap</Link>
            </li>

            <li className="inline text-center p-2.5">
              <Link href="/register">Kaydol</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
