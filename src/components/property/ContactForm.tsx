import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLead } from "@/features/properties/mutations";
import { contactFormSchema, type ContactFormValues } from "@/features/properties/schema";

interface Props {
  propertyId?: string;
  publicCode?: string;
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export function ContactForm({ propertyId, publicCode }: Props) {
  const subject = publicCode ? `Interesse no imóvel ${publicCode}` : "Contato pelo site";
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    phone: "",
    message: publicCode ? `Olá! Tenho interesse no imóvel ${publicCode}.` : "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: (payload: ContactFormValues) =>
      createLead({
        propertyId: propertyId ?? null,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: `${subject}\n\n${payload.message}`,
      }),
    onSuccess: () => {
      toast.success("Mensagem enviada! Entraremos em contato em breve.");
      setValues({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    },
    onError: () => toast.error("Não foi possível enviar sua mensagem. Tente novamente."),
  });

  const set = (key: keyof ContactFormValues, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormValues;
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {publicCode ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{subject}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Nome</Label>
          <Input
            id="contact-name"
            value={values.name}
            maxLength={100}
            onChange={(event) => set("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone">Telefone</Label>
          <Input
            id="contact-phone"
            value={values.phone}
            maxLength={20}
            onChange={(event) => set("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">E-mail</Label>
        <Input
          id="contact-email"
          type="email"
          value={values.email}
          maxLength={255}
          onChange={(event) => set("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Mensagem</Label>
        <Textarea
          id="contact-message"
          rows={5}
          maxLength={1000}
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? <p className="text-sm text-destructive">{errors.message}</p> : null}
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
        {mutation.isPending ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
