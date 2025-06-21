import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, XCircle, Upload, FileText, Database } from "lucide-react";

interface UploadResult {
  message: string;
  sucessos: number;
  erros: number;
  total: number;
  detalhesErros: Array<{ prato: string; erro: string }>;
}

export function UploadPratos() {
  const [jsonData, setJsonData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exemploJson = `[
  {
    "name": "Pizza Margherita",
    "description": "Pizza tradicional italiana com molho de tomate, mussarela de búfala, manjericão fresco e azeite extra virgem",
    "price": "45.00",
    "image": null,
    "countryId": 60,
    "category": "salgados",
    "tags": ["vegetariano", "tradicional"],
    "allergens": ["glúten", "lactose"],
    "rating": "4.80",
    "reviewCount": 23,
    "isFeatured": true,
    "isAvailable": true,
    "order": 1
  }
]`;

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      setError("Por favor, insira os dados JSON dos pratos");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validar JSON antes de enviar
      const parsedData = JSON.parse(jsonData);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Os dados devem ser um array de pratos");
      }

      const response = await fetch("/api/dishes/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro no upload");
      }

      setResult(data);
      if (data.sucessos > 0) {
        setJsonData(""); // Limpar após sucesso
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const preencherExemplo = () => {
    setJsonData(exemploJson);
    setError(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload em Lote de Pratos
          </CardTitle>
          <CardDescription>
            Faça upload de múltiplos pratos de uma vez usando JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de texto para JSON */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Dados JSON dos Pratos:
            </label>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Cole aqui o JSON com os dados dos pratos..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button 
              onClick={handleUpload} 
              disabled={isLoading}
              className="bg-fenui-red-600 hover:bg-fenui-red-700"
            >
              {isLoading ? (
                <>
                  <Database className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={preencherExemplo}
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Exemplo
            </Button>
          </div>

          {/* Resultado do upload */}
          {result && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-green-800">{result.message}</p>
                  <div className="text-sm text-green-700">
                    <p>✅ Sucessos: {result.sucessos}</p>
                    <p>❌ Erros: {result.erros}</p>
                    <p>📊 Total: {result.total}</p>
                  </div>
                  {result.detalhesErros.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-red-600 mb-1">Erros encontrados:</p>
                      <ul className="text-sm text-red-600 space-y-1">
                        {result.detalhesErros.map((erro, index) => (
                          <li key={index}>• {erro.prato}: {erro.erro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Erro */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Card de instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Como Usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h4 className="font-semibold mb-2">🏳️ IDs dos Países:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p><strong>49</strong> - 🇨🇭 Suíça</p>
                <p><strong>50</strong> - 🇩🇪 Alemanha</p>
                <p><strong>51</strong> - 🇯🇵 Japão</p>
                <p><strong>52</strong> - 🇿🇦 África do Sul</p>
                <p><strong>54</strong> - 🇷🇺 Rússia</p>
                <p><strong>55</strong> - 🇨🇳 China</p>
                <p><strong>56</strong> - 🇪🇸 Espanha</p>
                <p><strong>57</strong> - 🇺🇸 Estados Unidos</p>
                <p><strong>58</strong> - 🇸🇾 Síria</p>
                <p><strong>59</strong> - 🇫🇷 França</p>
                <p><strong>60</strong> - 🇮🇹 Itália</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📂 Categorias:</h4>
              <div className="text-sm bg-gray-50 p-3 rounded">
                <p><code>"salgados"</code> - Pratos salgados</p>
                <p><code>"doces"</code> - Sobremesas e doces</p>
                <p><code>"bebidas"</code> - Drinks e bebidas</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✅ Campos Obrigatórios:</h4>
              <div className="text-sm bg-gray-50 p-3 rounded">
                <p><code>name</code> - Nome do prato</p>
                <p><code>description</code> - Descrição detalhada</p>
                <p><code>price</code> - Preço (string, ex: "25.50")</p>
                <p><code>countryId</code> - ID do país</p>
                <p><code>category</code> - Categoria do prato</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 