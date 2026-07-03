import { AuthForm } from "@/components/auth-form";
import { PageChrome } from "@/components/page-chrome";

export default function LoginPage(): React.ReactElement {
  return (
    <PageChrome
      title="Log in"
      subtitle="Access your orders, packing videos, Scoop Points, and re-scoop approvals."
    >
      <AuthForm mode="login" />
    </PageChrome>
  );
}
