import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lznyzfopogwqqgpsboku.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bnl6Zm9wb2d3cXFncHNib2t1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNzE4NywiZXhwIjoyMDgxMjgzMTg3fQ.5HrbQuy45b0p4-Q3CsseY-_N3mAqUEwPVgPLQTlmfEg';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setupAdmin() {
    console.log('Fetching users...');

    // List all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    console.log('Found users:', users.users.map(u => ({ id: u.id, email: u.email, confirmed: u.email_confirmed_at })));

    // Find harun@gmail.com
    const harunUser = users.users.find(u => u.email === 'harun@gmail.com');

    if (!harunUser) {
        console.log('User harun@gmail.com not found. Creating new user...');

        // Create the user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: 'harun@gmail.com',
            password: 'Harun@456',
            email_confirm: true // Auto-confirm email
        });

        if (createError) {
            console.error('Error creating user:', createError);
            return;
        }

        console.log('User created:', newUser.user.id);

        // Update profile to admin
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', newUser.user.id);

        if (profileError) {
            console.error('Error updating profile:', profileError);
        } else {
            console.log('Profile updated to admin!');
        }
    } else {
        console.log('Found user:', harunUser.id);

        // Confirm email if not confirmed
        if (!harunUser.email_confirmed_at) {
            const { error: updateError } = await supabase.auth.admin.updateUserById(harunUser.id, {
                email_confirm: true
            });

            if (updateError) {
                console.error('Error confirming email:', updateError);
            } else {
                console.log('Email confirmed!');
            }
        }

        // Update profile to admin
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', harunUser.id);

        if (profileError) {
            console.error('Error updating profile:', profileError);
        } else {
            console.log('Profile updated to admin!');
        }
    }

    console.log('\n✅ Admin setup complete! You can now login at /admin/login');
}

setupAdmin().catch(console.error);
