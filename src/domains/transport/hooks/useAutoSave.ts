import { useEffect, useRef, useCallback } from 'react';
import { logger } from '../utils/logger';

interface AutoSaveOptions {
    delay?: number;
    enabled?: boolean;
    onSave: () => void | Promise<void>;
}

export function useAutoSave<T extends readonly unknown[]>(
    dependencies: T,
    { delay = 5000, enabled = true, onSave }: AutoSaveOptions
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isSavingRef = useRef(false);

    const scheduleSave = useCallback(() => {
        if (!enabled || isSavingRef.current) return;

        // 기존 타이머 정리
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 새로운 타이머 설정
        timeoutRef.current = setTimeout(async () => {
            try {
                isSavingRef.current = true;
                await onSave();
            } catch (error) {
                logger.errorWithError(error, '자동 저장');
            } finally {
                isSavingRef.current = false;
            }
        }, delay);
    }, [delay, enabled, onSave]);

    // 의존성 변경 시 자동 저장 스케줄링
    useEffect(() => {
        scheduleSave();

        // 컴포넌트 언마운트 시 타이머 정리
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, dependencies);

    // 수동 저장 트리거
    const triggerSave = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        try {
            isSavingRef.current = true;
            await onSave();
        } catch (error) {
            logger.errorWithError(error, '수동 저장');
            throw error;
        } finally {
            isSavingRef.current = false;
        }
    }, [onSave]);

    return {
        triggerSave,
    };
}