"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTemplateInfiniteScroll } from "../hooks/use-template-infinite-scroll";
import type { BlogTemplate } from "../lib/blog-templates";
import { useCreateContentStore } from "../hooks/use-create-content-store";

function TemplatePreviewLines({ count = 2 }: { count?: number }) {
  const widths = ["w-full", "w-11/12", "w-4/5", "w-3/4"];

  return (
    <div className='TemplatePreviewLines flex flex-col gap-1.5'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-muted/80 h-2 rounded-full",
            widths[index % widths.length]
          )}
        />
      ))}
    </div>
  );
}

function TemplatePreviewCard({
  template,
  onSelect,
}: {
  template: BlogTemplate;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "TemplatePreviewCard group border-border bg-card hover:border-foreground/20 relative flex h-[320px] cursor-pointer flex-col overflow-hidden rounded-xl border transition-all hover:shadow-md",
        template.id === "blank" && "border-primary/40 ring-primary/20 ring-1"
      )}
      onClick={onSelect}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-60'
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />

      <div className='relative flex flex-1 flex-col px-5 pt-5 pb-0'>
        <h3 className='text-base font-semibold'>{template.name}</h3>
        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
          {template.description}
        </p>

        <div className='mt-5 flex flex-col gap-4 overflow-hidden'>
          {template.previewSections.map((section) => (
            <div key={section.title} className='flex flex-col gap-1.5'>
              <p className='text-xs font-medium'>{section.title}</p>
              <div className='border-border/80 bg-background/90 rounded-md border px-3 py-2.5'>
                <TemplatePreviewLines count={section.lineCount ?? 2} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className='from-card via-card/95 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent'
        aria-hidden
      />
    </article>
  );
}

export function TemplateSelector() {
  const router = useRouter();
  const setTemplateId = useCreateContentStore((s) => s.setTemplateId);
  const patch = useCreateContentStore((s) => s.patch);
  const { visibleTemplates, hasMore, isLoadingMore, sentinelRef, totalCount } =
    useTemplateInfiniteScroll();

  function applyTemplate(templateId: string, content: string) {
    setTemplateId(templateId);
    patch({ content, editorMode: "markdown" });
    router.push("/studio/create/blog/new");
  }

  function onSkip() {
    setTemplateId(null);
    router.push("/studio/create/blog/new");
  }

  return (
    <div className='TemplateSelector mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-10 lg:max-w-7xl lg:py-14'>
      <div className='mb-10 w-full'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='max-w-2xl'>
            <h1 className='font-serif text-3xl font-bold lg:text-4xl'>
              Choose a blog template
            </h1>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed lg:text-base'>
              Start from a proven structure or skip to write freely. Scroll to
              browse more templates.
            </p>
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <Button variant='ghost' className='rounded-full' asChild>
              <Link href='/studio/create'>戻る</Link>
            </Button>
            <Button variant='outline' className='rounded-full' onClick={onSkip}>
              スキップ
            </Button>
          </div>
        </div>
      </div>

      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
        {visibleTemplates.map((template) => (
          <TemplatePreviewCard
            key={template.id}
            template={template}
            onSelect={() => applyTemplate(template.id, template.content)}
          />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className='mt-8 flex w-full items-center justify-center py-4'
        aria-hidden={!hasMore && !isLoadingMore}
      >
        {isLoadingMore ? (
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Loader2 className='size-4 animate-spin' />
            Loading more templates…
          </div>
        ) : hasMore ? (
          <p className='text-muted-foreground text-xs'>
            Showing {visibleTemplates.length} of {totalCount} templates
          </p>
        ) : (
          <p className='text-muted-foreground text-xs'>
            All {totalCount} templates loaded
          </p>
        )}
      </div>
    </div>
  );
}
