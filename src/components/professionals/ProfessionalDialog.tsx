
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Professional, WorkingHours } from "@/types/clinic";
import { useClinic } from "@/contexts/ClinicContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ProfessionalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    professionalToEdit?: Professional | null;
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DEFAULT_WORKING_HOURS: WorkingHours[] = [
    { dayOfWeek: 1, start: "08:00", end: "18:00" },
    { dayOfWeek: 2, start: "08:00", end: "18:00" },
    { dayOfWeek: 3, start: "08:00", end: "18:00" },
    { dayOfWeek: 4, start: "08:00", end: "18:00" },
    { dayOfWeek: 5, start: "08:00", end: "18:00" },
];

const COLORS = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316", // Orange
];

export function ProfessionalDialog({
    open,
    onOpenChange,
    professionalToEdit,
}: ProfessionalDialogProps) {
    const { addProfessional, updateProfessional } = useClinic();
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [color, setColor] = useState(COLORS[0]);
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>(DEFAULT_WORKING_HOURS);

    useEffect(() => {
        if (professionalToEdit) {
            setName(professionalToEdit.name);
            setSpecialty(professionalToEdit.specialty);
            setEmail(professionalToEdit.email);
            setPhone(professionalToEdit.phone);
            setColor(professionalToEdit.color);
            setWorkingHours(professionalToEdit.workingHours);
        } else {
            resetForm();
        }
    }, [professionalToEdit, open]);

    const resetForm = () => {
        setName("");
        setSpecialty("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        setWorkingHours(DEFAULT_WORKING_HOURS);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!professionalToEdit && (password !== confirmPassword)) {
            toast.error("As senhas não correspondem!");
            return;
        }

        if (!professionalToEdit && password.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres!");
            return;
        }

        const professionalData = {
            name,
            specialty,
            email,
            phone,
            color,
            ...(workingHours.length > 0 && { working_hours: workingHours }),
            ...(!professionalToEdit && { password }),
        };

        handleSubmitAsync(professionalData);
    };

    const handleSubmitAsync = async (professionalData: any) => {
        try {
            if (professionalToEdit) {
                await updateProfessional(professionalToEdit.id, professionalData);
                toast.success(`Profissional ${name} atualizado com sucesso!`);
            } else {
                // New professional - pass password for auth registration
                await addProfessional(professionalData);
                toast.success(`Profissional ${name} cadastrado! Credenciais enviadas por email.`);
            }

            onOpenChange(false);
            resetForm();
        } catch (error) {
            console.error("Erro ao salvar profissional:", error);
            toast.error("Erro ao salvar profissional. Tente novamente!");
        }
    };

    const toggleDay = (dayIndex: number) => {
        setWorkingHours((prev) => {
            const exists = prev.find((wh) => wh.dayOfWeek === dayIndex);
            if (exists) {
                return prev.filter((wh) => wh.dayOfWeek !== dayIndex);
            } else {
                return [...prev, { dayOfWeek: dayIndex, start: "08:00", end: "18:00" }].sort(
                    (a, b) => a.dayOfWeek - b.dayOfWeek
                );
            }
        });
    };

    const updateHours = (dayIndex: number, field: "start" | "end", value: string) => {
        setWorkingHours((prev) =>
            prev.map((wh) =>
                wh.dayOfWeek === dayIndex ? { ...wh, [field]: value } : wh
            )
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {professionalToEdit ? "Editar Profissional" : "Novo Profissional"}
                    </DialogTitle>
                    <DialogDescription>
                        {professionalToEdit
                            ? "Atualize as informações do profissional."
                            : "Preencha os dados para cadastrar um novo profissional."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Especialidade</Label>
                            <Input
                                id="specialty"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="color">Cor na Agenda</Label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                                            }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!professionalToEdit && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme a senha"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label>Horário de Trabalho</Label>
                        <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                            <div className="flex gap-2 flex-wrap mb-4">
                                {DAYS.map((day, index) => {
                                    const isActive = workingHours.some((wh) => wh.dayOfWeek === index);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(index)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            {workingHours.map((wh) => (
                                <div key={wh.dayOfWeek} className="flex items-center gap-3 text-sm">
                                    <span className="w-10 font-medium">{DAYS[wh.dayOfWeek]}</span>
                                    <Input
                                        type="time"
                                        value={wh.start}
                                        onChange={(e) => updateHours(wh.dayOfWeek, "start", e.target.value)}
                                        className="w-24 h-8"
                                    />
                                    <span>até</span>
                                    <Input
                                        type="time"
                                        value={wh.end}
                                        onChange={(e) => updateHours(wh.dayOfWeek, "end", e.target.value)}
                                        className="w-24 h-8"
                                    />
                                </div>
                            ))}
                            {workingHours.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-2">
                                    Selecione os dias de trabalho acima
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {professionalToEdit ? "Salvar Alterações" : "Cadastrar Profissional"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
