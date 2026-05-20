import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES = [
  { id: "barberia", label: "Barbería", icon: "✂️" },
  { id: "peluqueria", label: "Peluquería", icon: "💇" },
  { id: "unas", label: "Uñas", icon: "💅" },
];

const SERVICES: Record<string, { name: string; price: string; duration: string }[]> = {
  barberia: [
    { name: "Corte Clásico", price: "$8.000", duration: "30 min" },
    { name: "Corte + Barba", price: "$12.000", duration: "50 min" },
    { name: "Perfilado de Barba", price: "$5.000", duration: "20 min" },
    { name: "Afeitado con Navaja", price: "$7.000", duration: "30 min" },
  ],
  peluqueria: [
    { name: "Corte de Dama", price: "$10.000", duration: "40 min" },
    { name: "Color Completo", price: "$18.000", duration: "90 min" },
    { name: "Mechas Balayage", price: "$25.000", duration: "120 min" },
    { name: "Brushing", price: "$6.000", duration: "30 min" },
  ],
  unas: [
    { name: "Esculpidas", price: "$15.000", duration: "90 min" },
    { name: "Kapping", price: "$10.000", duration: "60 min" },
    { name: "Manicura Semipermanente", price: "$8.000", duration: "45 min" },
    { name: "Nail Art Minimalista", price: "$18.000", duration: "100 min" },
  ],
};

const PROFESSIONALS = [
  { name: "Carmen", specialty: "Peluquería & Color" },
  { name: "Rafael", specialty: "Barbería" },
  { name: "Alexander", specialty: "Barbería" },
  { name: "Noris", specialty: "Uñas & Estética" },
];

const HOURS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const BookingStepper = () => {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [professional, setProfessional] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const steps = ["Categoría", "Servicio", "Profesional", "Fecha y Hora", "Confirmar"];

  const canNext = () => {
    if (step === 0) return !!category;
    if (step === 1) return !!service;
    if (step === 2) return !!professional;
    if (step === 3) return !!date && !!hour;
    if (step === 4) return name.length > 1 && phone.length > 5;
    return false;
  };

  const handleConfirm = () => {
    const dateStr = date ? format(date, "dd/MM/yyyy", { locale: es }) : "";
    const message = `Hola Stella Estudio, quiero confirmar un turno de ${service} con ${professional} el día ${dateStr} a las ${hour}.%0ANombre: ${name}%0ATeléfono: ${phone}`;
    window.open(`https://wa.me/5491100000000?text=${message}`, "_blank");
  };

  return (
    <section id="booking" className="py-24 px-6">
      <div className="container max-w-2xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-light tracking-wide mb-4">
            Reserva tu <span className="text-gradient-gold">Turno Online</span>
          </h2>
          <div className="gold-divider mb-4" />
          <p className="text-muted-foreground font-body text-sm tracking-wider">
            Seleccioná tu servicio y horario en simples pasos
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10 fade-in-up">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "w-8 h-8 rounded-full text-xs font-body flex items-center justify-center transition-all duration-300 border",
                  i === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i < step
                    ? "border-primary text-primary cursor-pointer"
                    : "border-border text-muted-foreground"
                )}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div className={cn("w-6 md:w-10 h-px", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border p-6 md:p-8 fade-in-up">
          <p className="font-heading text-xl text-primary mb-6">{steps[step]}</p>

          {/* Step 0: Category */}
          {step === 0 && (
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCategory(c.id); setService(""); }}
                  className={cn(
                    "p-5 border text-center transition-all duration-300 font-body",
                    category === c.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl block mb-2">{c.icon}</span>
                  <span className="text-xs tracking-wider uppercase">{c.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Service */}
          {step === 1 && category && (
            <div className="space-y-3">
              {SERVICES[category].map((s) => (
                <button
                  key={s.name}
                  onClick={() => setService(s.name)}
                  className={cn(
                    "w-full p-4 border flex justify-between items-center transition-all duration-300 font-body text-sm",
                    service === s.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span>{s.name}</span>
                  <span className="flex gap-4 text-muted-foreground text-xs">
                    <span>{s.duration}</span>
                    <span className="text-primary font-medium">{s.price}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <div className="grid grid-cols-3 gap-4">
              {PROFESSIONALS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setProfessional(p.name)}
                  className={cn(
                    "p-5 border text-center transition-all duration-300 font-body",
                    professional === p.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-14 h-14 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center text-primary text-xl font-heading">
                    {p.name[0]}
                  </div>
                  <span className="text-sm block">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.specialty}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Date + Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date() || d.getDay() === 0}
                  className="pointer-events-auto border border-border rounded-md"
                />
              </div>
              {date && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-body">
                    Horarios disponibles para {format(date, "d 'de' MMMM", { locale: es })}
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {HOURS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHour(h)}
                        className={cn(
                          "py-2 border text-sm font-body transition-all duration-300",
                          hour === h
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-secondary/50 p-4 text-sm font-body space-y-1">
                <p><span className="text-muted-foreground">Servicio:</span> <span className="text-primary">{service}</span></p>
                <p><span className="text-muted-foreground">Profesional:</span> {professional}</p>
                <p><span className="text-muted-foreground">Fecha:</span> {date && format(date, "EEEE d 'de' MMMM", { locale: es })}</p>
                <p><span className="text-muted-foreground">Hora:</span> {hour}</p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary border border-border p-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Tu WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-secondary border border-border p-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Atrás
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => canNext() && setStep(step + 1)}
                disabled={!canNext()}
                className={cn(
                  "font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border transition-all duration-300",
                  canNext()
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : "border-border text-muted-foreground cursor-not-allowed"
                )}
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!canNext()}
                className={cn(
                  "font-body text-xs tracking-[0.2em] uppercase px-8 py-3 transition-all duration-300",
                  canNext()
                    ? "bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Confirmar por WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingStepper;
