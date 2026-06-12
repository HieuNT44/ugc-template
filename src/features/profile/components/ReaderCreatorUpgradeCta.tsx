import Link from "next/link";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReaderCreatorUpgradeCta() {
  return (
    <div className='ReaderCreatorUpgradeCta border-border bg-muted/40 rounded-xl border px-5 py-4'>
      <p className='text-foreground text-sm leading-relaxed'>
        Upgrade to a <span className='font-semibold'>professional Creator</span>{" "}
        account to publish stories and grow your income on RealRead.
      </p>
      <Button className='mt-3 rounded-full' asChild>
        <Link href='/profile/become-creator'>
          <PenLine className='size-4' />
          Apply to become a Creator
        </Link>
      </Button>
    </div>
  );
}
