import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserProfile } from "../components/user-profile";

export const Route = createFileRoute("/profile")({
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
  component: UserProfile,
});
