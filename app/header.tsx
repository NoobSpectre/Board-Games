"use client";

import { GithubIcon } from "@/components/icons";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";

export function Header() {
  const { scrollYProgress } = useScroll();

  return (
    <header className="h-20 relative">
      <div className="wrapper h-full flex items-center justify-between">
        <Link href="/" className="text-4xl font-heading font-bold">
          Board Games
        </Link>

        <nav className="flex items-center gap-10">
          <Link
            href="/"
            className="size-9 p-0.5 rounded-md grid place-content-center hover:bg-text-10 transition-colors"
          >
            <GithubIcon className="size-full fill-text" />
          </Link>
        </nav>
      </div>

      <motion.div
        className="absolute h-1 inset-x-0 top-full bg-[#f43f5e]"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
