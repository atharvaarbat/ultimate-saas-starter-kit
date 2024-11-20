"use server";
import { LoginFormSchema, SignupFormSchema } from "@/server/action/zod";
import { createSession, deleteSession, getSession } from "@/lib/statelessSession";
import { createUser, getUserByEmail, getUserById, verifyPassword } from "./user";
import { toast } from "sonner";
import { redirect } from "next/navigation";

// export async function signup(state: any, formData: FormData) {
//   // 1. Validate form fields
//   console.log(formData);
//   const validateResult = SignupFormSchema.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });
//   if (!validateResult.success)
//     return {
//       errors: validateResult.error.flatten().fieldErrors,
//     };

//   const { name, email, password } = validateResult.data;
//   // 2. Create user
//   const newUser = await createUser({ name, email, password });
//   // 3. Create session
//   await createSession(newUser._id);
// }
export async function signup(state: any, formData: FormData) {
  // console.log(formData);
  // 1. Validate form fields
  const validateResult = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  

  // If validation fails, return errors
  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
      message: null,
    };
  }
  console.log(formData);
  const { name, email, password } = validateResult.data;

  try {
    // 2. Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      
      // return {
      //   errors: null,
      //   message: 'A user with this email already exists',
      // };
      throw new Error('User with this email already exists');
    }

    // 3. Create user
    const newUser = await createUser({
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    // 4. Create session
    await createSession(newUser._id);
  } catch (error) {
    // Handle any unexpected errors
    console.error('Signup error:', error);
    return {
      errors: null,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
export async function login(state: any, formData: FormData) {
  // 1. Validate form fields
  const validateResult = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If validation fails, return errors
  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
      message: null,
    };
  }

  const { email, password } = validateResult.data;

  try {
    // 2. Verify user credentials
    const user = await verifyPassword(email, password);

    // Check if user exists and password is correct
    if (!user) {
      return {
        errors: null,
        message: "Invalid email or password",
      };
    }
    console.log(user);

    // 3. Create session and redirect
    await createSession(user._id);
    // redirect('/dashboard');
  } catch (error) {
    // Handle any unexpected errors
    console.error("Login error:", error);
    return {
      errors: null,
      message: "An unexpected error occurred. Please try again.",
    };
  } finally {
    redirect("/dashboard");
  }
}


export async function getCuurentUser() {
  try {
    const session = await getSession();
    if (!session) return null;
    const user = await getUserById(session);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}

export async function logout() {
  try {
   
    await deleteSession();
    // redirect('/dashboard');
  } catch (error) {
    // Handle any unexpected errors
    console.error("Logout error:", error);
    return {
      errors: null,
      message: "An unexpected error occurred. Please try again.",
    };
  } finally {
    redirect("/login");
  }
}
