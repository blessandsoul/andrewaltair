import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Prompt Builder',
    description: 'ინტერაქტიული AI prompt builder - შექმენი პროფესიონალური prompts.',
    alternates: { canonical: '/prompt-builder' },
    robots: { index: true, follow: true },
};

export default function PromptBuilderLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
