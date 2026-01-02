import { Database } from './database';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export interface OrderWithDetails extends Tables<'orders'> {
    items: (Tables<'order_items'> & {
        product: {
            name: string;
            images: string[] | null;
        } | null;
    })[];
    customer: {
        first_name: string | null;
        last_name: string | null;
        email: string; // auth.users email is not in profiles usually, but we join it or store it in profile? 
        // Wait, in fetchOrder we join 'customer:profiles'. 
        // Profiles table usually doesn't have email if it's just profile data, 
        // but checking current profile definition might be needed. 
        // Let's assume for now based on previous code usage it expects email.
        // Actually, previous code accessed customer.email. 
        // Let's check profile table definition in database.ts.
        phone: string | null;
    } | null;
    timeline: Tables<'order_tracking'>[];
}
