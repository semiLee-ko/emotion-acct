"use client";

import { Modal, Button, TextInput, Group, Text, Stack, Box, UnstyledButton, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { EMOTION_CONFIG, EmotionType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { EmotionIcon } from './EmotionIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: { amount: number; emotion: EmotionType; note: string; date: Date }) => void;
    initialValues?: { amount: number; emotion: EmotionType; note: string; date: Date };
    initialStep?: number;
    isEditMode?: boolean;
}

export function AddReceiptModal({ opened, onClose, onSubmit, initialValues, initialStep = 0, isEditMode = false }: Props) {
    const emotions = Object.keys(EMOTION_CONFIG) as EmotionType[];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [step, setStep] = useState(0); // 0: Emotion, 1: Amount, 2: Note, 3: Date
    const [direction, setDirection] = useState(0);

    const form = useForm({
        initialValues: {
            amount: '',
            note: '',
            date: new Date(),
        },
        validate: {
            amount: (value) => {
                if (step === 1) { // Validate only on amount step
                    if (!value || value.trim() === '') return '금액을 입력해주세요';
                    const num = parseInt(value.replace(/,/g, ''));
                    if (isNaN(num) || num <= 0) return '금액을 입력해주세요';
                    if (num > 9999999999) return '너무 큰 금액은 입력할 수 없어요';
                    return null;
                }
                return null;
            },
            note: (value) => {
                if (step === 2) { // Validate only on note step
                    if (value.length === 0) return '메모를 입력해주세요';
                    if (!/^[가-힣a-zA-Z0-9\s]+$/.test(value)) return '한글, 영문, 숫자만 입력 할 수 있어요';
                    return null;
                }
                return null;
            },
            date: (value) => {
                if (step === 3) { // Validate only on date step
                    if (!value) return '날짜를 선택해주세요';

                    const selected = new Date(value);
                    selected.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selected > today) return '오늘 이후 날짜는 입력할 수 없어요';
                    return null;
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (opened) {
            if (initialValues) {
                form.setValues({
                    amount: initialValues.amount.toLocaleString('ko-KR'),
                    note: initialValues.note,
                    date: initialValues.date,
                });
                const emotionIndex = emotions.indexOf(initialValues.emotion);
                if (emotionIndex !== -1) setSelectedIndex(emotionIndex);
            } else {
                form.reset();
                setSelectedIndex(0);
                form.setFieldValue('date', new Date()); // Ensure date is fresh
            }
            setStep(initialStep);
        }
    }, [opened, initialValues, initialStep]);

    const handleNextEmotion = () => {
        if (selectedIndex < emotions.length - 1) {
            setDirection(1);
            setSelectedIndex(prev => prev + 1);
        }
    };

    const handlePrevEmotion = () => {
        if (selectedIndex > 0) {
            setDirection(-1);
            setSelectedIndex(prev => prev - 1);
        }
    };

    // Step Navigation
    const handleEmotionSelect = () => {
        setStep(1);
    };

    const handleAmountNext = () => {
        const error = form.validateField('amount');
        if (!error.hasError) {
            setStep(2);
        }
    };

    const handleNoteNext = () => {
        const error = form.validateField('note');
        if (!error.hasError) {
            setStep(3);
        }
    };

    const handleSubmit = (values: typeof form.values) => {
        const error = form.validateField('date');
        if (error.hasError) return;

        const amount = parseInt(values.amount.replace(/,/g, ''));
        onSubmit({
            amount,
            emotion: emotions[selectedIndex],
            note: values.note,
            date: values.date,
        });
        resetModal();
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const resetModal = () => {
        form.reset();
        setStep(0);
        setSelectedIndex(0);
        onClose();
    };

    const formatAmount = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return '';
        return parseInt(numbers).toLocaleString('ko-KR');
    };

    const selectedEmotion = emotions[selectedIndex];
    const emotionConfig = EMOTION_CONFIG[selectedEmotion];

    // Carousel Variants
    const cardVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? 45 : -45,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? -45 : 45,
        }),
    };

    // Step Transition Variants
    const stepVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    // Header Title
    const getTitle = () => {
        switch (step) {
            case 0: return "오늘의 감정을 선택하세요.";
            case 1: return "금액은 얼마나 되나요?";
            case 2: return "구매한 이유는 뭔가요?";
            case 3: return "언제 구매했나요?";
            default: return "";
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={resetModal}
            withCloseButton={false}
            centered
            size="lg"
            radius={24}
            aria-labelledby="modal-title" // Accessibility: Link title
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 6,
            }}
            styles={{
                content: {
                    background: 'linear-gradient(135deg, #FAFBFC 0%, #F8F9FA 100%)',
                    overflowY: 'auto',
                    maxHeight: '90vh',
                },
                body: {
                    position: 'relative',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: 20
                }
            }}
        >
            <Group gap="xs" align="center" mb="lg" style={{ width: '100%', position: 'relative', justifyContent: 'center', height: 44, flexShrink: 0 }}>
                {step > 0 && (
                    <UnstyledButton
                        onClick={handleBack}
                        aria-label="이전 단계" // Accessibility
                        style={{
                            position: 'absolute',
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill={emotionConfig.color} />
                            <path d="M14 8l-4 4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </UnstyledButton>
                )}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Text
                            size="lg"
                            fw={700}
                            c="dark.8"
                            id="modal-title" // Accessibility: Title ID
                        >
                            {getTitle()}
                        </Text>
                    </motion.div>
                </AnimatePresence>

                <UnstyledButton
                    onClick={resetModal}
                    aria-label="닫기" // Accessibility
                    style={{
                        position: 'absolute',
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 20,
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </UnstyledButton>
            </Group>

            {/* Content Area with smooth height animation */}
            <motion.div
                animate={{ height: 'auto' }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
                style={{ overflow: 'hidden', position: 'relative' }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <Stack gap="xl" align="center" style={{ width: '100%' }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: 320,
                                    margin: '0 auto',
                                    height: 160,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    perspective: '1000px',
                                }}>
                                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                        <motion.div
                                            key={selectedIndex}
                                            custom={direction}
                                            variants={cardVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 400, damping: 35 },
                                                opacity: { duration: 0.15 },
                                                scale: { duration: 0.15 },
                                                rotateY: { duration: 0.2 }
                                            }}
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={1}
                                            onDragEnd={(e, { offset, velocity }) => {
                                                const swipe = Math.abs(offset.x) * velocity.x;
                                                if (swipe < -10000) {
                                                    handleNextEmotion();
                                                } else if (swipe > 10000) {
                                                    handlePrevEmotion();
                                                }
                                            }}
                                            onClick={handleEmotionSelect}
                                            role="button" // Accessibility
                                            aria-label={`${emotionConfig.label} 선택됨`} // Accessibility
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Box
                                                p="md"
                                                style={{
                                                    height: '100%',
                                                    background: `linear-gradient(50deg, #00000002 10%, ${emotionConfig.color}20 100%)`,
                                                    borderRadius: 24,
                                                    border: '1px solid #e9ecef',
                                                    textAlign: 'center',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Box p="xs" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 16
                                                }}>
                                                    <Box style={{ flexShrink: 0 }}>
                                                        <EmotionIcon type={selectedEmotion} size={84} color={emotionConfig.color} />
                                                    </Box>

                                                    <Text size="lg" fw={800} c={emotionConfig.color} style={{ fontSize: '1.25rem' }}>
                                                        {emotionConfig.label}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Navigation Buttons - Positioned relative to constrained container */}
                                    {selectedIndex > 0 && (
                                        <UnstyledButton
                                            onClick={(e) => { e.stopPropagation(); handlePrevEmotion(); }}
                                            aria-label="이전 감정" // Accessibility
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                zIndex: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 56,
                                                height: '100%',
                                            }}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </UnstyledButton>
                                    )}

                                    {selectedIndex < emotions.length - 1 && (
                                        <UnstyledButton
                                            onClick={(e) => { e.stopPropagation(); handleNextEmotion(); }}
                                            aria-label="다음 감정" // Accessibility
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                zIndex: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 56,
                                                height: '100%',
                                            }}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </UnstyledButton>
                                    )}
                                </div>

                                {/* Dots */}
                                <Group justify="center" gap={6} role="tablist">
                                    {emotions.map((_, idx) => (
                                        <div
                                            key={idx}
                                            role="tab" // Accessibility
                                            aria-selected={idx === selectedIndex} // Accessibility
                                            aria-label={`${emotions[idx]} 감정`} // Accessibility
                                            style={{
                                                width: idx === selectedIndex ? 20 : 6,
                                                height: 6,
                                                borderRadius: 3,
                                                background: idx === selectedIndex ? emotionConfig.color : '#e9ecef',
                                                transition: 'all 0.3s ease',
                                            }}
                                        />
                                    ))}
                                </Group>
                            </Stack>
                        </motion.div>
                    )}

                    {/* Step 1: Amount Input */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <Stack gap="xl">
                                <TextInput
                                    placeholder="0"
                                    aria-label="금액 입력" // Accessibility
                                    size="xl"
                                    radius="md"
                                    value={form.values.amount}
                                    onChange={(e) => {
                                        const numbers = e.target.value.replace(/\D/g, '');
                                        if (numbers && parseInt(numbers) > 9999999999) return;
                                        const formatted = formatAmount(e.target.value);
                                        form.setFieldValue('amount', formatted);
                                    }}
                                    rightSection={<Text size="md" c="dimmed" mr="sm">원</Text>}
                                    styles={{
                                        input: {
                                            fontWeight: 700,
                                            fontSize: '2rem',
                                            textAlign: 'right',
                                            height: '70px',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: `2px solid ${emotionConfig.color}`,
                                            borderRadius: 0,
                                            padding: 0,
                                            paddingRight: '60px'
                                        },
                                        section: {
                                            pointerEvents: 'none'
                                        }
                                    }}
                                    error={form.errors.amount}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAmountNext();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleAmountNext}
                                    fullWidth
                                    size="xl"
                                    radius="md"
                                    style={{
                                        background: emotionConfig.color,
                                        fontWeight: 700,
                                    }}
                                >
                                    다음
                                </Button>
                            </Stack>
                        </motion.div>
                    )}

                    {/* Step 2: Note Input */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <Stack gap="xl">
                                <TextInput
                                    placeholder="예: 자기계발 도서 구매"
                                    aria-label="구매 사유 입력" // Accessibility
                                    maxLength={50}
                                    size="xl"
                                    radius="md"
                                    styles={{
                                        input: {
                                            fontWeight: 500,
                                            fontSize: '1.1rem',
                                            textAlign: 'left',
                                            height: '60px',
                                            background: '#f8f9fa',
                                            border: '1px solid #e9ecef',
                                            paddingLeft: '16px'
                                        }
                                    }}
                                    {...form.getInputProps('note')}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleNoteNext();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleNoteNext}
                                    fullWidth
                                    size="xl"
                                    radius="md"
                                    style={{
                                        background: emotionConfig.color,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        boxShadow: `0 4px 16px ${emotionConfig.color}50`,
                                    }}
                                >
                                    다음
                                </Button>
                            </Stack>
                        </motion.div>
                    )}

                    {/* Step 3: Date Input */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
                                <Stack gap="xl">
                                    <Group align="flex-start" style={{ width: '100%' }}>
                                        <Select
                                            placeholder="년"
                                            aria-label="년도 선택" // Accessibility
                                            data={Array.from({ length: 10 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return { value: year.toString(), label: `${year}년` };
                                            })}
                                            value={form.values.date.getFullYear().toString()}
                                            onChange={(value) => {
                                                if (value) {
                                                    const newYear = parseInt(value);
                                                    let newDate = new Date(form.values.date);
                                                    newDate.setFullYear(newYear);

                                                    // Clamp Day for validity
                                                    const daysInMonth = new Date(newYear, newDate.getMonth() + 1, 0).getDate();
                                                    if (newDate.getDate() > daysInMonth) {
                                                        newDate.setDate(daysInMonth);
                                                    }

                                                    form.setFieldValue('date', newDate);
                                                }
                                            }}
                                            size="lg"
                                            radius="md"
                                            allowDeselect={false}
                                            withCheckIcon={false}
                                            style={{ flex: 1.4 }}
                                            styles={{
                                                input: {
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    textAlign: 'center',
                                                    background: '#f8f9fa',
                                                    border: '1px solid #e9ecef',
                                                    color: '#212529',
                                                    paddingRight: '24px',
                                                    paddingLeft: '4px'
                                                },
                                                option: {
                                                    textAlign: 'right',
                                                    fontWeight: 600,
                                                    color: '#212529',
                                                    fontSize: '0.9rem',
                                                    padding: '8px 12px'
                                                },
                                                section: {
                                                    width: '24px'
                                                }
                                            }}
                                        />
                                        <Select
                                            placeholder="월"
                                            aria-label="월 선택" // Accessibility
                                            data={Array.from({ length: 12 }, (_, i) => {
                                                const month = i + 1;
                                                return { value: month.toString(), label: `${month}월` };
                                            })}
                                            value={(form.values.date.getMonth() + 1).toString()}
                                            onChange={(value) => {
                                                if (value) {
                                                    const newMonth = parseInt(value);
                                                    let newDate = new Date(form.values.date);
                                                    newDate.setMonth(newMonth - 1);

                                                    // Clamp Day for validity
                                                    const daysInMonth = new Date(newDate.getFullYear(), newMonth, 0).getDate();
                                                    if (newDate.getDate() > daysInMonth) {
                                                        newDate.setDate(daysInMonth);
                                                    }

                                                    form.setFieldValue('date', newDate);
                                                }
                                            }}
                                            size="lg"
                                            radius="md"
                                            allowDeselect={false}
                                            withCheckIcon={false}
                                            style={{ flex: 1 }}
                                            styles={{
                                                input: {
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    textAlign: 'center',
                                                    background: '#f8f9fa',
                                                    border: '1px solid #e9ecef',
                                                    color: '#212529',
                                                    paddingRight: '24px',
                                                    paddingLeft: '4px'
                                                },
                                                option: {
                                                    textAlign: 'right',
                                                    fontWeight: 600,
                                                    color: '#212529',
                                                    fontSize: '0.9rem',
                                                    padding: '8px 12px'
                                                },
                                                section: {
                                                    width: '24px'
                                                }
                                            }}
                                        />
                                        <Select
                                            placeholder="일"
                                            aria-label="일 선택" // Accessibility
                                            data={Array.from({ length: 31 }, (_, i) => {
                                                const day = i + 1;
                                                const date = form.values.date;

                                                // Check max days in month
                                                const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                                                if (day > daysInMonth) return null;

                                                return { value: day.toString(), label: `${day}일` };
                                            }).filter((item): item is { value: string; label: string } => item !== null)}
                                            value={form.values.date.getDate().toString()}
                                            onChange={(value) => {
                                                if (value) {
                                                    const newDate = new Date(form.values.date);
                                                    newDate.setDate(parseInt(value));
                                                    form.setFieldValue('date', newDate);
                                                }
                                            }}
                                            size="lg"
                                            radius="md"
                                            allowDeselect={false}
                                            withCheckIcon={false}
                                            style={{ flex: 1 }}
                                            styles={{
                                                input: {
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    textAlign: 'center',
                                                    background: '#f8f9fa',
                                                    border: '1px solid #e9ecef',
                                                    color: '#212529',
                                                    paddingRight: '24px',
                                                    paddingLeft: '4px'
                                                },
                                                option: {
                                                    textAlign: 'right',
                                                    fontWeight: 600,
                                                    color: '#212529',
                                                    fontSize: '0.9rem',
                                                    padding: '8px 12px'
                                                },
                                                section: {
                                                    width: '24px'
                                                }
                                            }}
                                        />
                                    </Group>
                                    {form.errors.date && (
                                        <Text c="red" size="sm" ta="center" mt={-10}>
                                            {form.errors.date}
                                        </Text>
                                    )}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="xl"
                                        radius="md"
                                        style={{
                                            background: emotionConfig.color,
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            boxShadow: `0 4px 16px ${emotionConfig.color}50`,
                                        }}
                                    >
                                        {isEditMode ? "수정" : "등록"}
                                    </Button>
                                </Stack>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div >
        </Modal >
    );
}
