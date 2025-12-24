import { Modal, Text, Group, Button } from '@mantine/core';

interface ConfirmModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
}

export function ConfirmModal({ opened, onClose, onConfirm, title = "확인", message }: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="md" c="dark.9">{title}</Text>}
            centered
            size="sm"
            radius={16}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 4,
            }}
        >
            <Text size="sm" mb="lg" c="dark.7">
                {message}
            </Text>

            <Group justify="flex-end" gap="sm">
                <Button
                    variant="subtle"
                    color="gray"
                    onClick={onClose}
                    radius="md"
                >
                    취소
                </Button>
                <Button
                    onClick={handleConfirm}
                    radius="md"
                    color="red"
                >
                    확인
                </Button>
            </Group>
        </Modal>
    );
}
