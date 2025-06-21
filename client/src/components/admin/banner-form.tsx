import { useState } from "react";
import { Banner, InsertBanner } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface BannerFormProps {
  banner?: Banner;
  onSubmit: (data: InsertBanner) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BannerForm({ banner, onSubmit, onCancel, isLoading }: BannerFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertBanner>({
    title: banner?.title || "",
    image: banner?.image || "",
    link: banner?.link || "",
    order: banner?.order || 0,
    isActive: banner?.isActive ?? true,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao fazer upload da imagem",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      toast({
        title: "Erro",
        description: "Título e imagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar banner",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título do Banner</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Promoção de Natal"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagem do Banner</Label>
        {formData.image ? (
          <div className="relative">
            <img
              src={formData.image}
              alt={formData.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setFormData({ ...formData, image: "" })}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste a imagem
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Tamanho recomendado: 1200x400px (máx. 5MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (opcional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link || ""}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://exemplo.com/promocao"
        />
        <p className="text-xs text-gray-500">
          Se preenchido, o banner será clicável
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Ordem de Exibição</Label>
        <Input
          id="order"
          type="number"
          min="0"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
        />
        <p className="text-xs text-gray-500">
          Banners com menor número aparecem primeiro
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Banner ativo
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading || uploading} className="flex-1">
          {isLoading || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploading ? "Fazendo upload..." : "Salvando..."}
            </>
          ) : (
            banner ? "Atualizar Banner" : "Criar Banner"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || uploading}>
          Cancelar
        </Button>
      </div>
    </motion.form>
  );
} 