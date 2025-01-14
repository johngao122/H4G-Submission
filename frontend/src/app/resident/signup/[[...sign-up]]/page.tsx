import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md flex flex-col">
                <SignUp
                    fallbackRedirectUrl={"/resident/login"}
                    unsafeMetadata={{ signUpRoute: "resident" }}
                />
            </div>
        </div>
    );
}
