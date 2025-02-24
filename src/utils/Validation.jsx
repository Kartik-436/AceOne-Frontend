import * as yup from "yup";

// Signup Validation Schema
export const signupSchema = yup.object().shape({
    fullName: yup.string().min(3, "Full Name must be at least 3 characters").max(50, "Full Name is too long").required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "At least one uppercase letter required")
        .matches(/[a-z]/, "At least one lowercase letter required")
        .matches(/[0-9]/, "At least one number required")
        .matches(/[@$!%*?&]/, "At least one special character required")
        .required("Password is required"),
    contact: yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit mobile number").required("Mobile number is required"),
    dateOfBirth: yup.date().required("Date of Birth is required")
});

// Login Validation Schema
export const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "At least one uppercase letter required")
        .matches(/[a-z]/, "At least one lowercase letter required")
        .matches(/[0-9]/, "At least one number required")
        .matches(/[@$!%*?&]/, "At least one special character required")
        .required("Password is required"),
});
