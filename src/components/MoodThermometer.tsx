"use client";

import { Box, Text, Group, Stack } from '@mantine/core';
import { motion } from 'framer-motion';

interface Props {
    score: number; // 0 to 100
}

// 1. Reusable Icon Component for consistent rendering
export function MoodFaceIcon({ score, size = 24, color: overrideColor, strokeWidth = 2 }: { score: number, size?: number, color?: string, strokeWidth?: number }) {
    // 5-step Color logic
    const getColor = (s: number) => {
        if (s < 20) return '#fa5252'; // Red (0-19)
        if (s < 40) return '#ff922b'; // Orange (20-39)
        if (s < 60) return '#fab005'; // Yellow (40-59)
        if (s < 80) return '#51cf66'; // Green (60-79)
        return '#339af0'; // Blue (80-100)
    };

    const color = overrideColor || getColor(score);

    // 0: Crying (New: Outer corners down, Inner corners up / \)
    if (score < 20) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
                {/* Sad Eyes: / \ (Inner High, Outer Low) */}
                <path d="M8 11 L10 10" stroke="white" />  {/* Left Eye */}
                <path d="M14 10 L16 11" stroke="white" /> {/* Right Eye */}

                {/* Wobbly Wailing Mouth */}
                <path d="M9 15 Q 12 13 15 15" stroke="white" />
            </svg>
        );
    }
    // 25: Angry (Existing: Inner Low, Outer High \ /)
    if (score < 40) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
                {/* Angry eyebrows/eyes: \ / */}
                <path d="M8 10 L10 11" stroke="white" />
                <path d="M16 10 L14 11" stroke="white" />
                {/* Straightish sad mouth */}
                <path d="M9 15 L15 15" stroke="white" />
            </svg>
        );
    }
    // 50: Neutral / Soso (Existing)
    if (score < 60) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
                {/* Flat mouth */}
                <path d="M8 14 L16 14" stroke="white" />
                {/* Dot eyes */}
                <circle cx="9" cy="9" r="1.5" fill="white" stroke="none" />
                <circle cx="15" cy="9" r="1.5" fill="white" stroke="none" />
            </svg>
        );
    }
    // 75: Smile / Good (Clearer eyes)
    if (score < 80) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
                {/* Smile */}
                <path d="M8 13 C8 13 10 15 12 15 C14 15 16 13 16 13" stroke="white" />
                {/* Open Eyes */}
                <circle cx="9" cy="9" r="1.5" fill="white" stroke="none" />
                <circle cx="15" cy="9" r="1.5" fill="white" stroke="none" />
            </svg>
        );
    }
    // 100: Big Grin / Cool (Visible eyes)
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
            {/* Big Grin */}
            <path d="M8 13 C8 13 9.5 16 12 16 C14.5 16 16 13 16 13" stroke="white" />
            <path d="M8 13 L16 13" stroke="white" />
            {/* Happy Eyes (Arches) - Wider and Happier */}
            <path d="M7.5 9.5 C8.2 7.8 9.8 7.8 10.5 9.5" stroke="white" />
            <path d="M13.5 9.5 C14.2 7.8 15.8 7.8 16.5 9.5" stroke="white" />
        </svg>
    );
}

export function MoodThermometer({ score }: Props) {
    // Shared color logic for consistency
    const getColor = (s: number) => {
        if (s < 20) return '#fa5252'; // Red
        if (s < 40) return '#ff922b'; // Orange
        if (s < 60) return '#fab005'; // Yellow
        if (s < 80) return '#51cf66'; // Green
        return '#339af0'; // Blue
    };

    const color = getColor(score);
    const CONTAINER_HEIGHT = 240;

    // Scale Icons (Right Side)
    const SCALE_ICONS = [
        { val: 100, color: '#339af0' },
        { val: 75, color: '#51cf66' },
        { val: 50, color: '#fab005' },
        { val: 25, color: '#ff922b' },
        { val: 0, color: '#fa5252' },
    ];

    // Internal Ticks Generation (0 to 100 step 5)
    // We render them bottom-up
    const ticks = [];
    for (let i = 0; i <= 100; i += 5) {
        ticks.push(i);
    }

    return (
        <Stack align="center" gap="md" py="xl" style={{ width: '100%' }}>

            <Box style={{ position: 'relative', width: 280, height: CONTAINER_HEIGHT }}>

                {/* 1. Floating Indicator on the LEFT */}
                <motion.div
                    initial={{ bottom: '0%' }}
                    animate={{ bottom: `${score}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15, duration: 1.5 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: 'calc(100% - 100px)', // Occupy left space up to thermometer
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        zIndex: 10,
                        transform: 'translateY(50%)' // Center vertically on the line
                    }}
                >
                    {/* Face Icon - Enlarged to 2x (approx 60px) */}
                    <div style={{ marginRight: 12 }}>
                        <MoodFaceIcon score={score} size={60} strokeWidth={1.5} />
                    </div>

                    {/* Connecting Dashed Line */}
                    <div style={{
                        flex: 1,
                        height: 0,
                        borderTop: '2px dashed #adb5bd',
                        opacity: 0.6
                    }} />
                </motion.div>


                {/* 2. Thermometer Group on the RIGHT */}
                <Group
                    align="flex-start"
                    gap={0}
                    style={{
                        position: 'absolute',
                        right: 0,
                        height: '100%'
                    }}
                >
                    <Box style={{ position: 'relative', width: 80, height: CONTAINER_HEIGHT }}>
                        {/* Thermometer container */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: '#f1f3f5',
                                borderRadius: 999,
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                zIndex: 1,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Internal Ticks Layer (On top of background, visible inside tube) */}
                            <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
                                {ticks.map(tickVal => {
                                    const isMajor = tickVal % 25 === 0;
                                    return (
                                        <div
                                            key={tickVal}
                                            style={{
                                                position: 'absolute',
                                                bottom: `${tickVal}%`,
                                                right: 0, // Align to right
                                                width: isMajor ? 40 : 20, // Wide for major, narrow for minor
                                                height: 1, // Thin line
                                                backgroundColor: 'white',
                                                opacity: isMajor ? 0.9 : 0.5,
                                                marginBottom: -0.5 // Center on the % line
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Liquid Fill */}
                            <motion.div
                                initial={{ height: '0%' }}
                                animate={{ height: `${score}%` }}
                                transition={{
                                    type: "spring",
                                    stiffness: 60,
                                    damping: 15,
                                    duration: 1.5
                                }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: `linear-gradient(to top, ${color}cc, ${color})`,
                                    borderRadius: '0 0 999px 999px',
                                    zIndex: 2 // Below ticks? Actually ticks are zIndex 5, so ticks are ON TOP of liquid
                                }}
                                className="thermometer-liquid"
                                data-color={color}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, opacity: 0.3, background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                            </motion.div>
                        </div>
                    </Box>

                    {/* Scale Marks (Icons Only, Removed lines) */}
                    <div style={{
                        height: CONTAINER_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        marginLeft: 12,
                        paddingTop: 8,
                        paddingBottom: 8
                    }}>
                        {SCALE_ICONS.map((mark) => (
                            <div key={mark.val} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                {/* Icon container only - removed the line div */}
                                <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                                    <MoodFaceIcon score={mark.val} size={24} color={mark.color} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Group>
            </Box>

            {/* Big Temperature Text */}
            <div style={{ textAlign: 'center' }}>
                <Text size="3rem" fw={800} style={{ color: color, lineHeight: 1, transform: 'translate(10px, -10px)' }}>
                    {score}°
                </Text>
                <Text size="sm" c="gray.5" fw={500} mt={4} className="mood-temp-label">
                    현재 감정 온도
                </Text>
            </div>
        </Stack>
    );
}
