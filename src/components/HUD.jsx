import React from 'react';
import { Heart, Zap, Shield, Coins } from 'lucide-react';

const HUD = ({ depth, minesLeft, message }) => {
    return (
        <div className="hud">
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

            <div className="message-log">
                {message || "Analyze the patterns..."}
            </div>
        </div>
    );
};

export default HUD;
