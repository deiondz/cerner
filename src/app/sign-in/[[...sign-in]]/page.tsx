import { SignIn } from "@clerk/nextjs";
import MaxWidthWrapper from "~/components/max-width-wrapper";

export default function Page() {
  return (
    <MaxWidthWrapper className="flex h-screen w-full items-center justify-center">
      <SignIn />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
    </MaxWidthWrapper>
  );
}
