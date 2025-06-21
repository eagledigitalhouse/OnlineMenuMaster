import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Country, insertCountrySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { z } from "zod";

interface CountryFormProps {
  country: Country | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CountryForm({ country, onCancel, onSuccess }: CountryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof insertCountrySchema>>({
    resolver: zodResolver(insertCountrySchema),
    defaultValues: {
      name: country?.name || "",
      flagEmoji: country?.flagEmoji || "",
      flagImage: country?.flagImage || "",
      order: country?.order || 0,
      isActive: country?.isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof insertCountrySchema>) => {
    setIsSubmitting(true);
    try {
      if (country) {
        await apiRequest("PUT", `/api/countries/${country.id}`, values);
        toast({ title: "País atualizado com sucesso!" });
      } else {
        await apiRequest("POST", "/api/countries", values);
        toast({ title: "País criado com sucesso!" });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/countries"] });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o país. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do País</FormLabel>
                <FormControl>
                  <Input placeholder="Brasil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flagEmoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji da Bandeira</FormLabel>
                <FormControl>
                  <Input placeholder="🇧🇷" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="flagImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Bandeira Circle Flags</FormLabel>
              <FormControl>
                <Input placeholder="https://hatscripts.github.io/circle-flags/flags/br.svg" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>País ativo</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-fenui-blue hover:bg-fenui-blue/90"
          >
            {isSubmitting ? "Salvando..." : country ? "Atualizar" : "Criar"} País
          </Button>
        </div>
      </form>
    </Form>
  );
}
