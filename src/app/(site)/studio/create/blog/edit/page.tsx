import { redirect } from "next/navigation";

export default function BlogEditRedirectPage() {
  redirect("/studio/create/blog/new");
}
