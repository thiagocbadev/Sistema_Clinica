import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Bell, 
  Palette, 
  Database,
  Download,
  Upload
} from 'lucide-react';

const Configuracoes = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="border-b border-border pb-3">
        <h1 className="text-lg font-semibold text-foreground">Configurações</h1>
      </div>

      {/* Clinic Info */}
      <div className="bg-card border border-border p-4">
        <div className="mb-4 border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">Informações da Clínica</h2>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Nome da Clínica</Label>
              <Input placeholder="Digite o nome da clínica" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">CNPJ</Label>
              <Input placeholder="00.000.000/0001-00" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Endereço</Label>
            <Input placeholder="Rua, número, bairro, cidade - UF" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input placeholder="(00) 0000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email</Label>
              <Input type="email" placeholder="contato@clinica.com.br" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border p-4">
        <div className="mb-4 border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">Notificações</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Lembrete de consultas</p>
              <p className="text-sm text-muted-foreground">Enviar SMS para pacientes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Confirmação automática</p>
              <p className="text-sm text-muted-foreground">Solicitar confirmação 24h antes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Relatórios semanais</p>
              <p className="text-sm text-muted-foreground">Receber resumo por email</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border p-4">
        <div className="mb-4 border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">Aparência</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Modo escuro</p>
              <p className="text-sm text-muted-foreground">Alterar tema da interface</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sidebar compacta</p>
              <p className="text-sm text-muted-foreground">Manter menu lateral recolhido</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card border border-border p-4">
        <div className="mb-4 border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">Dados</h2>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="outline" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Importar Dados
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-3 border-t border-border">
        <Button size="sm" className="h-8">
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;
