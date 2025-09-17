import { createClientCall } from "@/supabase";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import useSWR from "swr";
import { UserContext } from "./rootprovider";

const fetchUser = async (email: string) => {
    const supabase = createClientCall();
    const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

    if (error) throw error;
    return users && users.length > 0 ? users[0] : null;
};

export default function UserProvider() {
    const { data, status } = useSession();
    const { user, setUser } = useContext<any>(UserContext);

    const email = data?.user?.email;
    const name = data?.user?.name;
    const image = data?.user?.image;

    const { data: fetchedUser, error, isLoading, mutate } = useSWR(
        email ? ["user", email] : null,
        () => fetchUser(email!)
    );

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
        } else if (email && !isLoading && !error) {
            // Create user if not found
            const supabase = createClientCall();
            supabase
                .from("users")
                .insert([
                    {
                        email,
                        name,
                        image,
                        points: 0,
                        subscription: false,
                        notif: [
                            "Welcome to Mindfuzz. Create a new goal and add a deposit to it to get started.",
                        ],
                        notif_read: true,
                    },
                ])
                .select()
                .single()
                .then(({ data: newUser, error: insertError }) => {
                    if (!insertError && newUser) {
                        setUser(newUser);
                        mutate(); // Refetch user
                    }
                });
        }
    }, [fetchedUser, email, isLoading, error, name, image, setUser, mutate]);

    return null;
}
