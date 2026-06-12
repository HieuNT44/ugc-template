"use client";

import { ArrowLeft, BookOpen, FileText, Newspaper } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateContentStore } from "../hooks/use-create-content-store";
import type { ContentType } from "../types/content-type";

type ContentTypeOption = {
  type: ContentType;
  title: string;
  description: string;
  icon: typeof Newspaper;
  editPath: string;
  required: string[];
  available: boolean;
};

const CONTENT_TYPES: ContentTypeOption[] = [
  {
    type: "blog",
    title: "Blog",
    description: "Long-form articles with rich text or Markdown.",
    icon: Newspaper,
    editPath: "/studio/create/blog/new",
    available: true,
    required: [
      "Title (10–150 characters)",
      "Editor mode (WYSIWYG or Markdown)",
      "Article body (at least 200 words)",
      "Pricing: Free or paid (¥100–¥500)",
      "Paid articles show the first 30% as a reader preview",
    ],
  },
  {
    type: "report",
    title: "Report",
    description: "Upload a PDF report with a reader preview.",
    icon: FileText,
    editPath: "/studio/create/report/edit",
    available: false,
    required: [
      "Title (10–150 characters)",
      "Description (20–2,000 characters)",
      "PDF file",
      "Preview range (5–10 pages)",
      "Pricing: Free or paid (¥1,000–¥5,000)",
      "Paid reports cannot be downloaded as PDF files",
    ],
  },
  {
    type: "book",
    title: "Book",
    description: "Multi-chapter books with optional per-chapter sales.",
    icon: BookOpen,
    editPath: "/studio/create/book/edit",
    available: false,
    required: [
      "Title (10–150 characters)",
      "Description (20–2,000 characters)",
      "At least 2 chapters (title + content)",
      "Pricing: Free or paid (¥500–¥3,000)",
      "Paid books show the first 30% of each chapter as a reader preview",
    ],
  },
];

function RequirementList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className='CreateTypeRequirementList'>
      <p className='text-foreground mb-1.5 text-xs font-semibold tracking-wide uppercase'>
        {title}
      </p>
      <ul className='text-muted-foreground list-disc space-y-1 pl-4 text-sm leading-relaxed'>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CreateTypeSelector() {
  const router = useRouter();
  const reset = useCreateContentStore((s) => s.reset);
  const setContentType = useCreateContentStore((s) => s.setContentType);
  const [comingSoonDialogOpen, setComingSoonDialogOpen] = useState(false);

  function onSelect(item: ContentTypeOption) {
    if (!item.available) {
      setComingSoonDialogOpen(true);
      return;
    }

    reset();
    setContentType(item.type);
    router.push(item.editPath);
  }

  return (
    <>
      <div className='CreateTypeSelector mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-10 lg:max-w-7xl lg:py-14'>
        <div className='mb-10 w-full max-w-2xl text-center'>
          <h1 className='font-serif text-3xl font-bold lg:text-4xl'>
            Create content
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed lg:text-base'>
            Choose a format to get started. Each type has different required
            fields before you can publish.
          </p>
        </div>

        <div className='grid w-full gap-6 lg:grid-cols-3 lg:gap-8'>
          {CONTENT_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.type}
                className='hover:ring-primary/30 flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md'
                onClick={() => onSelect(item)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(item);
                  }
                }}
              >
                <CardHeader className='justify-items-center gap-2 text-center'>
                  <div className='flex flex-col items-center gap-1.5'>
                    <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl'>
                      <Icon className='size-6' />
                    </div>
                    <CardTitle className='text-xl'>{item.title}</CardTitle>
                  </div>
                  <CardDescription className='text-sm leading-relaxed'>
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='flex flex-1 flex-col gap-4'>
                  <RequirementList title='Required' items={item.required} />
                </CardContent>

                <CardFooter className='justify-center pt-2'>
                  <Button
                    variant='outline'
                    className='w-full rounded-full'
                    tabIndex={-1}
                    asChild
                  >
                    <span>Create {item.title}</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className='mt-10 text-center'>
          <Button variant='ghost' asChild>
            <Link href='/studio' className='gap-2 underline underline-offset-4'>
              <ArrowLeft className='size-4' />
              Back to Studio
            </Link>
          </Button>
        </div>
      </div>

      <Dialog
        open={comingSoonDialogOpen}
        onOpenChange={setComingSoonDialogOpen}
      >
        <DialogContent className='CreateTypeComingSoonDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Coming soon</DialogTitle>
            <DialogDescription>
              Chức năng này sẽ được triển khai sau nhé!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              onClick={() => setComingSoonDialogOpen(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
