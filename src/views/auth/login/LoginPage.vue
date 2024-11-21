<script setup lang="ts">
import { Button } from "@/components/base/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/form";
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
        email: z
            .string()
            .min(1, {
                message: "Email address is required",
            })
            .email({
                message: "Email address is invalid",
            }),
        password: z.string().min(1, {
            message: "Password is required",
        }),
    }),
);

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: "",
        password: "",
    },
});

// CHANGE: Made the form to use try catch to handle errors especially unexpected ones
const submitForm = handleSubmit(async (values) => {
    try {
        toggleLoading();

        const { error } = await authStore.signInWithPassword(values);

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
            <h1 class="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p class="text-sm text-gray-400">Enter your credentials below to proceed.</p>
        </div>

        <FormField name="email" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="email">Email Address</FormLabel>

                <FormControl>
                    <Input type="email" placeholder="Email Address" name="email" :disabled="isLoading" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="password" v-slot="{ componentField }">
            <FormItem>
                <div class="flex justify-between">
                    <FormLabel for="password">Password</FormLabel>
                    <RouterLink to="/forgot-password" class="text-sm text-blue-500 hover:underline">Forgot Password?</RouterLink>
                </div>
                <FormControl>
                    <Input type="password" placeholder="Password" name="password" :disabled="isLoading" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit" id="sign-in" name="sign-in" :disabled="isLoading">
            <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
            Sign In
        </Button>

        <!-- CHANGE: Added a link to the register page -->
        <div class="flex gap-1">
            <p class="text-sm text-gray-400">Don't have an account?</p>
            <RouterLink to="/register" class="text-sm text-blue-500 hover:underline"> Register Now </RouterLink>
        </div>
    </form>
</template>
