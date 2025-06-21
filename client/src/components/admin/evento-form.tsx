import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCountries } from "@/hooks/use-countries";
import { Trash2, Edit, Plus, Star, Calendar, Clock, MapPin, Music, Mic, Eye, EyeOff, Users, Trophy, Sparkles } from "lucide-react";
import type { Evento, InsertEvento, Country, EventoWithCountry } from "@shared/schema";
import { FENUI_COLORS } from "@/lib/theme-colors";
import { motion, AnimatePresence } from "framer-motion";

const eventoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dia: z.string().min(1, "Data é obrigatória"),
  horario_inicio: z.string().min(1, "Horário de início é obrigatório"),
  horario_fim: z.string().min(1, "Horário de fim é obrigatório"),
  local: z.string().min(1, "Local é obrigatório"),
  imagem_url: z.string().optional(),
  countryId: z.number().optional(),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

type EventoFormData = z.infer<typeof eventoSchema>;

export default function EventoForm() {
  const [eventos, setEventos] = useState<EventoWithCountry[]>([]);
  const [editingEvento, setEditingEvento] = useState<EventoWithCountry | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { data: countries = [] } = useCountries();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      isFeatured: false,
      isActive: true,
      order: 0,
    },
  });

  const watchedValues = watch();

  // Buscar eventos
  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      if (!response.ok) throw new Error("Failed to fetch eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os eventos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Preencher formulário ao editar
  useEffect(() => {
    if (editingEvento) {
      setValue("titulo", editingEvento.titulo);
      setValue("descricao", editingEvento.descricao);
      setValue("dia", editingEvento.dia);
      setValue("horario_inicio", editingEvento.horario_inicio);
      setValue("horario_fim", editingEvento.horario_fim);
      setValue("local", editingEvento.local);
      setValue("imagem_url", editingEvento.imagem_url || "");
      setValue("countryId", editingEvento.countryId || undefined);
      setValue("isFeatured", editingEvento.isFeatured);
      setValue("order", editingEvento.order);
      setValue("isActive", editingEvento.isActive);
    }
  }, [editingEvento, setValue]);

  const onSubmit = async (data: EventoFormData) => {
    setIsLoading(true);
    try {
      const isEditing = editingEvento && editingEvento.id > 0;
      const url = isEditing ? `/api/eventos/${editingEvento.id}` : "/api/eventos";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save evento");

      toast({
        title: isEditing ? "✅ Evento atualizado!" : "✅ Evento criado!",
        description: isEditing 
          ? "As alterações foram salvas com sucesso" 
          : "O novo evento foi adicionado à programação",
      });

      reset();
      setEditingEvento(null);
      fetchEventos();
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível salvar o evento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const response = await fetch(`/api/eventos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete evento");

      toast({
        title: "✅ Evento excluído",
        description: "O evento foi removido da programação",
      });
      fetchEventos();
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir o evento",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (evento: EventoWithCountry) => {
    try {
      const response = await fetch(`/api/eventos/${evento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...evento, isActive: !evento.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update evento");

      toast({
        title: `✅ Evento ${!evento.isActive ? 'ativado' : 'desativado'}!`,
        description: !evento.isActive ? "Agora aparece na programação" : "Removido da programação pública",
      });
      fetchEventos();
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível alterar o status do evento",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (evento: EventoWithCountry) => {
    try {
      const response = await fetch(`/api/eventos/${evento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...evento, isFeatured: !evento.isFeatured }),
      });

      if (!response.ok) throw new Error("Failed to update evento");

      toast({
        title: `${!evento.isFeatured ? '⭐' : '📝'} Evento ${!evento.isFeatured ? 'promovido a destaque' : 'removido do destaque'}!`,
        description: !evento.isFeatured ? "Agora aparece em destaque na programação" : "Voltou ao status normal",
      });
      fetchEventos();
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível alterar o destaque do evento",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    reset();
    setEditingEvento(null);
  };

  const formatarHorario = (horario: string) => horario.slice(0, 5);
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Organizar eventos por dia
  const eventosPorDia = eventos.reduce((acc, evento) => {
    if (!acc[evento.dia]) acc[evento.dia] = [];
    acc[evento.dia].push(evento);
    return acc;
  }, {} as Record<string, EventoWithCountry[]>);

  // Filtrar eventos baseado no dia selecionado
  const eventosFiltrados = selectedDay === "all" 
    ? eventos 
    : eventos.filter(evento => evento.dia === selectedDay);

  // Estatísticas
  const stats = {
    total: eventos.length,
    ativos: eventos.filter(e => e.isActive).length,
    destaque: eventos.filter(e => e.isFeatured).length,
    diasUnicos: new Set(eventos.map(e => e.dia)).size,
  };

  // Dias únicos para o filtro
  const diasUnicos = Array.from(new Set(eventos.map(e => e.dia))).sort();

  // Se estiver editando/criando
  if (editingEvento !== null) {
  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  {editingEvento && editingEvento.id > 0 ? (
                    <>
                      <Edit className="h-6 w-6" />
                      Editando: {editingEvento.titulo}
                    </>
                  ) : (
                    <>
                      <Plus className="h-6 w-6" />
                      Novo Evento na Programação
                    </>
                  )}
                </CardTitle>
                <p className="text-indigo-100 text-sm mt-1">
                  {editingEvento && editingEvento.id > 0 ? 'Faça as alterações necessárias' : 'Preencha os dados do novo evento'}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="titulo" className="text-base font-semibold text-gray-700">Título do Evento *</Label>
                <Input
                  id="titulo"
                  {...register("titulo")}
                    placeholder="Ex: Show da Banda Alemã, Apresentação Cultural Japonesa..."
                    className="mt-1 h-12 text-base"
                />
                {errors.titulo && (
                  <p className="text-sm text-red-500 mt-1">{errors.titulo.message}</p>
                )}
              </div>

                <div className="md:col-span-2">
                  <Label htmlFor="descricao" className="text-base font-semibold text-gray-700">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    {...register("descricao")}
                    placeholder="Descreva o evento, atrações, detalhes importantes..."
                    className="mt-1 min-h-[100px] text-base"
                  />
                  {errors.descricao && (
                    <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>
                )}
              </div>

              <div>
                  <Label htmlFor="dia" className="text-base font-semibold text-gray-700">Data do Evento *</Label>
                <Input
                  id="dia"
                  type="date"
                  {...register("dia")}
                    className="mt-1 h-12 text-base"
                />
                {errors.dia && (
                  <p className="text-sm text-red-500 mt-1">{errors.dia.message}</p>
                )}
              </div>

              <div>
                  <Label htmlFor="local" className="text-base font-semibold text-gray-700">Local *</Label>
                  <Input
                    id="local"
                    {...register("local")}
                    placeholder="Palco Principal, Espaço Viber, Praça Central..."
                    className="mt-1 h-12 text-base"
                  />
                  {errors.local && (
                    <p className="text-sm text-red-500 mt-1">{errors.local.message}</p>
                  )}
              </div>

              <div>
                  <Label htmlFor="horario_inicio" className="text-base font-semibold text-gray-700">Horário de Início *</Label>
                <Input
                  id="horario_inicio"
                  type="time"
                  {...register("horario_inicio")}
                    className="mt-1 h-12 text-base"
                />
                {errors.horario_inicio && (
                  <p className="text-sm text-red-500 mt-1">{errors.horario_inicio.message}</p>
                )}
              </div>

              <div>
                  <Label htmlFor="horario_fim" className="text-base font-semibold text-gray-700">Horário de Término *</Label>
                <Input
                  id="horario_fim"
                  type="time"
                  {...register("horario_fim")}
                    className="mt-1 h-12 text-base"
                />
                {errors.horario_fim && (
                  <p className="text-sm text-red-500 mt-1">{errors.horario_fim.message}</p>
                )}
            </div>

            <div>
                  <Label className="text-base font-semibold text-gray-700">País/Cultura (Opcional)</Label>
                  <Select 
                    value={watchedValues.countryId?.toString() || ""} 
                    onValueChange={(value) => setValue("countryId", value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger className="mt-1 h-12 text-base">
                      <SelectValue placeholder="Selecione um país (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum país específico</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.flagEmoji} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>

            <div>
                  <Label htmlFor="imagem_url" className="text-base font-semibold text-gray-700">URL da Imagem (Opcional)</Label>
              <Input
                id="imagem_url"
                {...register("imagem_url")}
                placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1 h-12 text-base"
              />
            </div>
              </div>

              {/* Configurações avançadas */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Configurações Especiais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div>
                      <Label className="text-base font-semibold text-gray-700">Evento em Destaque</Label>
                      <p className="text-sm text-gray-600">Aparece com destaque especial</p>
                    </div>
                <Switch
                      checked={watchedValues.isFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
              </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div>
                      <Label className="text-base font-semibold text-gray-700">Evento Ativo</Label>
                      <p className="text-sm text-gray-600">Visível na programação pública</p>
                    </div>
                <Switch
                      checked={watchedValues.isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <Label htmlFor="order" className="text-base font-semibold text-gray-700">Ordem de Exibição</Label>
                    <Input
                      id="order"
                      type="number"
                      {...register("order", { valueAsNumber: true })}
                      placeholder="0"
                      className="mt-2 h-10"
                    />
                    <p className="text-xs text-gray-600 mt-1">Menor número = aparece primeiro</p>
                  </div>
                </div>
            </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 text-base font-semibold shadow-lg"
                  style={{ backgroundColor: FENUI_COLORS.primaryRed }}
                >
                  {isLoading ? "Salvando..." : (editingEvento && editingEvento.id > 0) ? "💾 Salvar Alterações" : "✨ Criar Evento"}
              </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-8 h-12 text-base"
                >
                  Cancelar
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header com estatísticas MODERNO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{stats.total}</div>
                <p className="text-indigo-100 font-medium">Total de Eventos</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{stats.ativos}</div>
                <p className="text-green-100 font-medium">Eventos Ativos</p>
              </div>
              <Eye className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{stats.destaque}</div>
                <p className="text-yellow-100 font-medium">Em Destaque</p>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{stats.diasUnicos}</div>
                <p className="text-pink-100 font-medium">Dias de Evento</p>
              </div>
              <Clock className="h-8 w-8 text-pink-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>
      </motion.div>

      {/* Controles e filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Filtrar por Dia</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📅 Todos os Dias</SelectItem>
                      {diasUnicos.map((dia) => (
                        <SelectItem key={dia} value={dia}>
                          📆 {formatarData(dia)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={() => setEditingEvento({
                  id: 0,
                  titulo: "",
                  descricao: "",
                  dia: "",
                  horario_inicio: "",
                  horario_fim: "",
                  local: "",
                  imagem_url: null,
                  countryId: null,
                  isFeatured: false,
                  order: 0,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                } as EventoWithCountry)}
                className="px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: FENUI_COLORS.primaryRed }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Evento
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de eventos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {eventosFiltrados.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedDay === "all" 
                  ? "Comece criando o primeiro evento da programação" 
                  : "Não há eventos cadastrados para este dia"}
              </p>
                             <Button 
                 onClick={() => setEditingEvento({
                   id: 0,
                   titulo: "",
                   descricao: "",
                   dia: "",
                   horario_inicio: "",
                   horario_fim: "",
                   local: "",
                   imagem_url: null,
                   countryId: null,
                   isFeatured: false,
                   order: 0,
                   isActive: true,
                   createdAt: new Date(),
                   updatedAt: new Date()
                 } as EventoWithCountry)}
                 className="px-8 py-3 font-semibold shadow-lg"
                 style={{ backgroundColor: FENUI_COLORS.primaryRed }}
               >
                 <Plus className="h-5 w-5 mr-2" />
                 Criar Primeiro Evento
               </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {eventosFiltrados
                .sort((a, b) => {
                  if (a.dia !== b.dia) return a.dia.localeCompare(b.dia);
                  return a.horario_inicio.localeCompare(b.horario_inicio);
                })
                .map((evento, index) => (
                  <motion.div
                            key={evento.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white ${
                              evento.isFeatured 
                        ? "ring-2 ring-yellow-400 shadow-xl shadow-yellow-500/20" 
                        : "shadow-lg"
                    }`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Imagem/Visual */}
                          <div className="md:w-48 h-48 md:h-auto relative bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            {evento.imagem_url ? (
                              <img
                                src={evento.imagem_url}
                                alt={evento.titulo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-white">
                                <Music className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm font-semibold">Evento Cultural</p>
                              </div>
                            )}
                            
                            {/* Badges flutuantes */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                  {evento.isFeatured && (
                                <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                                  <Star className="h-3 w-3 mr-1" />
                                      Destaque
                                    </Badge>
                                  )}
                                  {!evento.isActive && (
                                <Badge variant="destructive" className="shadow-lg">
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inativo
                                </Badge>
                                  )}
                                </div>

                            {/* País */}
                                    {evento.country && (
                              <div className="absolute bottom-3 left-3">
                                <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                  <span className="text-lg">{evento.country.flagEmoji}</span>
                                  <span className="text-xs font-semibold text-gray-700">{evento.country.name}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                  <Mic className="h-5 w-5 text-indigo-600" />
                                  {evento.titulo}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                  {evento.descricao}
                                </p>
                              </div>
                            </div>

                            {/* Informações do evento */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm font-semibold">{formatarData(evento.dia)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm font-semibold">
                                  {formatarHorario(evento.horario_inicio)} - {formatarHorario(evento.horario_fim)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm font-semibold">{evento.local}</span>
                              </div>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEvento(evento)}
                                className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                              >
                                <Edit className="h-4 w-4 mr-1 text-blue-600" />
                                Editar
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleActive(evento)}
                                className={`transition-all ${
                                  evento.isActive 
                                    ? 'hover:bg-red-50 hover:border-red-300' 
                                    : 'hover:bg-green-50 hover:border-green-300'
                                }`}
                              >
                                {evento.isActive ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-1 text-red-600" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1 text-green-600" />
                                    Ativar
                                  </>
                                )}
                              </Button>
                              
                                <Button
                                  size="sm"
                                  variant="outline"
                                onClick={() => handleToggleFeatured(evento)}
                                className={`transition-all ${
                                  evento.isFeatured 
                                    ? 'hover:bg-gray-50 hover:border-gray-300' 
                                    : 'hover:bg-yellow-50 hover:border-yellow-300'
                                }`}
                              >
                                <Star className={`h-4 w-4 mr-1 ${evento.isFeatured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                                {evento.isFeatured ? 'Remover Destaque' : 'Destacar'}
                                </Button>
                              
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(evento.id)}
                                className="hover:bg-red-50 hover:border-red-300 transition-all"
                                >
                                <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                                Excluir
                                </Button>
                            </div>
                          </div>
                    </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
            </div>
          )}
      </motion.div>
    </div>
  );
} 