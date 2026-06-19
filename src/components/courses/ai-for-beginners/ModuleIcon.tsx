// Resolves a module's Tabler icon name (from the manifest) to a component.
// Strictly icons, never emoji.
import {
    TbSettings, TbBrain, TbSitemap, TbBinaryTree, TbEye,
    TbMessages, TbPuzzle, TbScale, TbSparkles, TbBook2,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';

const MAP: Record<string, IconType> = {
    settings: TbSettings,
    brain: TbBrain,
    sitemap: TbSitemap,
    network: TbBinaryTree,
    eye: TbEye,
    messages: TbMessages,
    puzzle: TbPuzzle,
    scale: TbScale,
    sparkles: TbSparkles,
    book: TbBook2,
};

export default function ModuleIcon({ name, className, size }: { name?: string; className?: string; size?: number }) {
    const Icon = (name && MAP[name]) || TbBook2;
    return <Icon className={className} size={size} />;
}
