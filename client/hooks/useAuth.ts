import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const res = await fetch("/api/auth/user", {
    credentials: "include",
  });
  
  if (res.status === 401) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
  
  return res.json();
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
