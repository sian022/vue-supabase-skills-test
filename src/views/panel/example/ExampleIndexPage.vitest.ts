import ExampleIndexPage from "./ExampleIndexPage.vue";

import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("Vitest - 'ExampleIndexPage' component", () => {
    test("renders the page title correctly", () => {
        const wrapper = mount(ExampleIndexPage);

        // Check if the main heading exists with correct text
        const heading = wrapper.find("h1");
        expect(heading.exists()).toBe(true);
        expect(heading.text()).toBe("Example Page");
        expect(heading.classes()).toContain("text-2xl");
        expect(heading.classes()).toContain("font-semibold");
    });

    test("renders the subtitle paragraph", () => {
        const wrapper = mount(ExampleIndexPage);

        // Check for subtitle paragraph
        const subtitle = wrapper.find("p");
        expect(subtitle.exists()).toBe(true);
        expect(subtitle.text()).toBe("Lorem ipsum dolor sit amet.");
        expect(subtitle.classes()).toContain("text-sm");
        expect(subtitle.classes()).toContain("text-gray-400");
    });
});
