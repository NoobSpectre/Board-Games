import { ArrowUpIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type MoveToTopProps = {
  className?: string;
};

export function MoveToTop({ className }: MoveToTopProps) {
  return (
    <button
      className={cn(
        "fixed size-10 right-20 bottom-20 rounded-full shadow-lg bg-accent grid place-content-center",
        className
      )}
    >
      <ArrowUpIcon className="text-background" />
    </button>
  );
}
