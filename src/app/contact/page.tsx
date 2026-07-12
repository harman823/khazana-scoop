import { Mail, MessageCircle, PackageCheck } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";

export default function ContactPage(): React.ReactElement {
  return (
    <PageChrome
      currentPath="/contact"
      heroAside={
        <div className="grid w-full max-w-[360px] gap-4">
          <div className="rounded-[28px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Customer care</p>
            <p className="mt-3 text-sm leading-7 text-[#5d746d]">
              Order help, product questions, packing videos, and re-scoop support all start from the same queue.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Reply window</p>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#35534d]">1 business day</p>
            </div>
            <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Best with</p>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#35534d]">Order ID</p>
            </div>
          </div>
        </div>
      }
      title="Contact us"
      subtitle="Need help with an order, re-scoop window, packing video, or product question? Start here."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Send a note</p>
          <div className="mt-6 grid gap-4">
          <label className="text-sm font-black uppercase tracking-[0.12em] text-[#667c76]">
            Name
            <input className="storefront-input mt-2" name="name" />
          </label>
          <label className="text-sm font-black uppercase tracking-[0.12em] text-[#667c76]">
            Email
            <input className="storefront-input mt-2" name="email" type="email" />
          </label>
          <label className="text-sm font-black uppercase tracking-[0.12em] text-[#667c76]">
            Message
            <textarea className="storefront-input mt-2 min-h-32 resize-none py-3" name="message" />
          </label>
          <button className="button-primary w-fit" type="button">Send message</button>
          </div>
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
    <div className="rounded-[28px] border border-[#ece3d9] bg-white p-5 shadow-[0_18px_48px_rgba(118,140,134,0.12)]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[rgba(24,165,158,0.1)] text-[var(--teal)]">{icon}</span>
      <span>
        <strong className="mt-4 block text-lg tracking-[-0.03em] text-[#35534d]">{title}</strong>
        <span className="mt-2 block text-sm leading-7 text-[#667b75]">{body}</span>
      </span>
    </div>
  );
}
