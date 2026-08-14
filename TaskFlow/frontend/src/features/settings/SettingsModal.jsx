import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./SettingsModal.css";

function SettingsModal({
  isOpen,
  onClose,
  boardName,
  onSaveBoardName,
  darkMode,
  onToggleDarkMode,
}) {
  const [name, setName] = useState(boardName || "TaskFlow Board");
  const [userName, setUserName] = useState("User");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (boardName) setName(boardName);
  }, [boardName]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveBoardName) {
      onSaveBoardName(name);
    }
    onClose();
  };

  const modalContent = (
    <div
      className="settings-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title-section">
            <div className="settings-icon-badge">⚙</div>
            <div>
              <h2>Settings & Workspace</h2>
              <p>Manage your account preferences and TaskFlow board configuration.</p>
            </div>
          </div>
          <button
            type="button"
            className="settings-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-body">
          {/* USER PROFILE */}
          <div className="settings-section">
            <h3 className="settings-section-title">User Profile</h3>
            <div className="settings-group">
              <label htmlFor="user-name">Display Name</label>
              <input
                id="user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>

          {/* BOARD CONFIG */}
          <div className="settings-section">
            <h3 className="settings-section-title">Board Settings</h3>
            <div className="settings-group">
              <label htmlFor="board-name">Board Name</label>
              <input
                id="board-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="settings-section">
            <h3 className="settings-section-title">Preferences</h3>
            <div className="settings-row">
              <div className="settings-row-text">
                <strong>Email Notifications</strong>
                <span>Receive updates when tasks are moved or edited.</span>
              </div>
              <input
                type="checkbox"
                className="toggle-switch"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-text">
                <strong>Dark Mode Contrast</strong>
                <span>Enable high-contrast dark theme across TaskFlow workspace.</span>
              </div>
              <input
                type="checkbox"
                className="toggle-switch"
                checked={Boolean(darkMode)}
                onChange={onToggleDarkMode}
              />
            </div>
          </div>

          <div className="settings-footer">
            <button
              type="button"
              className="settings-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="settings-save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default SettingsModal;
