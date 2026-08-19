import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cleanFilters,
  hasActiveFilters,
  type PropertyFilters as Filters,
} from "@/features/properties/filters";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  type PropertyType,
  type TransactionType,
} from "@/types/property";

const ANY = "__any__";

interface Props {
  filters: Filters;
  cities: string[];
  /** compact = versão do hero na home (apenas filtros principais). */
  variant?: "full" | "compact";
}

export function PropertyFilters({ filters, cities, variant = "full" }: Props) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Filters>(filters);

  useEffect(() => setDraft(filters), [filters]);

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const numberValue = (value: number | undefined) => (value === undefined ? "" : String(value));
  const parseNumber = (value: string): number | undefined =>
    value.trim() === "" ? undefined : Number(value);

  const submit = () => {
    void navigate({ to: "/imoveis", search: cleanFilters({ ...draft, pagina: undefined }) });
  };

  const clear = () => {
    setDraft({});
    void navigate({ to: "/imoveis", search: {} });
  };

  const compact = variant === "compact";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="finalidade">Finalidade</Label>
          <Select
            value={draft.finalidade ?? ANY}
            onValueChange={(value) =>
              update("finalidade", value === ANY ? undefined : (value as TransactionType))
            }
          >
            <SelectTrigger id="finalidade">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Todas</SelectItem>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {TRANSACTION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tipo">Tipo de imóvel</Label>
          <Select
            value={draft.tipo ?? ANY}
            onValueChange={(value) =>
              update("tipo", value === ANY ? undefined : (value as PropertyType))
            }
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Todos</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {PROPERTY_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cidade">Cidade</Label>
          <Select
            value={draft.cidade ?? ANY}
            onValueChange={(value) => update("cidade", value === ANY ? undefined : value)}
          >
            <SelectTrigger id="cidade">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Todas</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="precoMin">Preço mín.</Label>
            <Input
              id="precoMin"
              inputMode="numeric"
              placeholder="0"
              value={numberValue(draft.precoMin)}
              onChange={(event) => update("precoMin", parseNumber(event.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="precoMax">Preço máx.</Label>
            <Input
              id="precoMax"
              inputMode="numeric"
              placeholder="Sem limite"
              value={numberValue(draft.precoMax)}
              onChange={(event) => update("precoMax", parseNumber(event.target.value))}
            />
          </div>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={draft.bairro ?? ""}
                placeholder="Ex.: Centro"
                onChange={(event) => update("bairro", event.target.value || undefined)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="quartos">Quartos</Label>
                <Input
                  id="quartos"
                  inputMode="numeric"
                  placeholder="Mín."
                  value={numberValue(draft.quartos)}
                  onChange={(event) => update("quartos", parseNumber(event.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input
                  id="banheiros"
                  inputMode="numeric"
                  placeholder="Mín."
                  value={numberValue(draft.banheiros)}
                  onChange={(event) => update("banheiros", parseNumber(event.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="suites">Suítes</Label>
                <Input
                  id="suites"
                  inputMode="numeric"
                  placeholder="Mín."
                  value={numberValue(draft.suites)}
                  onChange={(event) => update("suites", parseNumber(event.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vagas">Vagas</Label>
                <Input
                  id="vagas"
                  inputMode="numeric"
                  placeholder="Mín."
                  value={numberValue(draft.vagas)}
                  onChange={(event) => update("vagas", parseNumber(event.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="areaMin">Área mín. (m²)</Label>
                <Input
                  id="areaMin"
                  inputMode="numeric"
                  value={numberValue(draft.areaMin)}
                  onChange={(event) => update("areaMin", parseNumber(event.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="areaMax">Área máx. (m²)</Label>
                <Input
                  id="areaMax"
                  inputMode="numeric"
                  value={numberValue(draft.areaMax)}
                  onChange={(event) => update("areaMax", parseNumber(event.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="busca">Busca livre</Label>
            <Input
              id="busca"
              placeholder="Título, bairro ou código do imóvel"
              value={draft.busca ?? ""}
              onChange={(event) => update("busca", event.target.value || undefined)}
            />
          </div>
        </>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="sm:w-48">
          <Search className="mr-2 h-4 w-4" aria-hidden />
          Buscar imóveis
        </Button>
        {hasActiveFilters(draft) ? (
          <Button type="button" variant="ghost" onClick={clear}>
            <X className="mr-2 h-4 w-4" aria-hidden />
            Limpar filtros
          </Button>
        ) : null}
      </div>
    </form>
  );
}
