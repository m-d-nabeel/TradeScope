import { Layout } from "@/components/layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
  component: Layout,
  beforeLoad: async ({ context }) => {
    console.log(context);

    const { auth } = context;
    console.log(`auth: ${auth}`);

    if (!auth.isAuthenticated) {
      console.log("redirecting to /login");

      return redirect({
        to: "/",
      });
    }
  },
});
