import type { IconType } from 'react-icons';
import {
    TbBolt, TbRobot, TbTarget, TbCheck, TbX, TbClock, TbHandClick, TbBell,
    TbGauge, TbScale, TbFileText, TbBuildingSkyscraper, TbListDetails, TbBug,
    TbSearch, TbChecklist, TbRocket, TbCoin, TbAlertTriangle, TbRefresh, TbCpu,
    TbBulb, TbCircleDot,
} from 'react-icons/tb';

// Name -> Tabler icon component. Content stores a string name (never an emoji),
// the renderer resolves it here. Unknown name falls back to a neutral dot.
const ICONS: Record<string, IconType> = {
    bolt: TbBolt,
    robot: TbRobot,
    target: TbTarget,
    check: TbCheck,
    x: TbX,
    clock: TbClock,
    hand: TbHandClick,
    bell: TbBell,
    gauge: TbGauge,
    scale: TbScale,
    file: TbFileText,
    building: TbBuildingSkyscraper,
    list: TbListDetails,
    bug: TbBug,
    search: TbSearch,
    checklist: TbChecklist,
    rocket: TbRocket,
    coin: TbCoin,
    alert: TbAlertTriangle,
    refresh: TbRefresh,
    cpu: TbCpu,
    bulb: TbBulb,
};

export function LoopIcon({ name, className }: { name?: string; className?: string }) {
    const Cmp = (name && ICONS[name]) || TbCircleDot;
    return <Cmp className={className} />;
}

export default LoopIcon;
