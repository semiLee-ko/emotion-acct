"use client";

import { Paper, Text, Group, ActionIcon, Box } from '@mantine/core';
import { EMOTION_CONFIG, Receipt } from '@/lib/types';
import { motion, useAnimation } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { EmotionIcon } from './EmotionIcon';
import { ConfirmModal } from './ConfirmModal';

interface Props {
    receipt: Receipt;
    onDelete?: (id: string) => void;
    onEdit?: (step: number) => void;
}

// Scissors SVG Icon Component
const ScissorsIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
);

export const ReceiptItem = forwardRef<HTMLDivElement, Props>(({ receipt, onDelete, onEdit }, ref) => {
    const emotionData = EMOTION_CONFIG[receipt.emotion];
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmOpened, setConfirmOpened] = useState(false);
    const topControls = useAnimation();
    const bottomControls = useAnimation();
    const scissorsControls = useAnimation();

    // Format Number (KRW)
    const formattedAmount = new Intl.NumberFormat('ko-KR').format(receipt.amount);

    // Format Date - Receipt Style (YY.MM.DD HH:mm)
    const formatDate = (date: Date) => {
        const year = date.getFullYear().toString().slice(2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const handleDeleteClick = () => {
        setConfirmOpened(true);
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;

        setIsDeleting(true);

        // Cutting animation
        await Promise.all([
            topControls.start({
                y: -100,
                rotate: -5,
                opacity: 0,
                transition: { duration: 0.5, ease: 'easeIn' }
            }),
            bottomControls.start({
                y: 100,
                rotate: 5,
                opacity: 0,
                transition: { duration: 0.5, ease: 'easeIn' }
            }),
            scissorsControls.start({
                x: 300,
                opacity: 0,
                transition: { duration: 0.5, ease: 'easeIn' }
            })
        ]);

        onDelete(receipt.id);
    };

    const handleEdit = (step: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        onEdit?.(step);
    }

    return (
        <>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="receipt-card w-full max-w-sm mx-auto mb-5 relative"
                data-deleting={isDeleting}
                onClick={() => handleEdit(0)} // Default to Step 1 (Emotion)
                style={{ cursor: onEdit ? 'pointer' : 'default' }}
            >
                {/* Shadow Wrapper - Applies shadow to the shape of children */}
                <div style={{ filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))' }}>
                    <div
                        className="relative overflow-visible"
                        style={{
                            background: '#FFFFFF',
                            clipPath: isDeleting ? 'none' : 'polygon(0% 4%, 2% 0%, 4% 4%, 6% 0%, 8% 4%, 10% 0%, 12% 4%, 14% 0%, 16% 4%, 18% 0%, 20% 4%, 22% 0%, 24% 4%, 26% 0%, 28% 4%, 30% 0%, 32% 4%, 34% 0%, 36% 4%, 38% 0%, 40% 4%, 42% 0%, 44% 4%, 46% 0%, 48% 4%, 50% 0%, 52% 4%, 54% 0%, 56% 4%, 58% 0%, 60% 4%, 62% 0%, 64% 4%, 66% 0%, 68% 4%, 70% 0%, 72% 4%, 74% 0%, 76% 4%, 78% 0%, 80% 4%, 82% 0%, 84% 4%, 86% 0%, 88% 4%, 90% 0%, 92% 4%, 94% 0%, 96% 4%, 98% 0%, 100% 4%, 100% 96%, 98% 100%, 96% 96%, 94% 100%, 92% 96%, 90% 100%, 88% 96%, 86% 100%, 84% 96%, 82% 100%, 80% 96%, 78% 100%, 76% 96%, 74% 100%, 72% 96%, 70% 100%, 68% 96%, 66% 100%, 64% 96%, 62% 100%, 60% 96%, 58% 100%, 56% 96%, 54% 100%, 52% 96%, 50% 100%, 48% 96%, 46% 100%, 44% 96%, 42% 100%, 40% 96%, 38% 100%, 36% 96%, 34% 100%, 32% 96%, 30% 100%, 28% 96%, 26% 100%, 24% 96%, 22% 100%, 20% 96%, 18% 100%, 16% 96%, 14% 100%, 12% 96%, 10% 100%, 8% 96%, 6% 100%, 4% 96%, 2% 100%, 0% 96%)',
                        }}
                    >
                        {/* Top Half */}
                        <motion.div animate={topControls} style={{ originY: 1 }}>
                            <Box p="md" pb="xs">
                                {/* Receipt Header - Store Name (Left) and Date (Right) */}
                                <Group justify="space-between" align="start" mb="xs">
                                    <Text
                                        size="xs"
                                        fw={700}
                                        c="dark.7"
                                        tt="uppercase"
                                        style={{
                                            letterSpacing: '1.5px',
                                            fontSize: '11px'
                                        }}
                                    >
                                        EMOTION STORE
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="gray.7"
                                        onClick={(e) => handleEdit(3, e)}
                                        style={{
                                            fontSize: '13px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {formatDate(receipt.date)}
                                    </Text>
                                </Group>

                                {/* Emotion Icon + Note - Horizontal Layout */}
                                <Group gap="sm" mb="xs" wrap="nowrap" align="start">
                                    <Box
                                        style={{ flexShrink: 0, paddingTop: 2, cursor: 'pointer' }}
                                        onClick={(e) => handleEdit(0, e)}
                                    >
                                        <EmotionIcon
                                            type={receipt.emotion}
                                            size={40}
                                            color={emotionData.color}
                                        />
                                    </Box>

                                    <Box
                                        py={6}
                                        px="xs"
                                        onClick={(e) => handleEdit(2, e)}
                                        style={{
                                            borderLeft: '1px solid #dee2e6',
                                            paddingLeft: '12px',
                                            marginLeft: '4px',
                                            flex: 1,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Text
                                            size="sm"
                                            fw={500}
                                            c="dark.9"
                                            lineClamp={2}
                                            style={{
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {receipt.note}
                                        </Text>
                                    </Box>
                                </Group>
                            </Box>
                        </motion.div>

                        {/* Dashed Cut Line */}
                        {/* Dashed Cut Line Area */}
                        <Box
                            py={4}
                            style={{ position: 'relative', cursor: onDelete ? 'pointer' : 'default' }}
                            onClick={onDelete ? (e) => { e.stopPropagation(); handleDeleteClick(); } : undefined} // Updated this to stop propagation
                            className="cut-line-area"
                        >
                            <div
                                className="w-full border-t border-dashed mx-auto"
                                style={{
                                    width: 'calc(100% - 24px)',
                                    marginLeft: 12,
                                    marginRight: 12,
                                    borderColor: '#E0E0E0',
                                    transition: 'border-color 0.2s ease'
                                }}
                            />
                            {onDelete && (
                                <motion.div
                                    animate={scissorsControls}
                                    className="scissors-btn"
                                    style={{
                                        position: 'absolute',
                                        left: 12,
                                        top: '50%',
                                        y: '-50%',
                                        zIndex: 10,
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="sm"
                                        style={{
                                            background: '#fff',
                                            boxShadow: '0 0 0 4px #fff' // White border to mask line
                                        }}
                                    >
                                        <ScissorsIcon size={14} />
                                    </ActionIcon>
                                </motion.div>
                            )}
                        </Box>

                        {/* Bottom Half */}
                        <motion.div animate={bottomControls} style={{ originY: 0 }}>
                            <Box p="md" pt="xs" style={{ position: 'relative' }}>
                                {/* Amount Section - Single Line */}
                                <Group
                                    justify="space-between"
                                    mb="sm"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => handleEdit(1, e)}
                                >
                                    <Text size="xs" c="dark.6" fw={600} style={{ fontSize: '11px' }}>PRICE</Text>
                                    <Text
                                        fw={800}
                                        c="dark.9"
                                        style={{
                                            letterSpacing: '-0.5px',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ₩ {formattedAmount}
                                    </Text>
                                </Group>

                                {/* Receipt Footer */}
                                <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '8px' }}>
                                    <Text
                                        size="10px"
                                        c="gray.5"
                                        ta="center"
                                        mt={2}
                                        style={{
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        감정영수증
                                    </Text>
                                </div>
                            </Box>
                        </motion.div>
                    </div>
                </div>

                {/* Hover CSS */}
                <style>{`
                    .receipt-card:not([data-deleting="true"]):hover .scissors-btn {
                        opacity: 1 !important;
                    }
                    .cut-line-area:hover .scissors-btn {
                        color: #fa5252 !important;
                    }
                    .cut-line-area:hover div {
                        border-color: #fa5252 !important;
                    }
                    .scissors-btn {
                        opacity: 0;
                        transition: opacity 0.2s ease, color 0.2s ease;
                    }
                `}</style>
            </motion.div>

            {/* Confirm Modal */}
            <ConfirmModal
                opened={confirmOpened}
                onClose={() => setConfirmOpened(false)}
                onConfirm={handleConfirmDelete}
                title="영수증 삭제"
                message="이 영수증을 버릴까요?"
            />
        </>
    );
});
ReceiptItem.displayName = 'ReceiptItem';
