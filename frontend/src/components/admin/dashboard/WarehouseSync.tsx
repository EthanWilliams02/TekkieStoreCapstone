import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, FileText, Check } from 'lucide-react';
import './WarehouseSync.css';

interface WarehouseSyncProps {
  onSync?: () => Promise<void> | void;
}

export const WarehouseSync: React.FC<WarehouseSyncProps> = ({ onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Today at 10:45 AM');
  const [showLogModal, setShowLogModal] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      if (onSync) {
        await onSync();
      } else {
        // Small realistic simulated delay if no parent callback
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSynced(`Today at ${timeStr}`);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Warehouse sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="dashboard-card warehouse-sync-card">
        <div className="sync-card-left">
          <div className="sync-icon-bubble">
            <RefreshCw size={22} className={`sync-brand-icon ${isSyncing ? 'spinning' : ''}`} />
          </div>
          <div className="sync-details">
            <div className="sync-title-row">
              <h3 className="sync-title">Warehouse Sync</h3>
              <span className="sync-status-badge">
                <CheckCircle2 size={13} />
                <span>Synchronized</span>
              </span>
            </div>
            <p className="sync-description">
              Real-time synchronization with central warehouse inventory, TiDB cluster, and supplier SKUs.
            </p>
            <div className="sync-time-indicator">
              <span>Last synced:</span> <strong>{lastSynced}</strong>
            </div>
          </div>
        </div>

        <div className="sync-card-right">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setShowLogModal(true)}
            title="View recent warehouse sync audit log"
          >
            <FileText size={16} />
            <span>View Log</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSyncNow}
            disabled={isSyncing}
            title="Perform manual sync now"
          >
            {isSyncing ? (
              <>
                <RefreshCw size={16} className="spinning" />
                <span>Syncing...</span>
              </>
            ) : syncSuccess ? (
              <>
                <Check size={16} />
                <span>Synced!</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Sync Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SYNC AUDIT LOG MODAL */}
      {showLogModal && (
        <div className="admin-modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="admin-modal-card log-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Warehouse Sync Audit Log</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowLogModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="sync-log-list">
              <div className="log-item success">
                <span className="log-time">[10:45:12]</span>
                <span className="log-msg">SUCCESS: TiDB shoe catalogue synchronised (24 models verified).</span>
              </div>
              <div className="log-item success">
                <span className="log-time">[10:45:10]</span>
                <span className="log-msg">SUCCESS: ShoeVariant stock quantities updated across all size variants.</span>
              </div>
              <div className="log-item info">
                <span className="log-time">[10:45:08]</span>
                <span className="log-msg">INFO: Spring Boot REST API connection latency: 42ms.</span>
              </div>
              <div className="log-item success">
                <span className="log-time">[09:30:00]</span>
                <span className="log-msg">SUCCESS: Scheduled morning inventory sync complete without errors.</span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setShowLogModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarehouseSync;
