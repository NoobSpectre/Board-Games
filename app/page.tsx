import Link from "next/link";

const GAMES = [
  { id: 1, path: "/sudoku", label: "Sudoku" },
  { id: 2, path: "/flip-cards", label: "FlipCards" },
];

export default function HomePage() {
  return (
    <main className="">
      <section
        style={{ height: "calc(100svh - var(--header-height))" }}
        className="grid xs:grid-cols-2 md:grid-cols-3 gap-5 py-10"
      >
        {GAMES.map(({ id, label, path }) => (
          <Link
            key={id}
            href={path}
            className="bg-secondary-10 rounded flex justify-center items-center p-5 hover:shadow-lg transition-shadow"
          >
            <h4
              style={{ textShadow: "0 4px 3px rgb(0 0 0 / 1)" }}
              className="font-heading text-5xl"
            >
              {label}
            </h4>
          </Link>
        ))}
      </section>
    </main>
  );
}
