"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, PenLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { establishLaravelSession } from "@/core/auth/lib/auth-session-client";
import { cn } from "@/lib/utils";

import { submitCreatorApplicationAction } from "../actions";
import {
  becomeCreatorApplicationSchema,
  becomeCreatorIntentFields,
  becomeCreatorProfileFields,
  parseTopicsFromInput,
  type BecomeCreatorFormData,
} from "../validations";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "profile", title: "Creator profile" },
  { id: "intent", title: "Publishing" },
  { id: "review", title: "Review" },
] as const;

interface BecomeCreatorWizardProps {
  defaultValues: Pick<
    BecomeCreatorFormData,
    "name" | "bio" | "country" | "website" | "topics"
  >;
}

function BecomeCreatorStepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className='BecomeCreatorStepIndicator mb-6'>
      <p className='text-muted-foreground mb-3 text-sm'>
        Step {currentStep + 1} of {STEPS.length}
      </p>
      <div className='flex gap-2'>
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index <= currentStep ? "bg-primary" : "bg-muted"
            )}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

export function BecomeCreatorWizard({
  defaultValues,
}: BecomeCreatorWizardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<BecomeCreatorFormData>({
    resolver: zodResolver(
      becomeCreatorApplicationSchema
    ) as Resolver<BecomeCreatorFormData>,
    mode: "onBlur",
    defaultValues: {
      name: defaultValues.name ?? "",
      bio: defaultValues.bio ?? "",
      country: defaultValues.country ?? "",
      website: defaultValues.website ?? "",
      topics: defaultValues.topics ?? "",
      publishPosts: true,
      publishBooks: false,
      publishPaid: false,
      motivation: "",
      portfolioUrl: "",
      acceptTerms: false,
    },
  });

  const values = form.getValues();

  async function goNext() {
    setServerError(null);

    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1) {
      const valid = await form.trigger([...becomeCreatorProfileFields]);
      if (valid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      const valid = await form.trigger([...becomeCreatorIntentFields]);
      if (valid) {
        setStep(3);
      }
    }
  }

  function goBack() {
    setServerError(null);
    setStep((prev) => Math.max(0, prev - 1));
  }

  async function onSubmit(data: BecomeCreatorFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const result = await submitCreatorApplicationAction(data);

      if (result.success) {
        if (result.needsSessionRefresh && session?.accessToken) {
          const sessionResult = await establishLaravelSession({
            success: true,
            accessToken: session.accessToken,
            expiresAt: null,
            redirectTo: result.redirectTo ?? "/studio",
          });

          if (!sessionResult.ok) {
            setServerError(
              sessionResult.error ??
                "Your account was upgraded, but the session could not be refreshed. Please sign in again."
            );
            return;
          }
        }

        setIsComplete(true);
        router.refresh();
        return;
      }

      if (result.error) {
        setServerError(result.error);
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const message = (messages ?? []).join(" ");
          if (message) {
            form.setError(field as keyof BecomeCreatorFormData, { message });
          }
        });
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <Card className='BecomeCreatorWizard'>
        <CardContent className='flex flex-col items-center px-6 py-12 text-center'>
          <CheckCircle className='text-primary mb-4 size-12' />
          <h2 className='font-serif text-2xl font-bold'>
            You&apos;re a Creator!
          </h2>
          <p className='text-muted-foreground mt-2 max-w-md text-sm leading-relaxed'>
            Your account has been upgraded. Start writing in Studio or finish
            setting up your public profile.
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
            <Button className='rounded-full' asChild>
              <Link href='/studio'>
                <PenLine className='size-4' />
                Open Studio
              </Link>
            </Button>
            <Button variant='outline' className='rounded-full' asChild>
              <Link href='/profile'>Back to profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='BecomeCreatorWizard'>
      <CardHeader>
        <CardTitle className='font-serif text-2xl'>
          Become a Creator on RealRead
        </CardTitle>
        <CardDescription>
          Share your expertise through posts and books, and grow your audience.
        </CardDescription>
        <BecomeCreatorStepIndicator currentStep={step} />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {serverError ? (
              <Alert variant='destructive'>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            {step === 0 ? (
              <div className='space-y-4'>
                <ul className='text-muted-foreground list-inside list-disc space-y-2 text-sm leading-relaxed'>
                  <li>Publish long-form posts and multi-chapter books</li>
                  <li>Offer paid content and build recurring readership</li>
                  <li>Access Creator Studio to draft and manage your work</li>
                </ul>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  This short application takes about 2 minutes. We&apos;ll
                  upgrade your account right after you submit.
                </p>
              </div>
            ) : null}

            {step === 1 ? (
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input placeholder='Your name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='bio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Tell readers what you write about and why they should follow you'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 20 characters. Shown on your public profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='topics'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Next.js, Product, Writing'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated. Up to 8 topics.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder='Optional' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='website'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://yoursite.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className='space-y-4'>
                <fieldset className='space-y-3'>
                  <legend className='text-sm font-medium'>
                    What will you publish?
                  </legend>
                  <FormField
                    control={form.control}
                    name='publishPosts'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-3 space-y-0'>
                        <FormControl>
                          <input
                            type='checkbox'
                            className='border-input size-4 rounded border'
                            checked={field.value}
                            onChange={field.onChange}
                            aria-label='Posts'
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>Posts</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='publishBooks'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-3 space-y-0'>
                        <FormControl>
                          <input
                            type='checkbox'
                            className='border-input size-4 rounded border'
                            checked={field.value}
                            onChange={field.onChange}
                            aria-label='Books'
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>Books</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='publishPaid'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-3 space-y-0'>
                        <FormControl>
                          <input
                            type='checkbox'
                            className='border-input size-4 rounded border'
                            checked={field.value}
                            onChange={field.onChange}
                            aria-label='Paid content'
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Paid content
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormMessage>
                    {form.formState.errors.publishPosts?.message}
                  </FormMessage>
                </fieldset>

                <FormField
                  control={form.control}
                  name='motivation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why RealRead? (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='What do you want to create, and who is it for?'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='portfolioUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Portfolio or writing sample (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://medium.com/@you or personal site'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {step === 3 ? (
              <div className='space-y-4'>
                <div className='border-border bg-muted/30 space-y-3 rounded-lg border p-4 text-sm'>
                  <SummaryRow label='Name' value={values.name} />
                  <SummaryRow label='Bio' value={values.bio} />
                  <SummaryRow
                    label='Topics'
                    value={parseTopicsFromInput(values.topics).join(", ")}
                  />
                  <SummaryRow
                    label='Content'
                    value={[
                      values.publishPosts ? "Posts" : null,
                      values.publishBooks ? "Books" : null,
                      values.publishPaid ? "Paid" : null,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <SummaryRow
                    label='Motivation'
                    value={values.motivation ?? ""}
                  />
                </div>

                <CreatorTermsPolicy />

                <FormField
                  control={form.control}
                  name='acceptTerms'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start gap-3 space-y-0'>
                      <FormControl>
                        <input
                          type='checkbox'
                          className='border-input mt-0.5 size-4 rounded border'
                          checked={field.value}
                          onChange={field.onChange}
                          aria-label='Accept Creator Terms'
                        />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='leading-snug font-normal'>
                          I have read and agree to the RealRead Creator Terms
                          and Policy, and understand my profile will be upgraded
                          immediately upon submission.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
              {step > 0 ? (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={goBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : (
                <Button type='button' variant='ghost' asChild>
                  <Link href='/profile'>Cancel</Link>
                </Button>
              )}

              {step < 3 ? (
                <Button type='button' className='rounded-full' onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='rounded-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CreatorTermsPolicy() {
  return (
    <section className='CreatorTermsPolicy border-border bg-background space-y-3 rounded-lg border p-4 text-sm'>
      <div className='space-y-1'>
        <h3 className='font-medium'>RealRead Creator Terms and Policy</h3>
        <p className='text-muted-foreground leading-relaxed'>
          Please review these terms before becoming a Creator. By submitting,
          you confirm that you understand your responsibilities when publishing
          free or paid content on RealRead.
        </p>
      </div>

      <ul className='text-muted-foreground list-disc space-y-2 pl-5 leading-relaxed'>
        <li>
          You keep ownership of your original work, but grant RealRead the right
          to host, display, distribute, and promote your content inside the
          platform.
        </li>
        <li>
          You must only publish content you created or have permission to use,
          including text, images, screenshots, code, files, quotes, and any
          third-party materials.
        </li>
        <li>
          You are responsible for copyright, trademark, privacy,
          confidentiality, and licensing claims related to your content.
        </li>
        <li>
          If you sell paid content, your description, pricing, access terms, and
          included materials must be accurate and not misleading.
        </li>
        <li>
          RealRead may process purchases, platform fees, refunds, access
          changes, payouts, and tax-related information according to platform
          policy and applicable law.
        </li>
        <li>
          RealRead may review, restrict, remove, or disable content or creator
          access if content appears illegal, infringing, abusive, fraudulent, or
          harmful to readers or the platform.
        </li>
      </ul>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
        {label}
      </p>
      <p className='text-foreground mt-0.5 leading-relaxed'>{value || "—"}</p>
    </div>
  );
}
