"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase.client";
import { doc, getDoc } from "firebase/firestore";

export default function FirestoreTestPage() {
  const [result, setResult] = useState("loading…");

  useEffect(() => {
    (async () => {
      try {
        const db = getDb();
        // Read a doc you create in the console (no write needed)
        // Firestore (database: aurify1225) → Collection: public → Doc ID: hello
        const snap = await getDoc(doc(db, "public", "hello"));
        setResult(snap.exists() ? JSON.stringify(snap.data()) : "doc not found");
      } catch (e: any) {
        setResult("error: " + e.message);
        console.error(e);
      }
    })();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Firestore (aurify1225) — read test</h1>
      <p className="mt-2"><code>{result}</code></p>
    </main>
  );
}
