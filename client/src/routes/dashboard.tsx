import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "../components/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    console.log("beforeLoad auth state:", auth);
    if (!auth.isAuthenticated) {
      console.log("Redirecting to login...");
      return redirect({
        to: "/login",
      });
    }
    console.log("User authenticated, proceeding to profile");
  },
});
