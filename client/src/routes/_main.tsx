import { Loading } from "@/components/common/loading";
import { Layout } from "@/components/layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
  component: Layout,
  pendingComponent: Loading,
  beforeLoad: async ({ context }) => {
    console.log(context);
    const { globalCtx } = context;
    if (!globalCtx.isAuthenticated) {
      console.log("redirecting to /login");
      return redirect({
        to: "/",
      });
    }
  },
});
