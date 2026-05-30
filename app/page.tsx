import Link from "next/link";
import { LayoutGrid, GitBranch, AtSign, CodeXml } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 pt-12 md:pt-16 pb-16 md:pb-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl sm:text-[38px] font-medium tracking-tight leading-snug mb-6 sm:mb-8">
          Hello I am{" "}
          <Link
            href="https://x.com/dibya22_"
            target="_blank"
            className="underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            Dibya
          </Link>
        </h1>

        <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
          <p>First of all, this is not a portfolio website.</p>
          <p>I&#39;m currently learning smooth web animations, and this is where I&#39;ll showcase the things I build while experimenting.</p>
          <p>This project has absolutely no roadmap. If you find random components sitting next to animation demos, that&#39;s because I got distracted by an idea and built it anyway.</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border/90 bg-card-foreground text-background text-base hover:bg-accent-foreground hover:border-ring hover:text-shadow-accent-foreground transition-all whitespace-nowrap"
          >
            <LayoutGrid size={16} />
            Check animation components
          </Link>

          <Link
            href="https://github.com/dibya-22/animation-playground/tree/main/components/playground"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-card-foreground text-base hover:bg-accent hover:border-ring hover:text-accent-foreground transition-all whitespace-nowrap"
          >
            <CodeXml size={16} />
            Component code
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="https://x.com/dibya22_"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-muted-foreground text-base hover:text-foreground hover:border-ring transition-all flex-1 sm:flex-none justify-center sm:justify-start"
            >
              <AtSign size={16} />
              X
            </Link>
            <Link
              href="https://github.com/dibya-22"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-muted-foreground text-base hover:text-foreground hover:border-ring transition-all flex-1 sm:flex-none justify-center sm:justify-start"
            >
              <GitBranch size={16} />
              Github
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}