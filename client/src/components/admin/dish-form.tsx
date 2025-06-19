import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Country, Dish, insertDishSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const dishFormSchema = insertDishSchema.extend({
  tags: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
});

interface DishFormProps {
  dish: Dish | null;
  countries: Country[];
  onCancel: () => void;
  onSuccess: () => void;
}

const categories = [
  { value: "salgados", label: "Salgados" },
  { value: "doces", label: "Doces" },
  { value: "bebidas", label: "Bebidas" },
];

const availableTags = [
  "vegetariano", "vegano", "picante", "sem glúten", "sem lactose", "low carb"
];

const availableAllergens = [
  "glúten", "lactose", "ovos", "amendoim", "castanhas", "soja", "peixes", "crustáceos"
];

export default function DishForm({ dish, countries, onCancel, onSuccess }: DishFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof dishFormSchema>>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: dish?.name || "",
      description: dish?.description || "",
      price: dish?.price || "0.00",
      image: dish?.image || "",
      countryId: dish?.countryId || 0,
      category: dish?.category || "salgados",
      tags: dish?.tags || [],
      allergens: dish?.allergens || [],
      isFeatured: dish?.isFeatured || false,
      isAvailable: dish?.isAvailable ?? true,
      order: dish?.order || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof dishFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (dish) {
        await apiRequest("PUT", `/api/dishes/${dish.id}`, values);
        toast({ title: "Prato atualizado com sucesso!" });
      } else {
        await apiRequest("POST", "/api/dishes", values);
        toast({ title: "Prato criado com sucesso!" });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o prato. Tente novamente.",
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
                <FormLabel>Nome do Prato</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do prato" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição detalhada do prato" 
                  className="min-h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um país" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.flagEmoji} {country.name}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, tag]);
                          } else {
                            field.onChange(field.value.filter((t) => t !== tag));
                          }
                        }}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alérgenos</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {availableAllergens.map((allergen) => (
                    <label key={allergen} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value.includes(allergen)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, allergen]);
                          } else {
                            field.onChange(field.value.filter((a) => a !== allergen));
                          }
                        }}
                      />
                      <span className="text-sm">{allergen}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Prato em destaque</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Disponível</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-fenui-green hover:bg-fenui-green/90"
          >
            {isSubmitting ? "Salvando..." : dish ? "Atualizar" : "Criar"} Prato
          </Button>
        </div>
      </form>
    </Form>
  );
}
