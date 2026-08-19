import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { propertyInterestMessage, whatsappLink } from "@/lib/agency";

export function ContactButton({
  publicCode,
  className,
}: {
  publicCode: string;
  className?: string;
}) {
  return (
    <Button asChild size="lg" className={className}>
      <a
        href={whatsappLink(propertyInterestMessage(publicCode))}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
        Tenho interesse
      </a>
    </Button>
  );
}
