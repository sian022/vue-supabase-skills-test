import { useToast } from "@/components/base/toast/use-toast";

import { useLoading } from "@/composables";
import { delay } from "@/lib/utils";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

export const useForgotPassword = () => {
    const { toast } = useToast();
    const { isLoading, toggleLoading } = useLoading();

    const formSchema = toTypedSchema(
        z.object({
            email: z.string().min(1, "Email address is required").email("Email address is invalid"),
        }),
    );

    const { handleSubmit } = useForm({
        validationSchema: formSchema,
        initialValues: { email: "" },
    });

    const submitForm = handleSubmit(async () => {
        // Sample implementation
        toggleLoading();

        await delay(500);

        toast({ description: "Password reset link sent to your email" });
        toggleLoading();
    });

    return { submitForm, isLoading };
};
