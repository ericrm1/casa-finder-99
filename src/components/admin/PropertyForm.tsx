import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  propertyFormSchema,
  type PropertyFormInput,
  type PropertyFormValues,
} from "@/features/properties/schema";
import {
  PROPERTY_STATUSES,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  hasRooms,
  type Property,
} from "@/types/property";

interface Props {
  property?: Property;
  submitLabel: string;
  onSubmit: (values: PropertyFormValues) => void;
  isSubmitting?: boolean;
}

function defaultsFrom(property?: Property): PropertyFormInput {
  return {
    title: property?.title ?? "",
    description: property?.description ?? "",
    propertyType: property?.propertyType ?? "HOUSE",
    transactionType: property?.transactionType ?? "SALE",
    status: property?.status ?? "DRAFT",
    price: property?.price ?? 0,
    city: property?.city ?? "",
    neighborhood: property?.neighborhood ?? "",
    address: property?.address ?? "",
    showAddress: property?.showAddress ?? false,
    zipCode: property?.zipCode ?? "",
    landArea: property?.landArea ?? "",
    builtArea: property?.builtArea ?? "",
    bedrooms: property?.bedrooms ?? "",
    bathrooms: property?.bathrooms ?? "",
    suites: property?.suites ?? "",
    parkingSpaces: property?.parkingSpaces ?? "",
  };
}

export function PropertyForm({ property, submitLabel, onSubmit, isSubmitting }: Props) {
  const form = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema) as never,
    defaultValues: defaultsFrom(property),
  });

  const propertyType = form.watch("propertyType");
  const showRooms = hasRooms(propertyType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((raw) => onSubmit(propertyFormSchema.parse(raw)))} className="space-y-8">
        <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Informações principais</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Casa com 3 quartos no centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Descreva o imóvel..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {PROPERTY_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finalidade</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {TRANSACTION_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {PROPERTY_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Somente imóveis publicados aparecem no site.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Localização</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="showAddress"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">
                  Exibir o endereço completo no site público
                </FormLabel>
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Características</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="landArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área do terreno (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="builtArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área construída (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parkingSpaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagas de garagem</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {showRooms ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suítes</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}
        </section>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
