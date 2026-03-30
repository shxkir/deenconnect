import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/95 p-10 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl text-cedar">Page not found</h1>
      <p className="mt-3 text-sm text-forest/70">
        The page you requested could not be found.
      </p>
      <div className="mt-6">
        <Link href="/" className="font-semibold text-forest hover:text-cedar">
          Return home
        </Link>
      </div>
    </div>
  );
}

