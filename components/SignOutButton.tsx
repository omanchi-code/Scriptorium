"use client";

import { logout } from "@/lib/actions";

export default function SignOutButton() {
  return (
    <button onClick={() => logout()} className="bracket-link text-xs">
      Sign out
    </button>
  );
}
