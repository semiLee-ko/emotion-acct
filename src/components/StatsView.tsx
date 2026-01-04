"use client";

import { Paper, Text, Group, Stack, ActionIcon, Tooltip, Box, rem, Center, Transition, Modal, UnstyledButton, Button, TextInput } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { EMOTION_CONFIG, Receipt, EmotionType } from '@/lib/types';
import { useMemo, useState, useEffect, useRef } from 'react';
import { showRewardedAd, showInterstitialAd } from '@/lib/ads';
import { captureElement } from '@/lib/capture';
import { downloadBase64 } from '@/lib/capture';
import { MoodThermometer, MoodFaceIcon } from './MoodThermometer';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpModal } from './HelpModal';
import { CalendarModal } from './CalendarModal';
import { AlertModal } from './AlertModal';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar } from '@tabler/icons-react';

// Custom Icons
const IconChevronDown = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const IconChevronUp = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
    </svg>
);

const IconThermometer = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
);

const IconChartPie = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8" />
        <path d="M13.4 3.2C13.4 3.2 13.4 13.4 20.8 13.4" />
    </svg>
);

const IconWatchAd = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill={color} />
    </svg>
);

const IconHelp = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill={color} stroke="none" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#ffffff" strokeWidth="2" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#ffffff" strokeWidth="2" />
    </svg>
);


interface Props {
    receipts: Receipt[]; // Filtered receipts for the selected month
    allReceipts?: Receipt[]; // All receipts for global check
    selectedDate?: Date;
    availableMonths?: string[];
    onDateChange?: (date: Date) => void;
}

export function StatsView({ receipts, allReceipts = [], selectedDate, availableMonths = [], onDateChange }: Props) {
    const [viewMode, setViewMode] = useState<'chart' | 'thermometer'>('chart');
    const [hoveredItem, setHoveredItem] = useState<{ name: string; value: number; color: string } | null>(null);
    const [showIcon, setShowIcon] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [helpOpened, { open: openHelp, close: closeHelp }] = useDisclosure(false);
    const [alertOpened, setAlertOpened] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [monthModalOpened, { open: openMonthModal, close: closeMonthModal }] = useDisclosure(false);
    const [calendarOpened, { open: openCalendar, close: closeCalendar }] = useDisclosure(false);
    const [nameModalOpened, { open: openNameModal, close: closeNameModal }] = useDisclosure(false);
    const [userName, setUserName] = useState('');

    // Ref for carousel scrolling
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // State for temporary selection (visual focus only)
    const [tempSelectedMonth, setTempSelectedMonth] = useState<string | null>(null);
    const [isSnappingEnabled, setIsSnappingEnabled] = useState(false);
    const [isScrollReady, setIsScrollReady] = useState(false); // Controls visibility to prevent jump

    // Initial setup when modal opens
    useEffect(() => {
        if (monthModalOpened && selectedDate) {
            // Seed temp state with current selection
            const currentMonthStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
            setTempSelectedMonth(currentMonthStr);
            setIsSnappingEnabled(false); // Disable snap initially
            setIsScrollReady(false); // Hide until scrolled

            // Auto-scroll logic (immediate)
            setTimeout(() => {
                const container = scrollContainerRef.current;
                if (!container) return;

                const selectedEl = container.querySelector(`[data-month="${currentMonthStr}"]`) as HTMLElement;
                if (selectedEl) {
                    selectedEl.scrollIntoView({
                        behavior: 'auto',
                        block: 'nearest',
                        inline: 'center'
                    });

                    // Reveal and re-enable snap
                    requestAnimationFrame(() => {
                        setIsScrollReady(true);
                        setTimeout(() => setIsSnappingEnabled(true), 100);
                    });
                } else {
                    // Fallback to visible if not found
                    setIsScrollReady(true);
                }
            }, 10);
        }
    }, [monthModalOpened, selectedDate]);

    // Handle Confirm Click
    const handleConfirmSelection = () => {
        if (tempSelectedMonth && onDateChange) {
            const [y, m] = tempSelectedMonth.split('-');
            const newDate = new Date(parseInt(y), parseInt(m) - 1, 1);
            onDateChange(newDate);
            closeMonthModal();
        }
    };

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertOpened(true);
    };

    // Alternating animation: text <-> icon every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setShowIcon(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Handle ad + download
    const handleAdAndDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);

        try {
            const result = await showInterstitialAd();

            if (result.result) {
                // Open name input modal after ad
                openNameModal();
            } else {
                showAlert('광고 시청이 완료되지 않았습니다.');
                setIsDownloading(false);
            }
        } catch (error) {
            console.error('Ad Error:', error);
            showAlert('광고 실행 중 오류가 발생했습니다.');
            setIsDownloading(false);
        }
    };

    const handleConfirmName = async () => {
        closeNameModal();

        try {
            // Wait a moment to ensure modal close animation finishes
            await new Promise(resolve => setTimeout(resolve, 400));

            // Proceed with download
            const base64 = await captureElement('stats-full-content', {
                onClone: (element) => {
                    // CRITICAL: Reset transform so the receipts stack naturally without offset
                    element.style.transform = 'none';

                    // Fix height to auto (fit-content can cause issues with html2canvas gradient calculation)
                    element.style.height = 'auto';
                    element.style.minHeight = '100px'; // distinct non-zero min-height

                    element.style.width = '100%'; // Ensure width is explicit

                    // Apply Unified Gradient Background to the container
                    element.style.background = 'linear-gradient(180deg, #FFFFFF 0%, #e7f5ff 100%)';

                    // Collapse sections to remove extra whitespace
                    const sections = element.querySelectorAll('.stats-section') as NodeListOf<HTMLElement>;
                    sections.forEach(el => {
                        el.style.background = 'transparent';
                        el.style.height = 'auto'; // Collapse height
                        el.style.minHeight = '0';
                        el.style.flex = '0 0 auto';
                        el.style.paddingBottom = '0'; // Reduce gap between sections
                    });

                    // Ensure Thermometer fills its area cleanly (Transparent to let gradient show)
                    const thermView = element.querySelector('#stats-thermometer-view') as HTMLElement;
                    if (thermView) {
                        thermView.style.background = 'transparent';
                        // Remove any extra padding/margin from thermometer container if needed
                        const stack = thermView.querySelector('.mantine-Stack-root') as HTMLElement;
                        if (stack) stack.style.paddingBottom = '0';

                        // CRITICAL FIX: Replace gradient with solid color for thermometer liquid
                        // html2canvas fails with "non-finite" on gradients in some contexts
                        const liquids = thermView.querySelectorAll('.thermometer-liquid') as NodeListOf<HTMLElement>;
                        liquids.forEach(liquid => {
                            const color = liquid.dataset.color || '#339af0';
                            liquid.style.background = color; // Solid color instead of gradient
                        });
                    }

                    // Ensure Chart View is transparent (to let gradient show)
                    const chartView = element.querySelector('#stats-chart-view') as HTMLElement;
                    if (chartView) {
                        chartView.style.background = 'transparent';
                    }

                    // Reveal capture-only elements (header & footer)
                    const captureReveal = element.querySelectorAll('.capture-reveal') as NodeListOf<HTMLElement>;
                    captureReveal.forEach(el => {
                        el.style.display = 'block';
                    });
                    // Adjust emotion bar vertical alignment for captured image
                    const emotionBar = element.querySelector('.emotion-bar') as HTMLElement;
                    if (emotionBar) {
                        emotionBar.style.transform = 'translateY(11px)';
                    }
                }
            });

            if (base64) {
                await downloadBase64(base64, `emotion-receipt-${new Date().toISOString().slice(0, 10)}.png`);
            } else {
                showAlert('이미지 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Download failed:', error);
            showAlert('이미지 저장 중 오류가 발생했습니다.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Calculate Stats
    const stats = useMemo(() => {
        const total = receipts.reduce((acc, cur) => acc + cur.amount, 0);
        const byEmotion = receipts.reduce((acc, cur) => {
            acc[cur.emotion] = (acc[cur.emotion] || 0) + cur.amount;
            return acc;
        }, {} as Record<EmotionType, number>);

        const data = Object.entries(EMOTION_CONFIG).map(([key, config]) => ({
            name: config.label,
            value: byEmotion[key as EmotionType] || 0,
            color: config.color,
            emoji: config.emoji
        })).filter(item => item.value > 0);

        // Sort by value desc
        data.sort((a, b) => b.value - a.value);

        // Mood Score Calculation (0-100)
        // Positive emotions add points, Negative remove points. 
        // Base 50. Weighted by amount ratio.
        let score = 50;
        if (total > 0) {
            const positive = (byEmotion['CONGRATULATIONS'] || 0) + (byEmotion['LOVE'] || 0) + (byEmotion['GROWTH'] || 0);
            const negative = (byEmotion['STRESS'] || 0) + (byEmotion['EMERGENCY'] || 0) + (byEmotion['COMFORT'] || 0); // COMFORT is usually associated with stress relief spending

            const posRatio = positive / total;
            const negRatio = negative / total;

            score = 50 + (posRatio * 50) - (negRatio * 50);
        }

        return { total, data, moodScore: Math.round(score) };
    }, [receipts]);

    // If no receipts in the system, show only the Help button at the top
    if (allReceipts.length === 0) {
        return (
            <Box style={{ position: 'relative', height: 0, zIndex: 10 }}>
                <Group gap={8} style={{ position: 'absolute', top: '12px', left: '0px' }}>
                    <motion.button
                        onClick={openHelp}
                        style={{
                            background: '#339af0',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(51, 154, 240, 0.3)'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IconHelp size={22} color="#339af0" />
                    </motion.button>
                    <motion.button
                        onClick={openCalendar}
                        style={{
                            background: '#fab005',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(250, 176, 5, 0.3)'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IconCalendar size={20} color="#ffffff" stroke={2} />
                    </motion.button>
                </Group>
                <HelpModal opened={helpOpened} onClose={closeHelp} />
                <CalendarModal opened={calendarOpened} onClose={closeCalendar} receipts={receipts} />
            </Box>
        );
    }
    // Increased height to accommodate content more comfortably
    const CONTAINER_HEIGHT = 460;

    const dateTitle = selectedDate
        ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`
        : '';

    const dateString = new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }); // For footer

    // Display logic for interactive legend
    const displayItem = hoveredItem || (stats.data.length > 0 ? stats.data[0] : null);
    const displayPercent = displayItem && stats.total > 0 ? Math.round((displayItem.value / stats.total) * 100) : 0;

    const handleMonthSelect = (monthStr: string) => {
        const [year, month] = monthStr.split('-').map(Number);
        const newDate = new Date(year, month - 1, 1);
        if (onDateChange) onDateChange(newDate);
        closeMonthModal();
    };

    return (
        <Paper
            shadow="sm"
            radius={24}
            mb="lg"
            className="border-0 relative"
            style={{
                height: CONTAINER_HEIGHT,
                overflow: 'hidden',
                // Dynamic background based on mode
                background: viewMode === 'chart' ? '#FFFFFF' : '#e7f5ff',
                transition: 'background-color 0.5s ease'
            }}
        >
            {/* Animated Ad Button (Top Right) */}
            <motion.button
                onClick={handleAdAndDownload}
                disabled={isDownloading}
                className="z-10"
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    cursor: isDownloading ? 'wait' : 'pointer',
                    minWidth: '100px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={showIcon ? 'icon' : 'text'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    >
                        {showIcon ? (
                            <IconWatchAd size={28} color="#339af0" />
                        ) : (
                            <Text size="xs" fw={700} c="blue.6" ta="center" style={{ lineHeight: 1.2 }}>
                                광고보고<br />이미지저장
                            </Text>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            {/* Help Button (Top Left) */}
            <Group gap={8} style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                <motion.button
                    onClick={openHelp}
                    style={{
                        background: '#339af0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(51, 154, 240, 0.3)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <IconHelp size={22} color="#339af0" />
                </motion.button>

                <motion.button
                    onClick={openCalendar}
                    style={{
                        background: '#fab005', // Yellow/Orange for "Negative/Caution" theme
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(250, 176, 5, 0.3)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <IconCalendar size={20} color="#ffffff" stroke={2} />
                </motion.button>
            </Group>

            <motion.div
                id="stats-full-content"
                animate={{ y: viewMode === 'chart' ? 0 : -CONTAINER_HEIGHT }}
                transition={{ type: "spring", stiffness: 45, damping: 12 }} // Slightly bouncier for fun effect
                style={{
                    height: CONTAINER_HEIGHT * 2,
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'inherit' // Enforce inheritance from body
                }}
            >
                {/* Poster Header (Hidden by default) */}
                <Box className="capture-reveal" pt="xl" px="lg" pb="xs" style={{ display: 'none', background: 'transparent' }}>
                    <Stack gap={0}>
                        <Text size="xl" fw={900} c="dark.8" style={{ letterSpacing: -1 }}>EMOTION RECEIPT</Text>
                        <div style={{ width: '90%', margin: '16px auto 8px auto', borderBottom: '1.5px dashed #adb5bd' }} />
                    </Stack>
                </Box>

                {/* section 1: Chart View (Top) */}
                <Box
                    id="stats-chart-view"
                    className="stats-section"
                    style={{
                        height: CONTAINER_HEIGHT,
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#FFFFFF'
                    }}
                    p="lg"
                >
                    <Stack className="stats-stack" gap="lg" align="center" mt="md" flex={1} justify="center">
                        {/* Total Amount Header with Date Selector */}
                        <div className="text-center">
                            {userName && (
                                <Box className="capture-reveal" style={{ display: 'none' }}>
                                    <Text size="1.1rem" fw={800} c="blue.6" mb={2}>
                                        {userName}님,
                                    </Text>
                                </Box>
                            )}
                            <Group gap={4} justify="center" mb={4} style={{ cursor: 'pointer' }} onClick={openMonthModal}>
                                <Text size="1rem" fw={800} c="dark.8" style={{ lineHeight: 1 }}>
                                    {dateTitle}
                                </Text>
                                <div data-html2canvas-ignore style={{ display: 'flex' }}>
                                    <IconChevronDown size={24} color="#343a40" />
                                </div>
                                <Text size="1rem" fw={500} c="dark.5" style={{ lineHeight: 1 }}>
                                    내가 소비한 감정은?
                                </Text>
                            </Group>
                            <Text size="2.2rem" c="dark.9" fw={900} style={{ letterSpacing: -1, lineHeight: 1 }}>
                                {stats.total.toLocaleString()}원
                            </Text>
                        </div>

                        <Group align="center" justify="center" gap="md" wrap="nowrap" style={{ width: '100%', minHeight: 180 }}>
                            {/* Left: Donut Chart (Interactive) */}
                            <Box style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={48}
                                            outerRadius={70}
                                            paddingAngle={0.5}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                            onMouseEnter={(_: any, index: number) => setHoveredItem(stats.data[index])}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{ cursor: 'pointer', outline: 'none' }}
                                        >
                                            {stats.data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    strokeWidth={0}
                                                    style={{
                                                        filter: hoveredItem?.name === entry.name ? 'brightness(1.1) drop-shadow(0 0 4px rgba(0,0,0,0.2))' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        outline: 'none'
                                                    }}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Mood Face */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MoodFaceIcon score={stats.moodScore} size={90} strokeWidth={1.5} />
                                </div>
                            </Box>

                            {/* Right: Dynamic Info Panel */}
                            <Stack gap={2} align="flex-start" style={{ minWidth: 100 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div
                                        className="emotion-bar"
                                        style={{
                                            width: 4,
                                            height: '1.25rem',
                                            borderRadius: 4,
                                            backgroundColor: displayItem?.color,
                                            transition: 'background-color 0.2s',
                                            flexShrink: 0
                                        }}
                                    />
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: 'var(--mantine-color-dark-8)',
                                        lineHeight: 1,
                                        margin: 0,
                                        padding: 0,
                                        display: 'inline-block'
                                    }}>
                                        {displayItem?.name}
                                    </span>
                                </div>
                                <Text size="1.4rem" c="dark.8" fw={700} style={{ lineHeight: 1 }} ml={14}>
                                    {displayPercent}%
                                </Text>
                                <Text size="xs" c="gray.5" fw={500} ml={14}>
                                    {displayItem?.value.toLocaleString()}원
                                </Text>
                            </Stack>
                        </Group>
                    </Stack>

                    {/* Toggle Button to Thermometer View */}
                    <div data-html2canvas-ignore>
                        <Center pt="sm" style={{ cursor: 'pointer' }} onClick={() => setViewMode('thermometer')}>
                            <Stack gap={2} align="center" style={{ opacity: 0.7, transition: 'opacity 0.2s' }} className="hover:opacity-100">
                                <Text size="xs" c="blue.6" fw={600}>온도계로 볼게요</Text>
                                <ActionIcon
                                    variant="transparent"
                                    color="blue"
                                    size="lg"
                                    className="animate-bounce"
                                >
                                    <IconChevronDown size={20} color="#339af0" />
                                </ActionIcon>
                            </Stack>
                        </Center>
                    </div>

                    {/* Mood Message (Type A) - Capture Only */}
                    <Box className="capture-reveal" pt="xs" style={{ display: 'none' }}>
                        <Text size="sm" c="dark.6" fw={600} ta="center" style={{ wordBreak: 'keep-all' }}>
                            {getMoodMessage(stats.moodScore)}
                        </Text>
                    </Box>
                </Box>

                {/* Section 2: Thermometer View (Bottom) */}
                <Box
                    id="stats-thermometer-view"
                    className="stats-section"
                    style={{
                        height: CONTAINER_HEIGHT,
                        // Gradient blue background for thermometer area
                        background: 'linear-gradient(180deg, #e7f5ff 0%, #d0ebff 100%)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                    p="lg"
                >
                    {/* Thermometer Mode Toggle Button (Top) */}
                    <div data-html2canvas-ignore>
                        <Center pt="sm" style={{ cursor: 'pointer' }} onClick={() => setViewMode('chart')}>
                            <Stack gap={2} align="center" style={{ opacity: 0.7, transition: 'opacity 0.2s' }} className="hover:opacity-100">
                                <ActionIcon
                                    variant="transparent"
                                    color="blue"
                                    size="lg"
                                    className="animate-bounce"
                                >
                                    <IconChevronUp size={20} color="#339af0" />
                                </ActionIcon>
                                <Text size="xs" c="blue.6" fw={600}>차트로 볼게요</Text>
                            </Stack>
                        </Center>
                    </div>

                    <Stack align="center" flex={1} justify="center" pb="lg">
                        <MoodThermometer score={stats.moodScore} />
                    </Stack>
                </Box>

                {/* Poster Footer (Hidden by default) */}
                <Box className="capture-reveal" pb="xl" pt="xs" style={{ display: 'none', background: 'transparent' }}>
                    <div style={{ width: '90%', margin: '8px auto 16px auto', borderBottom: '1.5px dashed #adb5bd', opacity: 0.5 }} />
                    <Center>
                        <Text size="xs" c="gray.5" style={{ letterSpacing: 2 }}>EMOTION ASSET</Text>
                    </Center>
                    <Center>
                        <Text size="xs" c="blue.6" fw={600}>토스 미니앱 '내감정소비'로 내 감정을 공유하세요.</Text>
                    </Center>
                </Box>
            </motion.div>

            {/* Help Modal */}
            <HelpModal opened={helpOpened} onClose={closeHelp} />

            {/* Calendar Modal */}
            <CalendarModal
                opened={calendarOpened}
                onClose={closeCalendar}
                receipts={allReceipts}
                currentDate={selectedDate}
            />

            {/* Alert Modal */}
            <AlertModal opened={alertOpened} onClose={() => setAlertOpened(false)} message={alertMessage} />

            {/* Month Selection Modal */}
            {/* Month Selection Modal */}
            <Modal
                opened={monthModalOpened}
                onClose={closeMonthModal}
                withCloseButton={false}
                centered
                size="sm"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                styles={{
                    body: { padding: 0 }
                }}
            >
                <div
                    ref={scrollContainerRef}
                    onScroll={(e) => {
                        const container = e.currentTarget;
                        // Use debounce or throttle in a real heavy app, but for simple list:
                        // Check center element
                        const containerCenter = container.scrollLeft + container.offsetWidth / 2;

                        // Find closest child
                        const children = Array.from(container.children) as HTMLElement[];
                        // Filter out style tag if present as child (it is!)
                        const monthButtons = children.filter(c => c.tagName === 'BUTTON');

                        let closest: HTMLElement | null = null;
                        let minDiff = Infinity;

                        monthButtons.forEach(btn => {
                            const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
                            const diff = Math.abs(containerCenter - btnCenter);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closest = btn;
                            }
                        });


                        if (closest) {
                            const monthStr = (closest as HTMLElement).dataset.month;
                            // Only update visual state, DO NOT COMMIT
                            if (monthStr && monthStr !== tempSelectedMonth) {
                                setTempSelectedMonth(monthStr);
                            }
                        }
                    }}
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '16px',
                        padding: '32px calc(50% - 65px)', // Symmetric 32px vertical padding
                        scrollSnapType: isSnappingEnabled ? 'x mandatory' : 'none',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                        width: '100%',
                        opacity: isScrollReady ? 1 : 0, // Hide until scrolled
                        transition: 'opacity 0.2s ease',
                    }}
                    className="no-scrollbar"
                >
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {availableMonths && availableMonths.length > 0 ? (
                        availableMonths.map((month) => {
                            const [y, m] = month.split('-');
                            // Check against tempSelectedMonth for visual highlight
                            const isSelected = tempSelectedMonth === month;

                            return (
                                <UnstyledButton
                                    key={month}
                                    data-selected={isSelected}
                                    data-month={month} // For scroll detection
                                    onClick={() => {
                                        setTempSelectedMonth(month);
                                        // Specific User Request: Select immediately on click (no button)
                                        if (onDateChange) {
                                            const [y, m] = month.split('-');
                                            const newDate = new Date(parseInt(y), parseInt(m) - 1, 1);
                                            onDateChange(newDate);
                                            closeMonthModal();
                                        }
                                    }}
                                    style={{
                                        flex: '0 0 auto',
                                        scrollSnapAlign: 'center',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        background: isSelected
                                            ? 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)'
                                            : '#fff',
                                        boxShadow: isSelected
                                            ? '0 8px 24px rgba(51, 154, 240, 0.4)'
                                            : '0 4px 8px rgba(0,0,0,0.05)',
                                        border: isSelected ? 'none' : '1px solid #f1f3f5',
                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                        transform: isSelected ? 'scale(1.15)' : 'scale(0.95)', // Increased scale for pop
                                        opacity: isSelected ? 1 : 0.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '100px',
                                        zIndex: isSelected ? 10 : 1
                                    }}
                                >
                                    <Text size="lg" c={isSelected ? 'white' : 'dark.3'} fw={800} style={{ lineHeight: 1, whiteSpace: 'nowrap' }}>
                                        {y}년 {parseInt(m)}월
                                    </Text>
                                </UnstyledButton>
                            );
                        })
                    ) : (
                        <Text ta="center" c="gray.5" py="xl" w="100%">데이터가 없습니다</Text>
                    )}
                </div>
            </Modal>

            {/* Name Input Modal */}
            <Modal
                opened={nameModalOpened}
                onClose={() => {
                    closeNameModal();
                    setIsDownloading(false);
                }}
                centered
                radius="lg"
                title={<Text fw={800}>이미지에 넣을 이름</Text>}
                padding="xl"
            >
                <Stack gap="md">
                    <Text size="sm" c="gray.6">
                        이미지 상단에 이름을 넣고 싶으면 입력해주세요.
                    </Text>
                    <TextInput
                        placeholder="이름을 입력하세요 (최대 6자)"
                        value={userName}
                        onChange={(e) => setUserName(e.currentTarget.value.slice(0, 6))}
                        size="md"
                        radius="md"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirmName();
                        }}
                    />
                    <Button
                        fullWidth
                        size="md"
                        radius="md"
                        color="blue"
                        onClick={handleConfirmName}
                    >
                        이 문구로 할게요
                    </Button>
                </Stack>
            </Modal>
        </Paper >
    );
}

// Helper for Mood Messages
function getMoodMessage(score: number): string {
    if (score < 20) return "괜찮아요, 내일은 분명 더 좋은 날이 될 거예요.";
    if (score < 40) return "속상했던 마음, 이 영수증과 함께 훌훌 털어버리세요.";
    if (score < 60) return "별일 없는 평범한 하루가 가장 소중한 법이죠.";
    if (score < 80) return "당신의 행복한 미소가 여기까지 느껴지네요!";
    return "더할 나위 없이 완벽한 한 달! 이 느낌 그대로 가요!";
}
