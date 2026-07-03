import { Mail, MessageCircle, PackageCheck } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";

export default function ContactPage(): React.ReactElement {
  return (
    <PageChrome
      title="Contact us"
      subtitle="Need help with an order, re-scoop window, packing video, or product question? Start here."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form className="app-card grid gap-4 p-6">
          <label className="text-sm font-bold">
            Name
            <input className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3" name="name" />
          </label>
          <label className="text-sm font-bold">
            Email
            <input className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3" name="email" type="email" />
          </label>
          <label className="text-sm font-bold">
            Message
            <textarea className="mt-2 min-h-32 w-full rounded-[7px] border border-[#d9cfd5] p-3" name="message" />
          </label>
          <button className="button-primary w-fit" type="button">Send message</button>
        </form>
        <aside className="grid gap-4">
          <ContactCard icon={<Mail size={20} />} title="Email" body="support@mysteryscoop.example" />
          <ContactCard icon={<PackageCheck size={20} />} title="Orders" body="Include your order number for faster support." />
          <ContactCard icon={<MessageCircle size={20} />} title="Response time" body="Most messages are reviewed within one business day." />
        </aside>
      </div>
    </PageChrome>
  );
}

function ContactCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }): React.ReactElement {
  return (
    <div className="app-card flex gap-3 p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] bg-[rgba(0,184,173,0.1)] text-[var(--teal)]">{icon}</span>
      <span>
        <strong className="block">{title}</strong>
        <span className="text-sm text-muted">{body}</span>
      </span>
    </div>
  );
}
