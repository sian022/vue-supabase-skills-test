<script setup lang="ts">
import { Button } from "@/components/base/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { Loader } from "lucide-vue-next";

import { useRegister } from "@/composables";

const { isLoading, submitForm } = useRegister();
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
