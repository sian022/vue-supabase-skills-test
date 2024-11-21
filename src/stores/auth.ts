import supabase from "@/supabase";
import type { Tables } from "@/types/database/database.types";
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<any>({
        app_metadata: {
            provider: "",
            providers: [],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: null,
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: [],
    });

    const profile = ref<Tables<"profiles">>({
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        created_at: "",
        deleted_at: "",
        updated_at: "",
    });

    const setUser = (payload: User) => {
        user.value = {
            ...user.value,
            ...payload,
        };
    };

    const setProfile = (payload: Tables<"profiles">) => {
        profile.value = {
            ...profile.value,
            ...payload,
        };
    };

    const getUser = (): User => {
        return user.value;
    };

    const getProfile = (): Tables<"profiles"> => {
        return profile.value;
    };

    const signInWithPassword = async (payload: SignInWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword(payload);
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return error;
    };

    const signUp = async (payload: SignUpWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signUp(payload);
        return { data, error };
    };

    const fetchProfile = async (): Promise<void> => {
        if (!user.value.id) {
            console.error("fetchProfile(): Authenticated User ID not found.");
        }

        const { data: userProfile } = await supabase.from("profiles").select().eq("id", user.value.id).single();

        if (userProfile) {
            setProfile(userProfile);
        } else {
            console.error("fetchProfile(): User profile not found.");
        }
    };

    // Added createProfile() function to create a profile for the user.
    const createProfile = async (userId: string, email: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                },
            ])
            .select()
            .single();

        return { data, error };
    };

    // CHANGE: Added registerUser() function to handle user registration + profile creation
    const signUpWithProfile = async ({
        email,
        password,
        firstName,
        lastName,
    }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        // NOTE: Use database transaction to ensure both user and profile are created successfully
        // We can use supabase.rpc() to call a stored procedure that creates both user and profile in a single transaction

        // Step 1: Sign up the user
        const { data: userData, error: signUpError } = await signUp({ email, password });

        if (signUpError || !userData?.user) {
            return {
                data: null,
                error: signUpError || new Error("User signup failed"),
            };
        }

        // Step 2: Create a profile for the user
        const { data: profileData, error: profileError } = await createProfile(userData.user.id, email, firstName, lastName);

        if (profileError || !profileData) {
            return {
                data: null,
                error: profileError || new Error("Profile creation failed"),
            };
        }

        // Return both user and profile data
        return {
            data: {
                ...userData.user,
                ...profileData,
            },
            error: null,
        };
    };

    return {
        // Setters
        setUser,

        // Getters
        getProfile,
        getUser,

        // Actions
        // CHANGE: Removed signUp() function as we only want to expose signUpWithProfile()
        fetchProfile,
        signInWithPassword,
        signOut,
        signUpWithProfile,
    };
});
