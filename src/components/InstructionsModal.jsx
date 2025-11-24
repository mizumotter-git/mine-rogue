import React from 'react';
import { X, MousePointer2, Flag, Shield } from 'lucide-react';

const InstructionsModal = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>How to Play</h2>

                <div className="instruction-section">
                    <h3><Shield size={20} color="#00d9ff" /> Objective</h3>
                    <p>Clear all safe cells to descend to the next depth. If you reveal a mine, the sequence ends immediately.</p>
                </div>

                <div className="instruction-section">
                    <h3>Controls</h3>
                    <div className="control-row">
                        <div className="icon-box"><MousePointer2 size={20} /></div>
                        <div>
                            <strong>Left Click</strong>
                            <p>Reveal a cell.</p>
                        </div>
                    </div>
                    <div className="control-row">
                        <div className="icon-box"><Flag size={20} /></div>
                        <div>
                            <strong>Right Click</strong>
                            <p>Flag a suspected mine.</p>
                        </div>
                    </div>
                </div>

                <div className="instruction-section">
                    <h3>Logic Data</h3>
                    <p>Use the numbers on the board AND the headers to deduce mine locations.</p>
                    <div className="example-box">
                        <div className="example-row">
                            <span className="highlight">Row/Col Headers:</span> Show total mines in that line.
                        </div>
                        <div className="example-row">
                            <span className="highlight">Cell Numbers:</span> Show mines in adjacent 8 cells.
                        </div>
                    </div>
                </div>

                <button className="action-button" onClick={onClose}>Initialize</button>
            </div>
        </div>
    );
};

export default InstructionsModal;
