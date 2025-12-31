import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './GameStatusLog.module.css';

interface GameStatusLogProps {
  logs: Array<{ message: string; timestamp: number }>;
}

export const GameStatusLog: React.FC<GameStatusLogProps> = ({ logs }) => {
  const logContentRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new logs are added (without triggering focus)
  React.useEffect(() => {
    if (logContentRef.current) {
      logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      className={styles.logContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.logTitle}>Game Log</div>
      <div className={styles.logContent} ref={logContentRef}>
        <AnimatePresence>
          {logs.length === 0 ? (
            <div className={styles.emptyState}>No events yet</div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={`${index}-${log.timestamp}`}
                className={styles.logEntry}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <span className={styles.entryNumber}>{index + 1}.</span>
                <span className={styles.entryText}>{log.message}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
