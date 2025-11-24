import { Heart, Zap, Shield, HelpCircle } from 'lucide-react';

const HUD = ({ depth, minesLeft, message, onShowInstructions }) => {
    return (
        <div className="hud">
            <div className="hud-header">
                <div className="stats-row">
                    <div className="stat-group">
                        <div className="stat-label"><Shield size={16} color="#00d4ff" /> DEPTH</div>
                        <div className="stat-value">{depth}</div>
                    </div>

                    <div className="stat-group">
                        <div className="stat-label"><Zap size={16} color="#ff4444" /> MINES</div>
                        <div className="stat-value">{minesLeft}</div>
                    </div>
                </div>

                <button className="help-button" onClick={onShowInstructions} title="How to Play">
                    <HelpCircle size={24} color="#00d9ff" />
                </button>
            </div>

            <div className="message-log">
                {message || "Analyze the patterns..."}
            </div>
        </div>
    );
};

export default HUD;
