// api/webhook/polar/route.ts
import { createClientCall } from "@/supabase";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onOrderCreated: async (payload) => {
        const clientEmail = payload.data.customer.email;
        if (clientEmail) {
            const supabase = createClientCall();


            console.log("Received order created event for:", clientEmail, "$", payload.data.subtotalAmount);
            // Fetch the first habit for this user
            const { data: habits, error: habitsError } = await supabase
                .from('habits')
                .select('*')
                .eq('user_id', clientEmail)
                .is('started', null)
                .eq('deposit', 0)
                .order('created_at', { ascending: false })
                .limit(1);

            if (habitsError || !habits || habits.length === 0) {
                // Optionally handle error or no habit found
                return;
            }

            const habitId = habits[0].id;
            // Update started and deposit fields
            await supabase
                .from('habits')
                .update({
                    started: new Date().toISOString(),
                    deposit: payload.data.subtotalAmount ?? 5
                })
                .eq('id', habitId);

                // Update the user's notif_read and push a new notification
                // Fetch the user first
                const { data: users, error: usersError } = await supabase
                    .from('users')
                    .select('notif')
                    .eq('email', clientEmail)
                    .limit(1);

                if (usersError || !users || users.length === 0) {
                    // Optionally handle error or no user found
                    return;
                }

                const currentNotif = users[0].notif ?? [];
                const newNotif = [
                    ...currentNotif,
                    `${((payload.data.subtotalAmount ?? 500)/100).toFixed(2)} USD was deposited into your last goal challenge`
                ];

                await supabase
                    .from('users')
                    .update({
                        notif_read: true,
                        notif: newNotif
                    })
                    .eq('email', clientEmail);
        }
    },
});