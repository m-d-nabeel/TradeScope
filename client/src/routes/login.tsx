import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => <div>Hello /login!</div>,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      return redirect({
        to: "/dashboard",
        from: "/login",
      });
    }
  },
});
