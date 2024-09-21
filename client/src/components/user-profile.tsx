import { useRouteContext } from "@tanstack/react-router";

export const UserProfile = () => {
  const { user } = useRouteContext({
    from: "/profile",
    select: (context) => context.auth,
  });
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500"
          src={user.avatarUrl || "https://via.placeholder.com/150"}
          alt={user.name}
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <button className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none">
          Edit Profile
        </button>
      </div>
    </div>
  );
};
