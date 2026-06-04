"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Laptop } from "@/types";
import { useState } from "react";
import Image from "next/image";

const schema = z.object({
  brand: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  price: z.coerce.number().int().positive("Required"),
  condition: z.enum(["New", "Refurbished", "Used", "Very Good"]),
  cpuName: z.string().optional(),
  cpuGeneration: z.string().optional(),
  ram: z.coerce.number().int().min(0).optional(),
  // maxRam:                z.coerce.number().int().positive().optional(),
  ramUpgradeable: z.boolean().default(false),
  storage: z.string().optional(),
  storageType: z.string().optional(),
  additionalSsdSlot: z.boolean().default(false),
  gpu: z.string().optional(),
  batteryHealth: z.string().optional(),
  // estimatedBatteryHours: z.coerce.number().optional(),
  // weight:                z.coerce.number().optional(),
  maxRam: z.preprocess(
    (val) => (val === "" || val === null ? null : val),
    z.coerce.number().int().positive().nullable().optional(),
  ),

  estimatedBatteryHours: z.preprocess(
    (val) => (val === "" || val === null ? null : val),
    z.coerce.number().positive().nullable().optional(),
  ),

  weight: z.preprocess(
    (val) => (val === "" || val === null ? null : val),
    z.coerce.number().positive().nullable().optional(),
  ),
  touchscreen: z.boolean().default(false),
  backlitKeyboard: z.boolean().default(false),
  fingerprintReader: z.boolean().default(false),
  chargerIncluded: z.boolean().default(true),
  keyboardType: z.string().optional(),
  availability: z
    .enum(["In Stock", "Low Stock", "Out of Stock"])
    .default("In Stock"),
  gamingScore: z.coerce.number().int().min(0).max(100).optional(),
  editingScore: z.coerce.number().int().min(0).max(100).optional(),
  programmingScore: z.coerce.number().int().min(0).max(100).optional(),
  batteryScore: z.coerce.number().int().min(0).max(100).optional(),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface LaptopFormProps {
  laptop?: Laptop;
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-[#8B97A8]">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-[#FF6B35]">{error}</p>}
  </div>
);

const inputClass =
  "w-full border-[#1E2530] bg-[#161B23] text-white placeholder:text-[#8B97A8] focus:ring-[#00D4FF]";

export function LaptopForm({ laptop }: LaptopFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(laptop?.images ?? []);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setImages((prev) => [...prev, data.url]);
        else toast.error(data.error ?? "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: laptop
      ? {
          brand: laptop.brand,
          model: laptop.model,
          cpuName: laptop.cpuName,
          cpuGeneration: laptop.cpuGeneration ?? undefined,
          ram: laptop.ram,
          maxRam: laptop.maxRam ?? undefined,
          ramUpgradeable: laptop.ramUpgradeable,
          storage: laptop.storage,
          storageType: laptop.storageType ?? undefined,
          additionalSsdSlot: laptop.additionalSsdSlot,
          gpu: laptop.gpu,
          batteryHealth: laptop.batteryHealth ?? undefined,
          estimatedBatteryHours: laptop.estimatedBatteryHours ?? undefined,
          weight: laptop.weight ?? undefined,
          touchscreen: laptop.touchscreen,
          backlitKeyboard: laptop.backlitKeyboard,
          fingerprintReader: laptop.fingerprintReader,
          chargerIncluded: laptop.chargerIncluded,
          keyboardType: laptop.keyboardType ?? undefined,
          condition: laptop.condition as FormData["condition"],
          price: laptop.price,
          availability: laptop.availability as FormData["availability"],
          gamingScore: laptop.gamingScore ?? undefined,
          editingScore: laptop.editingScore ?? undefined,
          programmingScore: laptop.programmingScore ?? undefined,
          batteryScore: laptop.batteryScore ?? undefined,
          featured: laptop.featured,
        }
      : { condition: "Used", availability: "In Stock", chargerIncluded: true },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    data = data as FormData;
    const url = laptop ? `/api/laptops/${laptop.id}` : "/api/laptops";
    const method = laptop ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });

    if (res.ok) {
      toast.success(laptop ? "Laptop updated!" : "Laptop created!");
      router.push("/admin/inventory");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error?.message ?? "Failed to save");
    }
  };

  const CheckField = ({
    name,
    label,
  }: {
    name: keyof FormData;
    label: string;
  }) => (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        {...register(name as never)}
        className="rounded accent-[#00D4FF]"
      />
      <span className="text-sm text-[#8B97A8]">{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand *" error={errors.brand?.message}>
            <Input
              {...register("brand")}
              placeholder="Dell"
              className={inputClass}
            />
          </Field>
          <Field label="Model *" error={errors.model?.message}>
            <Input
              {...register("model")}
              placeholder="Latitude 5490"
              className={inputClass}
            />
          </Field>
          <Field label="CPU" error={errors.cpuName?.message}>
            <Input
              {...register("cpuName")}
              placeholder="Intel Core i7-8650U"
              className={inputClass}
            />
          </Field>
          <Field label="CPU Generation" error={errors.cpuGeneration?.message}>
            <Input
              {...register("cpuGeneration")}
              placeholder="8"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Memory & Storage */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">Memory & Storage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="RAM (GB)" error={errors.ram?.message}>
            <Input
              {...register("ram")}
              type="number"
              placeholder="8"
              className={inputClass}
            />
          </Field>
          <Field label="Max RAM (GB)" error={errors.maxRam?.message}>
            <Input
              {...register("maxRam")}
              type="number"
              placeholder="32"
              className={inputClass}
            />
          </Field>
          <Field label="Storage" error={errors.storage?.message}>
            <Input
              {...register("storage")}
              placeholder="256GB SSD"
              className={inputClass}
            />
          </Field>
          <Field label="Storage Type" error={errors.storageType?.message}>
            <Input
              {...register("storageType")}
              placeholder="NVMe"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <CheckField name="ramUpgradeable" label="RAM Upgradeable" />
          <CheckField name="additionalSsdSlot" label="Additional SSD Slot" />
        </div>
      </section>

      {/* GPU & Display */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">GPU & Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GPU" error={errors.gpu?.message}>
            <Input
              {...register("gpu")}
              placeholder="Intel UHD 620"
              className={inputClass}
            />
          </Field>
          <Field label="Weight (kg)" error={errors.weight?.message}>
            <Input
              {...register("weight")}
              type="number"
              step="0.1"
              placeholder="1.8"
              className={inputClass}
            />
          </Field>
          <Field label="Battery Health" error={errors.batteryHealth?.message}>
            <Input
              {...register("batteryHealth")}
              placeholder="Good / 85%"
              className={inputClass}
            />
          </Field>
          <Field
            label="Estimated Battery Hours"
            error={errors.estimatedBatteryHours?.message}
          >
            <Input
              {...register("estimatedBatteryHours")}
              type="number"
              step="0.5"
              placeholder="6"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <CheckField name="touchscreen" label="Touchscreen" />
          <CheckField name="backlitKeyboard" label="Backlit Keyboard" />
          <CheckField name="fingerprintReader" label="Fingerprint Reader" />
          <CheckField name="chargerIncluded" label="Charger Included" />
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">
          Pricing & Availability
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (NGN) *" error={errors.price?.message}>
            <Input
              {...register("price")}
              type="number"
              placeholder="195000"
              className={inputClass}
            />
          </Field>
          <Field label="Condition *" error={errors.condition?.message}>
            <Select
              onValueChange={(v) =>
                setValue("condition", v as FormData["condition"])
              }
              defaultValue={watch("condition")}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["New", "Very Good", "Refurbished", "Used"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Availability" error={errors.availability?.message}>
            <Select
              onValueChange={(v) =>
                setValue("availability", v as FormData["availability"])
              }
              defaultValue={watch("availability")}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["In Stock", "Low Stock", "Out of Stock"].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      {/* Scores */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">
          Performance Scores (0–100, optional)
        </h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            "gamingScore",
            "editingScore",
            "programmingScore",
            "batteryScore",
          ].map((s) => (
            <Field
              key={s}
              label={s
                .replace("Score", " Score")
                .replace(/([A-Z])/g, " $1")
                .trim()}
            >
              <Input
                {...register(s as keyof FormData)}
                type="number"
                min="0"
                max="100"
                className={inputClass}
              />
            </Field>
          ))}
        </div>
        <div className="mt-4">
          <CheckField name="featured" label="Mark as Featured" />
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-6">
        <h2 className="mb-4 font-semibold text-white">Images</h2>

        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#1E2530] px-6 py-8 text-center text-sm text-[#8B97A8] transition-colors hover:border-[#00D4FF] hover:text-[#00D4FF]">
            {uploading ? "Uploading…" : "Click to upload images (up to 6)"}
          </span>
        </label>

        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <Image
                  src={img}
                  alt={`Image ${i + 1}`}
                  width={80}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B35] text-white text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-[#1E2530] text-[#8B97A8]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00D4FF] text-black font-semibold hover:bg-[#00bfe6] flex-1"
        >
          {isSubmitting
            ? "Saving..."
            : laptop
              ? "Update Laptop"
              : "Create Laptop"}
        </Button>
      </div>
    </form>
  );
}
