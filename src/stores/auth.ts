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
        const { data, error } = await supabase.from("profiles").insert([
            {
                id: userId,
                email,
                first_name: firstName,
                last_name: lastName,
            },
        ]);

        if (error) {
            console.error("createProfile():", error);
        }

        return { data, error };
    };

    const registerUser = async ({
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
        const { data: userData, error: signUpError } = await signUp({
            email,
            password,
        });

        if (signUpError) {
            console.error("registerUser() - Sign up error:", signUpError);
            return { data: null, error: signUpError };
        }

        const { data: profileData, error: profileError } = await createProfile(
            userData?.user?.id as string,
            email,
            firstName,
            lastName,
        );

        if (profileError) {
            console.error("registerUser() - Profile creation error:", profileError);
            return { data: null, error: profileError };
        }

        return { data: { ...userData, ...profileData }, error: null };
    };

    return {
        // Setters
        setUser,

        // Getters
        getProfile,
        getUser,

        // Actions
        fetchProfile,
        signInWithPassword,
        signOut,
        signUp,
        registerUser,
    };
});
