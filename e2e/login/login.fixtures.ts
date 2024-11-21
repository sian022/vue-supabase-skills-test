import { generateUniqueEmail } from "../shared/utils";

export const loginFixtures = {
    validUser: {
        email: "admin@admin.com",
        password: "password",
    },
    invalidUser: {
        email: generateUniqueEmail(),
        password: "password",
    },
};
