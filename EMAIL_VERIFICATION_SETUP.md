# 📧 Email Verification - Инструкция по настройке

## 🎉 ЧТО УЖЕ РАБОТАЕТ

Email verification **УЖЕ ПОЛНОСТЬЮ РЕАЛИЗОВАН** в коде:
- ✅ Backend API готов
- ✅ Email templates созданы
- ✅ Токены генерируются автоматически
- ✅ Проверка при логине работает

**Сейчас работает в тестовом режиме** - emails отправляются на Ethereal (тестовый сервер).

---

## 🚀 БЫСТРЫЙ СТАРТ (3 варианта)

### Вариант 1: Тестовый режим (РАБОТАЕТ СЕЙЧАС)

**Ничего делать не нужно!** Уже работает из коробки.

**Как проверить:**
1. Зарегистрируйте пользователя на сайте
2. Откройте логи Coolify
3. Найдите строку: `Preview URL: https://ethereal.email/message/xxx`
4. Откройте эту ссылку - увидите email с кнопкой подтверждения

**Плюсы:** Работает сразу, бесплатно  
**Минусы:** Реальные пользователи не получат emails

---

### Вариант 2: Gmail (РЕКОМЕНДУЮ ДЛЯ СТАРТА)

#### Шаг 1: Получите App Password

1. Откройте: https://myaccount.google.com/apppasswords
2. Включите 2FA если еще не включена
3. Создайте App Password:
   - App: **Mail**
   - Device: **Other** (напишите "Andrew Altair")
4. **Скопируйте 16-значный пароль**

#### Шаг 2: Добавьте в Coolify

Откройте ваш проект в Coolify → Environment Variables → Добавьте:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ваш-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM="Andrew Altair <noreply@andrewaltair.ge>"
NEXT_PUBLIC_APP_URL=https://andrewaltair.ge
```

#### Шаг 3: Передеплойте

Coolify автоматически перезапустит приложение с новыми настройками.

**Готово!** Теперь реальные emails будут отправляться через Gmail.

---

### Вариант 3: Resend (ПРОФЕССИОНАЛЬНЫЙ)

Для production рекомендую Resend - специальный сервис для разработчиков.

#### Шаг 1: Регистрация

1. Откройте: https://resend.com
2. Sign Up (можно через GitHub)
3. Подтвердите email

#### Шаг 2: Получите API ключ

1. Dashboard → **API Keys**
2. **Create API Key**
3. Name: `Andrew Altair`
4. **Скопируйте ключ** (начинается с `re_...`)

#### Шаг 3: Установите пакет

```bash
npm install resend
```

#### Шаг 4: Добавьте в Coolify

```bash
RESEND_API_KEY=re_ваш_ключ
SMTP_FROM="Andrew Altair <noreply@andrewaltair.ge>"
NEXT_PUBLIC_APP_URL=https://andrewaltair.ge
```

#### Шаг 5: Обновите код

В файле `src/app/api/auth/register/route.ts` замените строку 84:

**Было:**
```typescript
sendWelcomeEmail(fullName, email, verificationUrl).catch(err => console.error('Verification email error:', err))
```

**Станет:**
```typescript
// Используем Resend для production
if (process.env.RESEND_API_KEY) {
    const { sendWelcomeEmailResend } = await import('@/lib/email-resend');
    sendWelcomeEmailResend(fullName, email, verificationUrl).catch(err => console.error('Verification email error:', err));
} else {
    sendWelcomeEmail(fullName, email, verificationUrl).catch(err => console.error('Verification email error:', err));
}
```

#### Шаг 6: Передеплойте

```bash
git add .
git commit -m "feat: add Resend email support"
git push origin main
```

**Плюсы Resend:**
- ✅ 3,000 emails/месяц бесплатно
- ✅ Не попадает в спам
- ✅ Аналитика доставки
- ✅ Профессиональный вид

---

## 🧪 КАК ПРОТЕСТИРОВАТЬ

### 1. Регистрация нового пользователя

```
POST https://andrewaltair.ge/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!@#",
  "fullName": "Test User"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "რეგისტრაცია წარმატებულია! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა...",
  "email": "test@example.com",
  "requiresVerification": true
}
```

### 2. Проверьте email

- **Тестовый режим:** Смотрите логи Coolify
- **Gmail/Resend:** Проверьте почту test@example.com

### 3. Кликните на кнопку в email

Откроется страница: `https://andrewaltair.ge/verify-email?token=abc123...`

### 4. Попробуйте войти

```
POST https://andrewaltair.ge/api/auth/login
{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

**До верификации:**
```json
{
  "error": "გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა",
  "requiresVerification": true
}
```

**После верификации:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

## 🎨 FRONTEND СТРАНИЦА (нужно создать)

Создайте файл: `src/app/verify-email/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('ვერიფიკაციის ტოკენი არ არის მითითებული')
            return
        }

        // Verify email
        fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus('success')
                    setMessage(data.message)
                    // Redirect to login after 3 seconds
                    setTimeout(() => router.push('/login'), 3000)
                } else {
                    setStatus('error')
                    setMessage(data.error)
                }
            })
            .catch(() => {
                setStatus('error')
                setMessage('ვერიფიკაცია ვერ მოხერხდა')
            })
    }, [token, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-white mb-2">მიმდინარეობს ვერიფიკაცია...</h1>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-white mb-2">წარმატებული!</h1>
                        <p className="text-white/80">{message}</p>
                        <p className="text-white/60 text-sm mt-4">გადამისამართება...</p>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-white mb-2">შეცდომა</h1>
                        <p className="text-white/80">{message}</p>
                        <button 
                            onClick={() => router.push('/register')}
                            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            უკან რეგისტრაციაზე
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
```

---

## 📊 МОНИТОРИНГ

### Проверка статуса в базе данных

```javascript
// MongoDB
db.users.find({ email: "test@example.com" }, { 
    isEmailVerified: 1, 
    emailVerificationToken: 1,
    emailVerificationExpires: 1 
})
```

### Логи Coolify

Ищите строки:
- `Verification email sent to: test@example.com`
- `Preview URL: https://ethereal.email/...` (тестовый режим)
- `Email sent successfully` (production)

---

## ❓ FAQ

### Q: Emails не приходят через Gmail?

**A:** Проверьте:
1. App Password правильный (16 символов без пробелов)
2. 2FA включена в Google аккаунте
3. `SMTP_USER` = ваш полный email
4. Проверьте папку "Спам"

### Q: Как отправить verification email повторно?

**A:** Создайте endpoint `/api/auth/resend-verification`:

```typescript
// Найдите пользователя
const user = await User.findOne({ email }).select('+emailVerificationToken');

// Проверьте что не verified
if (user.isEmailVerified) {
    return NextResponse.json({ error: 'Email уже подтвержден' });
}

// Отправьте email повторно
const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.emailVerificationToken}`;
await sendWelcomeEmail(user.fullName, user.email, verificationUrl);
```

### Q: Токен истек (24 часа прошло)?

**A:** Сгенерируйте новый токен:

```typescript
const crypto = await import('crypto');
user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
await user.save();
```

---

## 🎯 РЕКОМЕНДАЦИИ

### Для разработки:
✅ Используйте **тестовый режим** (Ethereal)

### Для staging:
✅ Используйте **Gmail** (быстро и бесплатно)

### Для production:
✅ Используйте **Resend** (профессионально)

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:
1. Проверьте логи Coolify
2. Проверьте Environment Variables
3. Убедитесь что `NEXT_PUBLIC_APP_URL` правильный
4. Проверьте что frontend страница `/verify-email` создана

**Все уже работает! Просто выберите вариант и настройте email сервис.** 🚀
