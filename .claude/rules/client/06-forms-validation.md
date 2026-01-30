---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# Forms & Validation

## Version: 2.0

---

## 1. Form Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Form State | React Hook Form | Field management, submission |
| Validation | Zod | Schema validation |
| UI Components | shadcn/ui | Form inputs, labels, errors |

---

## 2. Basic Form Pattern

### 2.1 Complete Form Example

```typescript
// features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// 1. Define schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// 2. Infer type from schema
type LoginFormData = z.infer<typeof loginSchema>;

// 3. Component props
interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

// 4. Component
export const LoginForm = ({ onSubmit, isSubmitting = false, error }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Global error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
```

### 2.2 Using the Form

```typescript
// features/auth/pages/LoginPage.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { getErrorMessage } from '@/lib/utils/error.utils';

export const LoginPage = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
};
```

---

## 3. Validation Schemas

### 3.1 Reusable Schema Parts

```typescript
// lib/schemas/common.schemas.ts
import { z } from 'zod';

// Email
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255);

// Password
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

// Simple password (no complexity requirements)
export const simplePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100);

// Price
export const priceSchema = z
  .number({ invalid_type_error: 'Price must be a number' })
  .min(0, 'Price must be positive')
  .max(1000000, 'Price is too high');

// Positive integer
export const positiveIntSchema = z
  .number()
  .int('Must be a whole number')
  .positive('Must be greater than 0');

// URL (optional)
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .or(z.literal(''))
  .optional();

// Phone (optional)
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
  .or(z.literal(''))
  .optional();
```

### 3.2 Feature-Specific Schemas

```typescript
// features/tours/schemas/tour.schemas.ts
import { z } from 'zod';
import { priceSchema, positiveIntSchema } from '@/lib/schemas/common.schemas';

// Create tour schema
export const createTourSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  summary: z
    .string()
    .max(1000, 'Summary is too long')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(10000)
    .optional()
    .or(z.literal('')),
  price: priceSchema,
  currency: z.enum(['GEL', 'USD', 'EUR']).default('GEL'),
  city: z.string().optional().or(z.literal('')),
  durationMinutes: positiveIntSchema.optional().or(z.literal('')),
  maxPeople: positiveIntSchema.optional().or(z.literal('')),
});

// Update tour schema (all fields optional)
export const updateTourSchema = createTourSchema.partial();

// Types
export type CreateTourFormData = z.infer<typeof createTourSchema>;
export type UpdateTourFormData = z.infer<typeof updateTourSchema>;
```

### 3.3 Conditional Validation

```typescript
// Schema with conditional fields
const bookingSchema = z.object({
  tourId: z.string().min(1),
  date: z.string().min(1, 'Date is required'),
  guests: z.number().int().min(1).max(20),
  specialRequests: z.string().optional(),
  isPremium: z.boolean().default(false),
  premiumNotes: z.string().optional(),
}).refine(
  (data) => {
    // If premium, notes are required
    if (data.isPremium && (!data.premiumNotes || data.premiumNotes.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Premium bookings require notes',
    path: ['premiumNotes'],
  }
);

// Schema with password confirmation
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);
```

---

## 4. Form Field Components

### 4.1 Text Input Field

```typescript
// components/form/FormField.tsx
import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          {...props}
        />
        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
```

### 4.2 Select Field

```typescript
// Using Controller for controlled components
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const SelectField = ({ name, label, placeholder, options }: SelectFieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id={name} aria-invalid={!!error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
```

### 4.3 Textarea Field

```typescript
// components/form/TextareaField.tsx
import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, maxLength, currentLength, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor={inputId}>{label}</Label>
          {maxLength && (
            <span className="text-sm text-muted-foreground">
              {currentLength ?? 0}/{maxLength}
            </span>
          )}
        </div>
        <Textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';
```

---

## 5. Complex Form Patterns

### 5.1 Multi-Step Form

```typescript
// features/tours/components/CreateTourWizard.tsx
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { createTourSchema, type CreateTourFormData } from '../schemas/tour.schemas';

const STEPS = ['Basic Info', 'Details', 'Pricing', 'Review'];

export const CreateTourWizard = ({ onComplete }: { onComplete: (data: CreateTourFormData) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<CreateTourFormData>({
    resolver: zodResolver(createTourSchema),
    mode: 'onChange',
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;

  const handleNext = async () => {
    // Validate current step fields
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: CreateTourFormData) => {
    onComplete(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={cn(
                  'flex-1 text-center',
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        {currentStep === 0 && <BasicInfoStep />}
        {currentStep === 1 && <DetailsStep />}
        {currentStep === 2 && <PricingStep />}
        {currentStep === 3 && <ReviewStep />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Tour'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

function getFieldsForStep(step: number): (keyof CreateTourFormData)[] {
  switch (step) {
    case 0: return ['title', 'summary'];
    case 1: return ['description', 'city', 'durationMinutes'];
    case 2: return ['price', 'currency', 'maxPeople'];
    default: return [];
  }
}
```

### 5.2 Dynamic Field Array

```typescript
// Features tours with multiple highlights
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

export const HighlightsField = () => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights',
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Highlights</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            {...register(`highlights.${index}.value`)}
            placeholder="Enter highlight"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {errors.highlights && (
        <p className="text-sm text-destructive">
          {(errors.highlights as any)?.message}
        </p>
      )}
    </div>
  );
};
```

---

## 6. Form with API Error Handling

```typescript
// Handle field-specific errors from API
import { useForm, type FieldPath } from 'react-hook-form';
import { getFieldErrors, getErrorMessage } from '@/lib/utils/error.utils';

export const CreateTourForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateTourFormData>({
    resolver: zodResolver(createTourSchema),
  });

  const { mutateAsync: createTour, isPending } = useCreateTour();

  const onSubmit = async (data: CreateTourFormData) => {
    try {
      await createTour(data);
    } catch (error) {
      // Handle field-specific errors
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as FieldPath<CreateTourFormData>, {
            type: 'server',
            message
          });
        });
      } else {
        // Set root error
        setError('root', {
          type: 'server',
          message: getErrorMessage(error)
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Root error */}
      {errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      {/* Form fields */}
      ...
    </form>
  );
};
```

---

## 7. File Upload in Forms

```typescript
// features/tours/components/TourImageUpload.tsx
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useUpload } from '@/features/media/hooks/useUpload';
import { Upload, X } from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
}

export const TourImageUpload = () => {
  const { setValue, watch } = useFormContext();
  const images = watch('images') as UploadedImage[] || [];

  const { upload, isUploading, progress } = useUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files).filter(
      (file) => file.type.startsWith('image/')
    );

    if (fileArray.length === 0) return;

    const uploaded = await upload(fileArray);
    setValue('images', [...images, ...uploaded]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setValue('images', images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border',
          isUploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="image-upload"
        />

        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Drop images here or click to upload</p>
        </label>

        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt=""
                className="w-full h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 8. Form Best Practices

### 8.1 Do's

```typescript
// ✅ Match backend validation
const schema = z.object({
  // Same rules as backend
  title: z.string().min(1).max(200),
});

// ✅ Show field errors immediately
{errors.email && <p className="text-destructive">{errors.email.message}</p>}

// ✅ Disable submit while submitting
<Button disabled={isSubmitting}>Submit</Button>

// ✅ Clear form on success
reset();

// ✅ Handle API errors
setError('email', { message: 'Email already exists' });

// ✅ Use aria attributes
<Input aria-invalid={!!error} aria-describedby="error-id" />
```

### 8.2 Don'ts

```typescript
// ❌ Don't show errors before interaction
// Use mode: 'onBlur' or 'onSubmit'

// ❌ Don't trust client validation alone
// Always validate on server

// ❌ Don't forget loading states
// Always show isSubmitting indicator

// ❌ Don't ignore API validation errors
// Map them to form fields

// ❌ Don't use uncontrolled inputs for complex forms
// Use react-hook-form Controller
```

---

## 9. Form Checklist

- [ ] Schema defined with Zod
- [ ] Type inferred from schema
- [ ] zodResolver configured
- [ ] Loading state shows during submission
- [ ] Field errors displayed below inputs
- [ ] aria-invalid set on errored fields
- [ ] Global errors shown at top
- [ ] API errors mapped to fields
- [ ] Submit disabled during submission
- [ ] Form resets on success

---

**Version**: 2.0
**Last Updated**: 2025-01-30
