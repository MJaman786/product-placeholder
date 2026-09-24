import * as Yup from "yup";

/* =========================
   🔹 Validation Schema
========================= */

export const emailValidation = Yup.string()
    .transform((value) => value?.trim())
    .strict(true)
    .lowercase()
    .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Enter a valid email address (example: name@example.com)"
    )
    .max(100, "Email must not exceed 100 characters")
    .required("Email is required");

export const nameValidation = Yup.string()
    .transform((value) => value?.trim())
    .strict(true)
    .max(50, "Name must not exceed 50 characters")
    .matches(
        // /^[A-Za-z]+(?: [A-Za-z]+)*$/,
        // /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
        /^[A-Za-z0-9']+(?: [A-Za-z0-9']+)*$/,
        "Name must contain only letters with a single space between words"
    )
    .required("Name is required");

export const mobileValidation = Yup.string()
    .transform((value) => value?.trim())
    .strict(true)
    .matches(/^[1-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .required("Phone number is required");

export const dobValidation = Yup.string()
    .required("Date of birth is required")
    .test(
        "not-in-future",
        "Date of birth cannot be in the future",
        (value) => {
            if (!value) return false;
            return new Date(value) <= new Date();
        }
    )
