<script setup lang="ts">
import { Button } from "@/components/base/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { useToast } from "@/components/base/toast/use-toast";
import { Loader } from "lucide-vue-next";

import { useLoading } from "@/composables/useLoading";
import { delay, getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";

const authStore = useAuthStore();
const router = useRouter();
const { toast } = useToast();
// CHANGE: Created reusable loading composable
const { isLoading, toggleLoading } = useLoading();

// CHANGE: Added zod validation for form
const formSchema = toTypedSchema(
    z.object({
        firstName: z.string().min(1, {
            message: "First Name is required",
        }),
        lastName: z.string().min(1, {
            message: "Last Name is required",
        }),
        email: z
            .string()
            .min(1, {
                message: "Email address is required",
            })
            .email({
                message: "Email address is invalid",
            }),
        password: z
            .string()
            .min(1, {
                message: "Password is required",
            })
            .min(6, {
                message: "Password must be at least 6 characters",
            }),
    }),
);

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    },
});

// CHANGE: Made the form to use try catch to handle errors especially unexpected ones
const submitForm = handleSubmit(async (payload: any) => {
    try {
        toggleLoading();

        const { error } = await authStore.registerUser(payload);

        // CHANGE: Created reusable delay function
        await delay(500);

        if (error) throw error;

        router.push({ name: "panel.dashboard" });
        toast({ description: "Welcome Back!" });
    } catch (error: any) {
        // CHANGE: Created a reusable function to get error message
        console.error(error);
        toast({ description: getErrorMessage(error) });
    } finally {
        toggleLoading();
    }
});
</script>

<template>
    <form class="space-y-6" @submit="submitForm">
        <div class="flex flex-col space-y-2">
            <h1 class="text-2xl font-semibold tracking-tight">Sign Up</h1>
            <p class="text-sm text-gray-400">Enter your credentials below to proceed.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <FormField name="firstName" v-slot="{ componentField }">
                <FormItem>
                    <FormLabel for="firstName">First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="First Name" :disabled="isLoading" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField name="lastName" v-slot="{ componentField }">
                <FormItem>
                    <FormLabel for="lastName">Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Last Name" :disabled="isLoading" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>

        <FormField name="email" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="email">Email Address</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="Email Address" :disabled="isLoading" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="password" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="password">Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="Password" :disabled="isLoading" v-bind="componentField" />
                </FormControl>
                <FormDescription />
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit" id="sign-in" name="sign-in" :disabled="isLoading">
            <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
            Sign Up
        </Button>

        <!-- CHANGE: Added a link to the login page -->
        <div class="flex gap-1">
            <p class="text-sm text-gray-400">Already have an account?</p>
            <RouterLink to="/login" class="text-sm text-blue-500 hover:underline"> Sign in </RouterLink>
        </div>
    </form>
</template>
