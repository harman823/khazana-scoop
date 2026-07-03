import { AuthForm } from "@/components/auth-form";
import { PageChrome } from "@/components/page-chrome";

export default function SignupPage(): React.ReactElement {
  return (
    <PageChrome
      title="Create your account"
      subtitle="Save your scoops, track rewards, and keep every packing reveal in one place."
    >
      <AuthForm mode="signup" />
    </PageChrome>
  );
}
