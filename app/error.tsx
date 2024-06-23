'use client'
import Link from "next/link"

function error() {
  return (
    <main className="flex flex-col items-center justify-center">
      <h3>This page not found</h3>
      <p>
        <Link href="/posts">Back to home</Link>
      </p>
    </main>
  )
}

export default error