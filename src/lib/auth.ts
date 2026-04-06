import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../utils/prisma";
import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailVerification: {
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, token }) => {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Your Verification Code",
                html: `Your verification code is: <strong>${token}</strong>`,
            });
        },
    },
    
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,

        sendResetPassword: async ({ user, url }) => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: <a href="${url}">${url}</a>`,
      });
    },
  },
//   additional fields
    user: {
        additionalFields: {
            currentStreak: { type: "number" },
            lastActive: { type: "string" } 
        }
    },
   

socialProviders: {
    github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
     
    },
},


});