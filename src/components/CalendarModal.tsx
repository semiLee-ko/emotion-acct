"use client";

import { Modal, Box, Text, UnstyledButton, Group } from '@mantine/core'; // Added imports
import { Calendar } from '@mantine/dates';
import { EMOTION_CONFIG, Receipt, EmotionType } from '@/lib/types';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { MoodFaceIcon } from './MoodThermometer';

interface Props {
    opened: boolean;
    onClose: () => void;
    receipts: Receipt[];
    currentDate?: Date;
}

export function CalendarModal({ opened, onClose, receipts, currentDate }: Props) {
    // State for calendar navigation
    // We lock the date to currentDate if provided, otherwise default to now
    const displayDate = currentDate || new Date();

    // Calculate daily mood score (0-100) per day
    const dailyScores = useMemo(() => {
        const map: Record<string, number> = {}; // 'YYYY-MM-DD' -> score (0-100)

        // 1. Group receipts by date
        const grouped: Record<string, Receipt[]> = {};

        receipts.forEach(r => {
            const d = new Date(r.date);
            const key = dayjs(d).format('YYYY-MM-DD');
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(r);
        });

        // 2. Calculate score for each day
        Object.entries(grouped).forEach(([dateKey, dailyReceipts]) => {
            const total = dailyReceipts.reduce((acc, cur) => acc + cur.amount, 0);

            const byEmotion = dailyReceipts.reduce((acc, cur) => {
                acc[cur.emotion] = (acc[cur.emotion] || 0) + cur.amount;
                return acc;
            }, {} as Record<EmotionType, number>);

            // Calculate Score (Logic matched with StatsView)
            let score = 50;
            if (total > 0) {
                const positive = (byEmotion['CONGRATULATIONS'] || 0) + (byEmotion['LOVE'] || 0) + (byEmotion['GROWTH'] || 0);
                const negative = (byEmotion['STRESS'] || 0) + (byEmotion['EMERGENCY'] || 0) + (byEmotion['COMFORT'] || 0);

                const posRatio = positive / total;
                const negRatio = negative / total;

                score = 50 + (posRatio * 50) - (negRatio * 50);
            }

            map[dateKey] = Math.round(score);
        });

        return map;
    }, [receipts]);


    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            centered
            size="auto" // Let content define size, but max-width comes from screen
            radius={24}
            padding="lg" // Restore generous padding
            styles={{
                content: {
                    overflow: 'hidden',
                    maxWidth: '90vw', // Ensure it doesn't touch screen edges
                },
                body: {
                    padding: 0,
                    paddingTop: 24,
                    paddingBottom: 24
                }
            }}
        >
            <Group justify="flex-end" mb="xs" style={{ width: '100%' }}>
                <UnstyledButton
                    onClick={onClose}
                    aria-label="닫기"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 20
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </UnstyledButton>
            </Group>

            <Box style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}>
                <Calendar
                    size="md"
                    date={displayDate}
                    onDateChange={() => { }}
                    renderDay={(date) => {
                        const dateKey = dayjs(date).format('YYYY-MM-DD');
                        const score = dailyScores[dateKey];
                        const dayNum = dayjs(date).date();
                        const hasScore = typeof score === 'number';

                        return (
                            <Box
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    borderRadius: '8px',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Text
                                    size="xs"
                                    c={hasScore ? "dark.3" : "dark.9"}
                                    fw={500}
                                    style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: 4,
                                        fontSize: '0.65rem',
                                        opacity: hasScore ? 0.6 : 1,
                                        zIndex: 1
                                    }}
                                >
                                    {dayNum}
                                </Text>

                                {hasScore && (
                                    <Box style={{ marginTop: 16 }}>
                                        <MoodFaceIcon score={score} size={24} strokeWidth={1.5} />
                                    </Box>
                                )}
                            </Box>
                        );
                    }}
                    styles={{
                        calendarHeader: { maxWidth: '100%', marginBottom: 12 },
                        calendarHeaderControl: { display: 'none' },
                        calendarHeaderLevel: {
                            pointerEvents: 'none',
                            color: '#212529',
                            fontWeight: 700,
                            fontSize: '1.2rem'
                        },
                        day: {
                            borderRadius: 8,
                            width: '100%',     // Fluid width
                            maxWidth: '42px',  // Check against huge screens
                            height: 'auto',    // Fluid height based on aspect ratio
                            aspectRatio: '1',  // Keep square
                            margin: '0 auto',  // Center in cell if smaller than max
                        },
                        month: {
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '2px'
                        }
                    }}
                />
            </Box>

            <Text size="xs" c="gray.5" ta="center" mt="lg" mb={0}>
                해당 날짜의 감정 온도가 표시됩니다.
            </Text>
        </Modal>
    );
}
